import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { serviceSummary } from "../utils/serviceDisplay";
import { fetchSedifexTours } from "../utils/sedifexServices";
import {
  departureBookingPath,
  departuresForTour,
  fetchSedifexTourDepartures,
  formatDepartureRange
} from "../utils/sedifexTours";

function getDurationLabel(days) {
  const value = Number(days);
  if (!Number.isFinite(value) || value <= 0) return "Duration TBA";
  if (value <= 4) return "Short (1-4 days)";
  if (value <= 7) return "Medium (5-7 days)";
  return "Extended (8+ days)";
}

function formatDuration(tour) {
  const days = Number(tour?.tour?.durationDays);
  const nights = Number(tour?.tour?.durationNights);
  if (!Number.isFinite(days) || days <= 0) return "Duration to be announced";
  if (Number.isFinite(nights) && nights >= 0) {
    return `${days} day${days === 1 ? "" : "s"} / ${nights} night${nights === 1 ? "" : "s"}`;
  }
  return `${days} day${days === 1 ? "" : "s"}`;
}

function formatMoney(value, currency = "GHS") {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for price";

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: String(currency || "GHS").toUpperCase(),
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  } catch {
    return `${String(currency || "GHS").toUpperCase()} ${amount.toFixed(2)}`;
  }
}

function routeLabel(tour) {
  const start = tour?.tour?.startingCity;
  const end = tour?.tour?.endingCity;
  if (start && end) return `${start} → ${end}`;
  return start || end || tour?.tour?.destination || "";
}

function departureCanBook(slot) {
  return Boolean(
    slot &&
      slot.status === "open" &&
      slot.seatsRemaining > 0 &&
      (slot.startAt || slot.eventDate)
  );
}

function departureModeLabel(slot) {
  if (slot?.registrationMode === "deposit") return "Deposit booking";
  if (slot?.registrationMode === "enquiry") return "Enquiry only";
  if (slot?.registrationMode === "free") return "No payment required";
  return "Full payment";
}

function departurePriceLabel(slot, tour) {
  const currency = slot?.currency || tour?.currency || "GHS";

  if (slot?.registrationMode === "enquiry") return "Price on request";
  if (slot?.registrationMode === "free") return "No payment required";

  const fullPrice = slot?.price ?? tour?.price;
  const deposit = slot?.depositAmount ?? tour?.tour?.depositAmount;

  if (slot?.registrationMode === "deposit" && Number(deposit) > 0) {
    return `Deposit ${formatMoney(deposit, currency)} · Tour ${formatMoney(fullPrice, currency)}`;
  }

  return formatMoney(fullPrice, currency);
}

function seatsLabel(slot) {
  if (!slot) return "";
  if (slot.seatsRemaining <= 0) return "Fully booked";
  return `${slot.seatsRemaining} seat${slot.seatsRemaining === 1 ? "" : "s"} remaining`;
}

