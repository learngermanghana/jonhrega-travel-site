const SERVICES_CACHE_KEY = "jonhrega:sedifex-services:v1";
const SERVICES_CACHE_TTL_MS = 15 * 60 * 1000;

let inFlightServicesRequest = null;
let memoryServicesCache = null;

function readStoredServices() {
  if (typeof window === "undefined") return null;

  try {
    const cached = JSON.parse(window.sessionStorage.getItem(SERVICES_CACHE_KEY) || "null");
    if (!cached || !Array.isArray(cached.services) || Date.now() - cached.savedAt > SERVICES_CACHE_TTL_MS) {
      return null;
    }
    return cached.services;
  } catch {
    return null;
  }
}

function storeServices(services) {
  memoryServicesCache = { services, savedAt: Date.now() };

  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(SERVICES_CACHE_KEY, JSON.stringify(memoryServicesCache));
  } catch {
    // If storage is unavailable or full, the in-memory cache still prevents duplicate calls per page load.
  }
}

export async function fetchSedifexServices({ forceRefresh = false } = {}) {
  if (!forceRefresh && memoryServicesCache && Date.now() - memoryServicesCache.savedAt <= SERVICES_CACHE_TTL_MS) {
    return memoryServicesCache.services;
  }

  if (!forceRefresh) {
    const storedServices = readStoredServices();
    if (storedServices) {
      memoryServicesCache = { services: storedServices, savedAt: Date.now() };
      return storedServices;
    }
  }

  if (!forceRefresh && inFlightServicesRequest) return inFlightServicesRequest;

  inFlightServicesRequest = fetch("/api/sedifex/products", {
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Could not load services right now.");
      }

      const services = Array.isArray(data.services) ? data.services : [];
      storeServices(services);
      return services;
    })
    .finally(() => {
      inFlightServicesRequest = null;
    });

  return inFlightServicesRequest;
}
