import { useMemo, useState } from "react";
import Container from "./Container";
import { Link } from "react-router-dom";
import { tours } from "../data/tours";

function makeAssessmentLink(tour) {
  const destination = encodeURIComponent(tour.title);
  const purpose = encodeURIComponent("Tour Package Booking");
  return `/assessment?purpose=${purpose}&destination=${destination}`;
}

function getDurationLabel(days) {
  if (days <= 4) return "Short (1-4 days)";
  if (days <= 7) return "Medium (5-7 days)";
  return "Extended (8+ days)";
}

export default function ToursGrid() {
  const [destination, setDestination] = useState("All");
  const [budget, setBudget] = useState("All");
  const [duration, setDuration] = useState("All");

  const destinationOptions = useMemo(
    () => ["All", ...new Set(tours.map((tour) => tour.destination))],
    []
  );
  const budgetOptions = useMemo(
    () => ["All", ...new Set(tours.map((tour) => tour.budget))],
    []
  );
  const durationOptions = useMemo(
    () => ["All", ...new Set(tours.map((tour) => getDurationLabel(tour.durationDays)))],
    []
  );

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesDestination = destination === "All" || tour.destination === destination;
      const matchesBudget = budget === "All" || tour.budget === budget;
      const matchesDuration = duration === "All" || getDurationLabel(tour.durationDays) === duration;
      return matchesDestination && matchesBudget && matchesDuration;
    });
  }, [destination, budget, duration]);

  return (
    <section className="section">
      <Container>
        <div className="section__head section__head--split">
          <div>
            <h2>Tour Packages</h2>
            <p>
              Explore carefully curated experiences. Filter by destination, budget, or duration to
              find the right option.
            </p>
          </div>
          <div className="section__actions">
            <Link className="btn btn--ghost" to="/contact">
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="filterBar" role="group" aria-label="Tour filters">
          <label className="filterField">
            <span>Destination</span>
            <select value={destination} onChange={(event) => setDestination(event.target.value)}>
              {destinationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="filterField">
            <span>Budget</span>
            <select value={budget} onChange={(event) => setBudget(event.target.value)}>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="filterField">
            <span>Duration</span>
            <select value={duration} onChange={(event) => setDuration(event.target.value)}>
              {durationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredTours.length === 0 ? (
          <div className="emptyState">
            <h3>No tours match your filters.</h3>
            <p>Try adjusting the filters or request a custom quote for a tailored itinerary.</p>
            <Link className="btn" to="/contact">
              Request a Custom Quote
            </Link>
          </div>
        ) : (
          <div className="toursGrid">
            {filteredTours.map((t) => (
              <div className="tourCard" key={t.slug}>
                <div className="tourCard__media">
                  <img
                    src={t.image}
                    alt={t.title}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="tourCard__mediaFallback" aria-hidden="true" />
                </div>

                <div className="tourCard__body">
                  <div className="tourCard__subtitle">{t.subtitle}</div>
                  <h3 className="tourCard__title">{t.title}</h3>

                  <div className="tourCard__meta">
                    <span>{t.duration}</span>
                    <span>•</span>
                    <span>{t.dateRange}</span>
                  </div>

                  <div className="tourCard__chips">
                    <span>{t.destination}</span>
                    <span>{t.budget}</span>
                  </div>

                  <div className="tourCard__price">{t.priceNote}</div>

                  <ul className="tourCard__list">
                    {t.includes.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>

                  <div className="tourCard__actions">
                    <Link className="btn" to={makeAssessmentLink(t)}>
                      Book Now <span aria-hidden="true">→</span>
                    </Link>
                    <Link className="btn btn--ghost" to="/contact">
                      Request Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
