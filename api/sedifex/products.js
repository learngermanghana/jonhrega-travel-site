const DEFAULT_SEDIFEX_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";
const PRODUCT_CACHE_TTL_MS = Number(process.env.SEDIFEX_PRODUCTS_CACHE_TTL_MS || 15 * 60 * 1000);
const PRODUCT_CACHE_STALE_MS = Number(process.env.SEDIFEX_PRODUCTS_STALE_MS || 60 * 60 * 1000);

let cachedProducts = null;

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=900, stale-while-revalidate=3600");
  res.end(JSON.stringify(payload));
}

function getConfig() {
  const baseUrl =
    process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
    process.env.SEDIFEX_API_BASE_URL ||
    DEFAULT_SEDIFEX_BASE_URL;

  const storeId =
    process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
    process.env.SEDIFEX_STORE_ID ||
    "";

  const apiKey =
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_CHECKOUT_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    "";

  return {
    baseUrl,
    storeId,
    apiKey,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION || "2026-04-13"
  };
}

function sedifexHeaders(apiKey, contractVersion) {
  return {
    Accept: "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
    "X-Sedifex-Contract-Version": contractVersion
  };
}

function parseMaybeJson(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

function isService(item) {
  const itemType = String(item?.itemType || item?.item_type || "").toLowerCase();
  const type = String(item?.type || "").toUpperCase();
  return itemType === "service" || type === "SERVICE";
}

function getImageCandidate(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return (
      value.url ||
      value.src ||
      value.href ||
      value.downloadURL ||
      value.publicUrl ||
      value.public_url ||
      value.imageUrl ||
      null
    );
  }
  return null;
}

function collectImageUrls(item) {
  const candidates = [
    item.imageUrl,
    item.image,
    item.thumbnailUrl,
    item.thumbnail,
    item.photoUrl,
    item.photo,
    item.coverImage,
    item.coverImageUrl,
    item.primaryImage,
    item.primaryImageUrl,
    ...(Array.isArray(item.imageUrls) ? item.imageUrls : []),
    ...(Array.isArray(item.images) ? item.images : []),
    ...(Array.isArray(item.photos) ? item.photos : []),
    ...(Array.isArray(item.media) ? item.media : [])
  ];

  return Array.from(
    new Set(
      candidates
        .map(getImageCandidate)
        .filter(Boolean)
        .map((url) => String(url).trim())
        .filter((url) => url.length > 0)
    )
  );
}

function normalizeService(item) {
  const imageUrls = collectImageUrls(item);

  return {
    id: item.id || item.serviceId || item.itemId || item.item_id || item.name,
    storeId: item.storeId || null,
    name: item.name || item.serviceName || "Service",
    category: item.category || "Travel Services",
    brand: item.brand || item.manufacturerName || null,
    manufacturerName: item.manufacturerName || item.brand || null,
    description: item.description || item.summary || "Book this service with Jonhrega Travel and Tours.",
    price: typeof item.price === "number" ? item.price : Number(item.price || 0),
    priceMinor: item.priceMinor || null,
    stockCount: item.stockCount ?? null,
    itemType: item.itemType || item.item_type || "service",
    type: item.type || "SERVICE",
    imageUrl: imageUrls[0] || null,
    imageUrls,
    imageAlt: item.imageAlt || item.alt || item.name || item.serviceName || "Jonhrega Travel and Tours service",
    updatedAt: item.updatedAt || null
  };
}

function collectServices(data) {
  const candidates = [
    ...(Array.isArray(data.products) ? data.products : []),
    ...(Array.isArray(data.publicServices) ? data.publicServices : []),
    ...(Array.isArray(data.publicProducts) ? data.publicProducts : [])
  ];

  const seen = new Set();
  return candidates
    .filter((item) => item && isService(item))
    .map(normalizeService)
    .filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { ok: false, message: "Method not allowed" });
  }

  const config = getConfig();

  if (!config.storeId || !config.apiKey) {
    return sendJson(res, 500, {
      ok: false,
      message:
        "The online service list is not configured yet. Please contact Jonhrega Travel and Tours for assistance."
    });
  }

  const url = new URL("/v1IntegrationProducts", config.baseUrl);
  url.searchParams.set("storeId", config.storeId);

  const now = Date.now();
  if (cachedProducts && now - cachedProducts.savedAt <= PRODUCT_CACHE_TTL_MS) {
    return sendJson(res, 200, { ...cachedProducts.payload, cached: true });
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: sedifexHeaders(config.apiKey, config.contractVersion)
    });

    const body = parseMaybeJson(await response.text());

    if (!response.ok || body.ok === false) {
      return sendJson(res, response.status || 502, {
        ok: false,
        message: body.message || body.error || "Could not load services right now.",
        status: response.status
      });
    }

    const services = collectServices(body);

    const payload = {
      ok: true,
      storeId: body.storeId || config.storeId,
      count: services.length,
      services
    };
    cachedProducts = { payload, savedAt: Date.now() };

    return sendJson(res, 200, payload);
  } catch (error) {
    if (cachedProducts && Date.now() - cachedProducts.savedAt <= PRODUCT_CACHE_STALE_MS) {
      return sendJson(res, 200, { ...cachedProducts.payload, cached: true, stale: true });
    }

    return sendJson(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : "Service list request failed."
    });
  }
}
