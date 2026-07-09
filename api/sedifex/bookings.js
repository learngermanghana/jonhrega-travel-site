const DEFAULT_SEDIFEX_BASE_URL = "https://us-central1-sedifex-web.cloudfunctions.net";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function getConfig(req) {
  const baseUrl =
    process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
    process.env.SEDIFEX_API_BASE_URL ||
    DEFAULT_SEDIFEX_BASE_URL;

  const storeId =
    process.env.SEDIFEX_BOOKING_TARGET_STORE_ID ||
    process.env.SEDIFEX_STORE_ID ||
    "";

  const bookingApiKey =
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_CHECKOUT_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    "";

  const checkoutApiKey =
    process.env.SEDIFEX_CHECKOUT_API_KEY ||
    process.env.SEDIFEX_BOOKING_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    "";

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "www.jonhregatravelandtours.com";
  const fallbackReturnUrl = `${proto}://${host}/booking/thank-you`;

  return {
    baseUrl,
    storeId,
    bookingApiKey,
    checkoutApiKey,
    checkoutCreateUrl:
      process.env.SEDIFEX_INTEGRATION_CHECKOUT_CREATE_URL ||
      `${DEFAULT_SEDIFEX_BASE_URL}/integrationCheckoutCreate`,
    checkoutReturnUrl: process.env.SEDIFEX_CHECKOUT_RETURN_URL || fallbackReturnUrl,
    contractVersion: process.env.SEDIFEX_CONTRACT_VERSION || "2026-04-13"
  };
}

