const CATALOG_CACHE_KEY = "jonhrega:sedifex-catalog:v3";
const CATALOG_CACHE_TTL_MS = 15 * 60 * 1000;

let inFlightCatalogRequest = null;
let memoryCatalogCache = null;

function emptyCatalog() {
  return { services: [], tours: [], currencyConversion: null };
}

function normalizeCatalog(value) {
  const services = Array.isArray(value?.services) ? value.services : [];
  const tours = Array.isArray(value?.tours) ? value.tours : [];
  const currencyConversion =
    value?.currencyConversion && typeof value.currencyConversion === "object"
      ? value.currencyConversion
      : null;
  return { services, tours, currencyConversion };
}

function readStoredCatalog() {
  if (typeof window === "undefined") return null;

  try {
    const cached = JSON.parse(window.sessionStorage.getItem(CATALOG_CACHE_KEY) || "null");
    if (!cached || Date.now() - cached.savedAt > CATALOG_CACHE_TTL_MS) return null;
    return normalizeCatalog(cached.catalog);
  } catch {
    return null;
  }
}

function storeCatalog(catalog) {
  memoryCatalogCache = { catalog, savedAt: Date.now() };

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(CATALOG_CACHE_KEY, JSON.stringify(memoryCatalogCache));
  } catch {
    // In-memory cache still avoids duplicate requests when sessionStorage is unavailable.
  }
}

export async function fetchSedifexCatalog({ forceRefresh = false, signal } = {}) {
  if (!forceRefresh && memoryCatalogCache && Date.now() - memoryCatalogCache.savedAt <= CATALOG_CACHE_TTL_MS) {
    return memoryCatalogCache.catalog;
  }

  if (!forceRefresh) {
    const storedCatalog = readStoredCatalog();
    if (storedCatalog) {
      memoryCatalogCache = { catalog: storedCatalog, savedAt: Date.now() };
      return storedCatalog;
    }
  }

  if (!forceRefresh && inFlightCatalogRequest) return inFlightCatalogRequest;

  inFlightCatalogRequest = fetch("/api/sedifex/products", {
    signal,
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Could not load the Sedifex catalog right now.");
      }

      const catalog = normalizeCatalog(data);
      storeCatalog(catalog);
      return catalog;
    })
    .finally(() => {
      inFlightCatalogRequest = null;
    });

  return inFlightCatalogRequest;
}

export async function fetchSedifexServices(options = {}) {
  const catalog = await fetchSedifexCatalog(options);
  return catalog.services;
}

export async function fetchSedifexTours(options = {}) {
  const catalog = await fetchSedifexCatalog(options);
  return catalog.tours;
}

export async function fetchSedifexBookableItems(options = {}) {
  const catalog = await fetchSedifexCatalog(options);
  return [...catalog.services, ...catalog.tours];
}

export function clearSedifexCatalogCache() {
  memoryCatalogCache = null;
  inFlightCatalogRequest = null;

  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(CATALOG_CACHE_KEY);
  } catch {
    // Ignore storage cleanup failures.
  }
}

export { emptyCatalog };
