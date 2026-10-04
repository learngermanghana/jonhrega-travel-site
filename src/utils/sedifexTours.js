const DEPARTURE_CACHE_TTL_MS = 5 * 60 * 1000;
let departureCache = null;
let inFlightDepartureRequest = null;

function dateRange() {
  const from = new Date();
  from.setHours(0, 0, 0, 0);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 18);
  return { from: from.toISOString(), to: to.toISOString() };
}

function normalizeSlots(value) {
  return Array.isArray(value)
    ? value
        .filter((slot) => slot && typeof slot === "object" && String(slot.eventKind || "").toLowerCase() === "trip")
        .map((slot) => ({
          ...slot,
          id: String(slot.id || ""),
          serviceId: String(slot.serviceId || ""),
          status: slot.status === "closed" ? "closed" : "open",
          seatsRemaining: Math.max(0, Number(slot.seatsRemaining) || 0),
          capacity: Math.max(0, Number(slot.capacity) || 0),
          price: slot.price == null ? null : Number(slot.price),
          depositAmount: slot.depositAmount == null ? null : Number(slot.depositAmount),
          currency: String(slot.currency || "GHS").toUpperCase()
        }))
        .filter((slot) => slot.id && slot.serviceId)
    : [];
}

export async function fetchSedifexTourDepartures({ forceRefresh = false, signal } = {}) {
  if (!forceRefresh && departureCache && Date.now() - departureCache.savedAt <= DEPARTURE_CACHE_TTL_MS) {
    return departureCache.slots;
  }

  if (!forceRefresh && inFlightDepartureRequest) return inFlightDepartureRequest;

  const range = dateRange();
  const params = new URLSearchParams({
    eventKind: "trip",
    from: range.from,
    to: range.to
  });

  inFlightDepartureRequest = fetch(`/api/sedifex/availability?${params.toString()}`, {
    signal,
    headers: { Accept: "application/json" }
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Could not load tour departures right now.");
      }
      const slots = normalizeSlots(data.slots);
      departureCache = { slots, savedAt: Date.now() };
      return slots;
    })
    .finally(() => {
      inFlightDepartureRequest = null;
    });

  return inFlightDepartureRequest;
}

export function departuresForTour(slots, tourId) {
  return slots
    .filter((slot) => slot.serviceId === tourId && slot.status === "open")
    .sort((a, b) => {
      const left = a.startAt || (a.eventDate ? `${a.eventDate}T00:00:00Z` : "");
      const right = b.startAt || (b.eventDate ? `${b.eventDate}T00:00:00Z` : "");
      if (!left && !right) return 0;
      if (!left) return 1;
      if (!right) return -1;
      return new Date(left).getTime() - new Date(right).getTime();
    });
}

export function formatDepartureDate(slot) {
  if (!slot) return "Departure date to be announced";
  if (slot.displayDateText) return slot.displayDateText;

  const source = slot.startAt || (slot.eventDate ? `${slot.eventDate}T00:00:00Z` : "");
  if (!source) return "Departure date to be announced";

  const parsed = new Date(source);
  if (Number.isNaN(parsed.getTime())) return slot.eventDate || "Departure date to be announced";

  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: slot.timezone || "Africa/Accra"
  }).format(parsed);
}

export function departureBookingPath(tour, slot) {
  const params = new URLSearchParams({ serviceId: tour.id });
  if (slot?.id) params.set("slotId", slot.id);
  return `/booking?${params.toString()}`;
}
