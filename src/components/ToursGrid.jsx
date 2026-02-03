import Container from "./Container";
import { Link } from "react-router-dom";
import { tours } from "../data/tours";

function makeAssessmentLink(tour) {
  const destination = encodeURIComponent(tour.title);
  const purpose = encodeURIComponent("Tour Package Booking");
  return `/assessment?purpose=${purpose}&destination=${destination}`;
}

export default function ToursGrid() {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Tour Packages</h2>
          <p>
            Explore carefully curated experiences. Click “Book Now” to request pricing and availability.
          </p>
        </div>

        <div className="toursGrid">
          {tours.map((t) => (
            <div className="tourCard" key={t.slug}>
              <div className="tourCard__media">
                <img
                  src={t.image}
                  alt={t.title}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
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

                <div className="tourCard__price">{t.priceNote}</div>

                <ul className="tourCard__list">
                  {t.includes.map((x) => <li key={x}>{x}</li>)}
                </ul>

                <Link className="btn" to={makeAssessmentLink(t)}>
                  Book Now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
