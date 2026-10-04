const DEFAULT_SEDIFEX_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "public, max-age=30, s-maxage=120, stale-while-revalidate=300");
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

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
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
      message: "Tour departure availability is not configured yet."
    });
  }

  const incomingUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const url = new URL("/v1IntegrationAvailability", config.baseUrl);
  url.searchParams.set("storeId", config.storeId);

  const serviceId = clean(incomingUrl.searchParams.get("serviceId"));
  const from = clean(incomingUrl.searchParams.get("from"));
  const to = clean(incomingUrl.searchParams.get("to"));
  const eventKind = clean(incomingUrl.searchParams.get("eventKind")).toLowerCase();

  if (serviceId) url.searchParams.set("serviceId", serviceId);
  if (from) url.searchParams.set("from", from);
  if (to) url.searchParams.set("to", to);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: sedifexHeaders(config.apiKey, config.contractVersion)
    });
    const body = parseMaybeJson(await response.text());

    if (!response.ok || body.ok === false) {
      return sendJson(res, response.status || 502, {
        ok: false,
        message: body.message || body.error || "Could not load tour departures.",
        status: response.status
      });
    }

    const slots = Array.isArray(body.slots)
      ? body.slots.filter((slot) => {
          if (!slot || typeof slot !== "object") return false;
          if (eventKind && String(slot.eventKind || "").toLowerCase() !== eventKind) return false;
          return true;
        })
      : [];

    return sendJson(res, 200, {
      ok: true,
      storeId: body.storeId || config.storeId,
      serviceId: body.serviceId || serviceId || null,
      slots
    });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : "Tour departure request failed."
    });
  }
}
