import test from "node:test";
import assert from "node:assert/strict";
import { collectCatalog, normalizeItinerary, normalizeService } from "../api/sedifex/products.js";

const days = [
  { day: 7, title: "Amsterdam to Brussels and Paris", description: "Morning departure.\nBrussels city tour.\nEvening arrival in Paris." },
  { day: 5, title: "Frankfurt to Bonn, Cologne and Amsterdam", description: "Bonn visit.\nCologne cathedral.\nArrival in Amsterdam." },
  { day: 6, title: "Amsterdam and Zaanse Schans", description: "Windmills.\nVillage visit.\nReturn to Amsterdam." },
  { day: 1, title: "Arrival", description: "Welcome and hotel check-in." },
  { day: 4, title: "Frankfurt", description: "City excursion." },
  { day: 2, title: "Germany", description: "Sightseeing." },
  { day: 3, title: "Germany", description: "Guided visit." }
];

test("all seven day-by-day activities reach View package details in numerical order", () => {
  const raw = {
    id: "europe-tour",
    name: "Five-country European tour",
    type: "SERVICE",
    itemType: "service",
    sourceItemType: "tour_package",
    tour: { durationDays: 7, itinerary: days }
  };
  const { tours } = collectCatalog({ products: [raw] });
  assert.equal(tours.length, 1);
  assert.deepEqual(tours[0].tour.itinerary.map((entry) => entry.day), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(tours[0].tour.itinerary[4].description, /Cologne cathedral/);
  assert.match(tours[0].tour.itinerary[5].description, /Windmills/);
  assert.match(tours[0].tour.itinerary[6].description, /Brussels city tour/);
});

test("older empty nested itinerary does not hide the populated top-level itinerary", () => {
  const normalized = normalizeService({
    id: "europe-tour",
    itemType: "service",
    serviceKind: "tour_package",
    itinerary: days,
    inclusions: ["Six nights accommodation"],
    tour: { itinerary: [], inclusions: [], durationDays: 7 }
  });
  assert.equal(normalized.tour.itinerary.length, 7);
  assert.deepEqual(normalized.tour.inclusions, ["Six nights accommodation"]);
});

test("long day descriptions are kept complete and line breaks survive normalization", () => {
  const description = "Morning programme.\n" + "Full activity details, ".repeat(100);
  assert.ok(description.length > 1200);
  const normalized = normalizeItinerary([{ day: 1, title: "Arrival", description }]);
  assert.equal(normalized[0].description, description.trim());
});

test("equal titles on different days remain separate", () => {
  const normalized = normalizeItinerary([
    { day: 2, title: "City tour", description: "Second day" },
    { day: 1, title: "City tour", description: "First day" }
  ]);
  assert.deepEqual(normalized.map((day) => day.description), ["First day", "Second day"]);
});


test("legacy seven-day itinerary pasted into Day 1 is expanded without losing activities", () => {
  const programme = [
    "Day 1\nParis - Versailles - Paris\nVisit the palace.",
    "Day 2\nParis\nEnjoy the Seine.",
    "Day 3\nParis - Reims - Luxembourg\nExplore the old city.",
    "Day 4\nLuxembourg - Trier - Frankfurt\nVisit Trier.",
    "Day 5\nFrankfurt - Bonn - Cologne - Amsterdam\nVisit Bonn and Cologne cathedral.",
    "Day 6\nAmsterdam - Zaanse Schans - Amsterdam\nVisit windmills.",
    "Day 7\nAmsterdam - Brussels - Paris\nExplore Grand Place."
  ].join("\n\n");
  const original = "Hotels\nParis: 2 nights\nDay-by-Day Itinerary\n" + programme;
  const tour = normalizeService({
    id: "legacy-europe",
    name: "Europe tour",
    itemType: "service",
    serviceKind: "tour_package",
    tour: { itinerary: [{ day: 1, title: "France", description: original }] }
  });
  assert.equal(tour.tour.itinerary.length, 7);
  assert.deepEqual(tour.tour.itinerary.map((day) => day.day), [1, 2, 3, 4, 5, 6, 7]);
  assert.match(tour.tour.itinerary[0].overview, /Paris: 2 nights/);
  assert.match(tour.tour.itinerary[4].title, /Frankfurt - Bonn - Cologne - Amsterdam/);
  assert.match(tour.tour.itinerary[4].description, /Cologne cathedral/);
  assert.match(tour.tour.itinerary[5].description, /windmills/);
  assert.match(tour.tour.itinerary[6].description, /Grand Place/);
});

test("inline DAY 2 - title headings are supported without discarding programme lines", () => {
  const days = normalizeItinerary([{
    day: 1,
    title: "Arrival",
    description: "DAY 1- TOKYO ARRIVAL:\nTransfer to hotel.\n\nDAY 2 - TOKYO HIGHLIGHTS:\nVisit Tokyo Big Sight."
  }]);
  assert.deepEqual(days.map((day) => day.day), [1, 2]);
  assert.equal(days[0].title, "TOKYO ARRIVAL");
  assert.equal(days[0].description, "Transfer to hotel.");
  assert.equal(days[1].title, "TOKYO HIGHLIGHTS");
  assert.equal(days[1].description, "Visit Tokyo Big Sight.");
});


test("Japan package uses DAY 5 ~ and DAY. 6 with all six days", () => {
  const packed = [
    "DAY 1- TOKYO ARRIVAL:", "Airport transfer.",
    "DAY 2 - TOKYO", "Boat cruise.",
    "DAY 3- HAKONE", "Lake Ashi.",
    "DAY 4 - KYOTO", "Bullet train.",
    "DAY 5 ~ YOKOHAMA EXPLORATION", "Cable car.",
    "DAY. 6 - Hotel Transfer to Airport"
  ].join("\n");
  const days = normalizeItinerary([{ day: 1, title: "Tokyo", description: packed }]);
  assert.deepEqual(days.map((day) => day.day), [1, 2, 3, 4, 5, 6]);
  assert.equal(days[4].title, "YOKOHAMA EXPLORATION");
  assert.match(days[5].title, /Hotel Transfer to Airport/);
});

test("Dubai pipe-style Day N headings keep the activities", () => {
  const packed = Array.from({ length: 7 }, (_, i) => (
    "Day " + (i + 1) + " | " + (i === 6 ? "Departure" : "Tour") + ": Full activity for day " + (i + 1) + "."
  )).join("\n");
  const days = normalizeItinerary([{ day: 1, title: "Dubai", description: packed }]);
  assert.equal(days.length, 7);
  assert.equal(days[0].title, "Tour");
  assert.equal(days[6].title, "Departure");
  assert.equal(days[6].description, "Full activity for day 7.");
});

test("Ghana tour extracts DAY. 7 between Days 6 and 8", () => {
  const packed = Array.from({ length: 8 }, (_, i) =>
    "DAY" + (i === 6 ? "." : "") + " " + (i + 1) + " - Tour " + (i + 1) + "\nActivity " + (i + 1)
  ).join("\n");
  const days = normalizeItinerary([{ day: 1, title: "Accra", description: packed }]);
  assert.deepEqual(days.map((day) => day.day), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(days[6].description, "Activity 7");
});