function sedifexHeaders(apiKey, contractVersion) {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": apiKey,
    Authorization: `Bearer ${apiKey}`,
    "X-Sedifex-Contract-Version": contractVersion
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return req.body ? JSON.parse(req.body) : {};

  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function parseMaybeJson(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

function asPositiveNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

function getBookingId(data) {
  return (
    data.bookingId ||
    data.id ||
    data.booking?.bookingId ||
    data.booking?.id ||
    data.data?.bookingId ||
    data.data?.id ||
    data.result?.bookingId ||
    data.result?.id ||
    null
  );
}

function getCheckoutUrl(data) {
  return (
    data.authorizationUrl ||
    data.authorization_url ||
    data.checkoutUrl ||
    data.checkout_url ||
    data.url ||
    data.data?.authorizationUrl ||
    data.data?.authorization_url ||
    data.data?.checkoutUrl ||
    data.data?.checkout_url ||
    data.payment?.authorizationUrl ||
    data.payment?.authorization_url ||
    null
  );
}

async function proxyReadBookings(req, res, config) {
  const incomingUrl = new URL(req.url, `https://${req.headers.host || "localhost"}`);
  const url = new URL("/v1IntegrationBookings", config.baseUrl);
  url.searchParams.set("storeId", config.storeId);

  ["status", "serviceId"].forEach((key) => {
    const value = incomingUrl.searchParams.get(key);
    if (value) url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: "GET",
    headers: sedifexHeaders(config.bookingApiKey, config.contractVersion)
  });
  const body = parseMaybeJson(await response.text());
  return sendJson(res, response.status || 200, body);
}

async function createBookingAndCheckout(req, res, config) {
  const body = await readJsonBody(req);
  const serviceId = body.serviceId || body.selectedServiceId || null;
  const slotId = body.slotId || null;
  const serviceName = body.serviceName || "Travel service appointment";
  const quantity = Math.max(1, Math.floor(asPositiveNumber(body.quantity, 1)));
  const paymentAmount = asPositiveNumber(body.paymentAmount, 0);
  const customer = body.customer || {};

  if (!serviceId && !slotId) {
    return sendJson(res, 400, { ok: false, message: "Select a service before booking." });
  }

  if (!body.bookingDate || !body.bookingTime) {
    return sendJson(res, 400, { ok: false, message: "Choose an appointment date and time." });
  }

  if (!customer.name || !customer.phone) {
    return sendJson(res, 400, { ok: false, message: "Customer name and phone are required." });
  }

  const now = new Date().toISOString();
  const paymentMethod = paymentAmount > 0 ? "paystack_checkout" : body.paymentMethod || "manual";

  const bookingPayload = {
    ...(serviceId ? { serviceId } : {}),
    ...(slotId ? { slotId } : {}),
    serviceName,
    bookingDate: body.bookingDate,
    bookingTime: body.bookingTime,
    quantity,
    notes: body.notes || "",
    customer: {
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone
    },
    paymentMethod,
    paymentAmount,
    sourceChannel: "client_website",
    bookingStatus: "booked",
    paymentCollectionMode: paymentAmount > 0 ? "online_checkout" : "manual",
    paymentStatus: paymentAmount > 0 ? "checkout_created" : "not_required",
    syncStatus: "pending",
    syncRequestedAt: now,
    attributes: {
      source: "website_booking_form",
      sourceLabel: "Client website",
      channel: "client-website",
      orderType: "service",
      pageUrl: body.attributes?.pageUrl || "https://www.jonhregatravelandtours.com/booking",
      timezone: body.attributes?.timezone || "Africa/Accra",
      locale: body.attributes?.locale || "en-GB",
      selectedBranchStoreId: config.storeId,
      selectedBranchServiceId: serviceId || null,
      ...body.attributes
    }
  };

  const bookingUrl = new URL("/v1IntegrationBookings", config.baseUrl);
  bookingUrl.searchParams.set("storeId", config.storeId);

  const bookingResponse = await fetch(bookingUrl, {
    method: "POST",
    headers: sedifexHeaders(config.bookingApiKey, config.contractVersion),
    body: JSON.stringify(bookingPayload)
  });

  const bookingData = parseMaybeJson(await bookingResponse.text());

  if (!bookingResponse.ok || bookingData.ok === false) {
    return sendJson(res, bookingResponse.status || 502, {
      ok: false,
      message: bookingData.message || bookingData.error || "Could not create booking.",
      details: bookingData
    });
  }

  const bookingId = getBookingId(bookingData) || `bk_${Date.now()}`;

  if (paymentAmount <= 0 || paymentMethod !== "paystack_checkout") {
    return sendJson(res, 200, {
      ok: true,
      bookingId,
      paymentRequired: false,
      thankYouUrl: `/booking/thank-you?bookingId=${encodeURIComponent(bookingId)}`,
      message: "Appointment created. Staff will confirm payment or next steps."
    });
  }

  const clientOrderId = `BOOKING-${bookingId}`;
  const checkoutPayload = {
    storeId: config.storeId,
    merchantId: config.storeId,
    clientOrderId,
    orderType: "service",
    sourceChannel: "client_website",
    sourceLabel: "Client Website",
    currency: "GHS",
    amount: paymentAmount,
    customer: bookingPayload.customer,
    items: [
      {
        id: serviceId || slotId,
        item_id: serviceId || slotId,
        serviceId: serviceId || undefined,
        slotId: slotId || undefined,
        name: serviceName,
        serviceName,
        unitPrice: paymentAmount / quantity,
        price: paymentAmount / quantity,
        qty: quantity,
        quantity,
        type: "SERVICE",
        item_type: "service"
      }
    ],
    returnUrl: config.checkoutReturnUrl,
    metadata: {
      bookingId,
      clientOrderId,
      channel: "client-website",
      source: "website_booking_form"
    }
  };

  const checkoutResponse = await fetch(config.checkoutCreateUrl, {
    method: "POST",
    headers: sedifexHeaders(config.checkoutApiKey, config.contractVersion),
    body: JSON.stringify(checkoutPayload)
  });

  const checkoutData = parseMaybeJson(await checkoutResponse.text());

  if (!checkoutResponse.ok || checkoutData.ok === false) {
    return sendJson(res, checkoutResponse.status || 502, {
      ok: false,
      bookingCreated: true,
      bookingId,
      thankYouUrl: `/booking/thank-you?bookingId=${encodeURIComponent(bookingId)}`,
      message:
        checkoutData.message ||
        checkoutData.error ||
        "Booking was created, but Paystack checkout could not be started.",
      details: checkoutData
    });
  }

  const checkoutUrl = getCheckoutUrl(checkoutData);

  return sendJson(res, 200, {
    ok: true,
    bookingId,
    clientOrderId,
    paymentRequired: true,
    checkoutUrl,
    authorizationUrl: checkoutUrl,
    checkoutReference:
      checkoutData.reference || checkoutData.data?.reference || checkoutData.paymentReference || null
  });
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET, POST, OPTIONS");
    return sendJson(res, 204, {});
  }

  const config = getConfig(req);

  if (!config.storeId || !config.bookingApiKey) {
    return sendJson(res, 500, {
      ok: false,
      message:
        "The online booking system is not configured yet. Please contact Jonhrega Travel and Tours for assistance."
    });
  }

  try {
    if (req.method === "GET") return await proxyReadBookings(req, res, config);
    if (req.method === "POST") return await createBookingAndCheckout(req, res, config);

    res.setHeader("Allow", "GET, POST, OPTIONS");
    return sendJson(res, 405, { ok: false, message: "Method not allowed" });
  } catch (error) {
    return sendJson(res, 500, {
      ok: false,
      message: error instanceof Error ? error.message : "Booking request failed."
    });
  }
}