export default function ToursGrid() {
  const [tours, setTours] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [destination, setDestination] = useState("All");
  const [tourStyle, setTourStyle] = useState("All");
  const [duration, setDuration] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTours() {
      setLoading(true);
      setError("");

      try {
        const [nextTours, nextDepartures] = await Promise.all([
          fetchSedifexTours({ forceRefresh: refreshKey > 0, signal: controller.signal }),
          fetchSedifexTourDepartures({ forceRefresh: refreshKey > 0, signal: controller.signal })
        ]);

        if (controller.signal.aborted) return;
        setTours(nextTours);
        setDepartures(nextDepartures);
      } catch (err) {
        if (err?.name !== "AbortError" && !controller.signal.aborted) {
          setError(err?.message || "Could not load tour packages right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadTours();
    return () => controller.abort();
  }, [refreshKey]);

  const destinationOptions = useMemo(
    () => ["All", ...new Set(tours.map((tour) => tour?.tour?.destination).filter(Boolean))],
    [tours]
  );

  const tourStyleOptions = useMemo(
    () => ["All", ...new Set(tours.map((tour) => tour?.tour?.tourStyle).filter(Boolean))],
    [tours]
  );

  const durationOptions = useMemo(
    () => [
      "All",
      ...new Set(
        tours
          .map((tour) => getDurationLabel(tour?.tour?.durationDays))
          .filter((label) => label !== "Duration TBA")
      )
    ],
    [tours]
  );

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesDestination =
        destination === "All" || tour?.tour?.destination === destination;
      const matchesStyle =
        tourStyle === "All" || tour?.tour?.tourStyle === tourStyle;
      const durationLabel = getDurationLabel(tour?.tour?.durationDays);
      const matchesDuration = duration === "All" || durationLabel === duration;
      return matchesDestination && matchesStyle && matchesDuration;
    });
  }, [destination, duration, tourStyle, tours]);

  return (
    <section className="section">
      <Container>
        <div className="section__head section__head--split">
          <div>
            <h2>Tour Packages</h2>
            <p>
              Explore current Jonhrega packages, prices, inclusions, and upcoming departures.
              Tour information on this page is managed directly from our booking system.
            </p>
          </div>
          <div className="section__actions">
            <Link className="btn btn--ghost" to="/contact">
              Request a Custom Quote
            </Link>
          </div>
        </div>

        {!loading && !error && tours.length > 0 ? (
          <div className="filterBar" role="group" aria-label="Tour filters">
            <label className="filterField">
              <span>Destination</span>
              <select value={destination} onChange={(event) => setDestination(event.target.value)}>
                {destinationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="filterField">
              <span>Tour style</span>
              <select value={tourStyle} onChange={(event) => setTourStyle(event.target.value)}>
                {tourStyleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="filterField">
              <span>Duration</span>
              <select value={duration} onChange={(event) => setDuration(event.target.value)}>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {loading ? (
          <div className="emptyState" aria-live="polite">
            <h3>Loading current tour packages…</h3>
            <p>Please wait while we load the latest tours and departures.</p>
          </div>
        ) : error ? (
          <div className="emptyState" role="alert">
            <h3>We could not load the tour list</h3>
            <p>{error}</p>
            <div className="actions">
              <button className="btn" type="button" onClick={() => setRefreshKey((value) => value + 1)}>
                Try Again
              </button>
              <Link className="btn btn--ghost" to="/contact">Contact Jonhrega</Link>
            </div>
          </div>
        ) : tours.length === 0 ? (
          <div className="emptyState">
            <h3>No tour packages are published right now.</h3>
            <p>Our team can still prepare a custom itinerary for your destination and travel dates.</p>
            <Link className="btn" to="/contact">Request a Custom Quote</Link>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="emptyState">
            <h3>No tours match your filters.</h3>
            <p>Try another destination, style, or duration.</p>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setDestination("All");
                setTourStyle("All");
                setDuration("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="toursGrid">
            {filteredTours.map((tour) => {
              const tourDepartures = departuresForTour(departures, tour.id);
              const nextDeparture = tourDepartures[0] || null;
              const inclusions = Array.isArray(tour?.tour?.inclusions) ? tour.tour.inclusions : [];
              const exclusions = Array.isArray(tour?.tour?.exclusions) ? tour.tour.exclusions : [];
              const itinerary = Array.isArray(tour?.tour?.itinerary) ? tour.tour.itinerary : [];
              const summary =
                tour?.tour?.shortSummary ||
                serviceSummary(tour.description || "", 180);
              const price = nextDeparture?.price ?? tour.price;
              const currency = nextDeparture?.currency || tour.currency || "GHS";
              const route = routeLabel(tour);

              return (
                <article className="tourCard tourCard--live" key={tour.id}>
                  <div className="tourCard__media">
                    {tour.imageUrl ? (
                      <img
                        src={tour.imageUrl}
                        alt={tour.imageAlt || tour.name}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div className="tourCard__mediaFallback" aria-hidden="true" />
                    <span className="tourCard__liveBadge">Current package</span>
                  </div>

                  <div className="tourCard__body">
                    <div className="tourCard__subtitle">
                      {tour?.tour?.tourStyle || tour.category || "Tour package"}
                    </div>
                    <h3 className="tourCard__title">{tour.name}</h3>

                    <p className="tourCard__summary">{summary}</p>

                    <div className="tourCard__meta">
                      <span>{formatDuration(tour)}</span>
                      {route ? <><span>•</span><span>{route}</span></> : null}
                    </div>

                    <div className="tourCard__chips">
                      {tour?.tour?.destination ? <span>{tour.tour.destination}</span> : null}
                      {tour?.tour?.tourStyle ? <span>{tour.tour.tourStyle}</span> : null}
                      {tour?.tour?.capacity ? <span>Up to {tour.tour.capacity} travellers</span> : null}
                    </div>

                    <div className="tourCard__price">
                      {formatMoney(price, currency)}
                      {tour?.tour?.allowDepositPayment && tour?.tour?.depositAmount ? (
                        <small> · Deposit from {formatMoney(tour.tour.depositAmount, tour.currency || currency)}</small>
                      ) : null}
                    </div>

                    <section className="tourCard__departures" aria-label={`${tour.name} upcoming departures`}>
                      <div className="tourCard__departuresHeader">
                        <div>
                          <h4>Upcoming departures</h4>
                          <p>
                            {tourDepartures.length > 0
                              ? `${tourDepartures.length} available date${tourDepartures.length === 1 ? "" : "s"}`
                              : "No departure dates are published yet"}
                          </p>
                        </div>
                        {nextDeparture ? <span className="tourCard__nextBadge">Next · {formatDepartureRange(nextDeparture)}</span> : null}
                      </div>

                      {tourDepartures.length > 0 ? (
                        <div className="tourCard__departureList">
                          {tourDepartures.map((departure, index) => {
                            const canBook = departureCanBook(departure);
                            return (
                              <article
                                className={`tourCard__departureRow${canBook ? "" : " is-unavailable"}`}
                                key={departure.id}
                              >
                                <div className="tourCard__departureDate">
                                  <span>{index === 0 ? "Next departure" : "Departure"}</span>
                                  <strong>{formatDepartureRange(departure)}</strong>
                                </div>
                                <div className="tourCard__departureFacts">
                                  <span className={`tourCard__seatStatus${departure.seatsRemaining <= 0 ? " is-full" : ""}`}>
                                    {seatsLabel(departure)}
                                  </span>
                                  <span>{departureModeLabel(departure)}</span>
                                  {departure.location ? <span>{departure.location}</span> : null}
                                </div>
                                <div className="tourCard__departureBooking">
                                  <strong>{departurePriceLabel(departure, tour)}</strong>
                                  {canBook ? (
                                    <Link className="btn btn--small" to={departureBookingPath(tour, departure)}>
                                      Book this departure
                                    </Link>
                                  ) : (
                                    <span className="tourCard__soldOut">Fully booked</span>
                                  )}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="tourCard__noDepartures">
                          <p>Interested in this package? Send an enquiry and Jonhrega will confirm the next available travel date.</p>
                          <Link className="btn btn--small" to={`/booking?serviceId=${encodeURIComponent(tour.id)}`}>
                            Enquire about this tour
                          </Link>
                        </div>
                      )}
                    </section>

                    {inclusions.length > 0 ? (
                      <>
                        <h4 className="tourCard__subheading">Included</h4>
                        <ul className="tourCard__list">
                          {inclusions.slice(0, 5).map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </>
                    ) : null}

                    {(itinerary.length > 0 || exclusions.length > 0 || tour.imageUrls?.length > 1) ? (
                      <details className="tourCard__details">
                        <summary>View package details</summary>

                        {itinerary.length > 0 ? (
                          <div className="tourCard__itinerary">
                            <h4>Itinerary</h4>
                            {itinerary.map((day) => (
                              <div className="tourCard__day" key={`${day.day}-${day.title}`}>
                                <strong>Day {day.day}{day.title ? ` · ${day.title}` : ""}</strong>
                                {day.description ? <p>{day.description}</p> : null}
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {exclusions.length > 0 ? (
                          <div>
                            <h4>Not included</h4>
                            <ul className="tourCard__list">
                              {exclusions.map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        ) : null}

                        {tour.imageUrls?.length > 1 ? (
                          <div className="tourCard__gallery">
                            {tour.imageUrls.slice(1, 5).map((imageUrl, index) => (
                              <img
                                src={imageUrl}
                                alt={`${tour.name} photo ${index + 2}`}
                                loading="lazy"
                                key={imageUrl}
                              />
                            ))}
                          </div>
                        ) : null}
                      </details>
                    ) : null}

                    <div className="tourCard__actions">
                      <Link className="btn btn--ghost" to={`/booking?serviceId=${encodeURIComponent(tour.id)}`}>
                        Enquire About This Tour
                      </Link>
                      <Link className="btn btn--ghost" to="/contact">Request Custom Quote</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
