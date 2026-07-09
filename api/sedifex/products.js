const DEFAULT_SEDIFEX_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
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

function normalizeService(item) {
  const imageUrls = Array.isArray(item.imageUrls)
    ? item.imageUrls.filter(Boolean)
    : item.imageUrl
      ? [item.imageUrl]
      : [];

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
    imageUrl: item.imageUrl || imageUrls[0] || null,
    imageUrls,
    imageAlt: item.imageAlt || item.name || item.serviceName || "Jonhrega Travel and Tours service",
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
        "Sedifex integration is not configured. Add SEDIFEX_BOOKING_TARGET_STORE_ID and SEDIFEX_BOOKING_API_KEY in the website environment."
    });
  }

  const url = new URL("/v1IntegrationProducts", config.baseUrl);
  url.searchParams.set("storeId", config.storeId);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: sedifexHeaders(config.apiKey, config.contractVersion)
    });

    const body = parseMaybeJson(await response.text());

    if (!response.ok || body.ok === false) {
      return sendJson(res, response.status || 502, {
        ok: false,
        message: body.message || body.error || "Could not load Sedifex services.",
        status: response.status
      });
    }

    const services = collectServices(body);

    return sendJson(res, 200, {
      ok: true,
      storeId: body.storeId || config.storeId,
      count: services.length,
      services,
      products: body.products || [],
      publicProducts: body.publicProducts || [],
      publicServices: body.publicServices || []
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : "Sedifex service request failed."
    });
  }
}
