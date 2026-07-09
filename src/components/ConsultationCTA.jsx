import Container from "./Container";
import { Link } from "react-router-dom";

export default function ConsultationCTA({ eyebrow = "Let’s plan your next move" }) {
  return (
    <section className="section section--alt">
      <Container>
        <div className="ctaPanel">
          <div>
            <div className="ctaPanel__eyebrow">{eyebrow}</div>
            <h2 className="ctaPanel__title">Book a consultation appointment now.</h2>
            <p className="ctaPanel__text">
              Choose a live Sedifex service, reserve your preferred time, and continue to secure checkout when payment is required.
            </p>
          </div>
          <div className="ctaPanel__actions">
            <Link className="btn" to="/booking">
              Book Appointment
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
