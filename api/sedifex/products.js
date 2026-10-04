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

function isTourPackage(item) {
  const sourceItemType = String(item?.sourceItemType || item?.source_item_type || item?.itemType || item?.item_type || "").toLowerCase();
  const serviceKind = String(item?.serviceKind || item?.service_kind || "").toLowerCase();
  return sourceItemType === "tour_package" || serviceKind === "tour_package" || Boolean(item?.tour);
}

function cleanStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => String(entry || "").trim())
    .filter(Boolean);
}

function normalizeItinerary(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry, index) => ({
      day: Math.max(1, Number(entry?.day) || index + 1),
      title: String(entry?.title || "").trim(),
      description: String(entry?.description || "").trim()
    }))
    .filter((entry) => entry.title || entry.description);
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
  const rawTour = item.tour && typeof item.tour === "object" ? item.tour : {};
  const sourceItemType = item.sourceItemType || item.source_item_type || item.itemType || item.item_type || null;
  const serviceKind = item.serviceKind || item.service_kind || null;
  const tourPackage = isTourPackage(item);

  return {
    id: item.id || item.serviceId || item.itemId || item.item_id || item.name,
    storeId: item.storeId || null,
    name: item.name || item.serviceName || "Service",
    category: item.category || (tourPackage ? "Travel & Tours" : "Travel Services"),
    brand: item.brand || item.manufacturerName || null,
    manufacturerName: item.manufacturerName || item.brand || null,
    description: item.description || item.summary || "Book this service with Jonhrega Travel and Tours.",
    price: typeof item.price === "number" ? item.price : Number(item.price || 0),
    priceMinor: item.priceMinor || null,
    currency: String(item.currency || "GHS").trim().toUpperCase() || "GHS",
    stockCount: item.stockCount ?? null,
    itemType: item.itemType || item.item_type || "service",
    type: item.type || "SERVICE",
    serviceKind,
    sourceItemType,
    isTourPackage: tourPackage,
    tour: tourPackage
      ? {
          destination: rawTour.destination || item.destination || null,
          tourStyle: rawTour.tourStyle || item.tourStyle || null,
          durationDays: Number(rawTour.durationDays ?? item.durationDays) || null,
          durationNights: Number(rawTour.durationNights ?? item.durationNights) || null,
          startingCity: rawTour.startingCity || item.startingCity || null,
          endingCity: rawTour.endingCity || item.endingCity || null,
          shortSummary: rawTour.shortSummary || item.shortSummary || null,
          itinerary: normalizeItinerary(rawTour.itinerary || item.itinerary),
          inclusions: cleanStringArray(rawTour.inclusions || item.inclusions),
          exclusions: cleanStringArray(rawTour.exclusions || item.exclusions),
          capacity: Number(rawTour.capacity ?? item.capacity) || null,
          allowDepositPayment: rawTour.allowDepositPayment === true || item.allowDepositPayment === true,
          depositAmount: Number(rawTour.depositAmount ?? item.depositAmount) || null
        }
      : null,
    imageUrl: imageUrls[0] || null,
    imageUrls,
    imageAlt: item.imageAlt || item.alt || item.name || item.serviceName || "Jonhrega Travel and Tours service",
    updatedAt: item.updatedAt || null
  };
}

function collectCatalog(data) {
  const candidates = [
    ...(Array.isArray(data.products) ? data.products : []),
    ...(Array.isArray(data.publicServices) ? data.publicServices : []),
    ...(Array.isArray(data.publicProducts) ? data.publicProducts : [])
  ];

  const seen = new Set();
  const normalized = candidates
    .filter((item) => item && isService(item))
    .map(normalizeService)
    .filter((item) => {
      if (!item.id || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

  return {
    services: normalized.filter((item) => !item.isTourPackage),
    tours: normalized.filter((item) => item.isTourPackage)
  };
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

    const { services, tours } = collectCatalog(body);

    const payload = {
      ok: true,
      storeId: body.storeId || config.storeId,
      count: services.length + tours.length,
      serviceCount: services.length,
      tourCount: tours.length,
      services,
      tours
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
