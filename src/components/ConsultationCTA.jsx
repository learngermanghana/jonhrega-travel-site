import Container from "./Container";
import { Link } from "react-router-dom";

export default function ConsultationCTA({ eyebrow = "Let’s plan your next move" }) {
  return (
    <section className="section section--alt">
      <Container>
        <div className="ctaPanel">
          <div>
            <div className="ctaPanel__eyebrow">{eyebrow}</div>
            <h2 className="ctaPanel__title">Plan your trip with Jonhrega</h2>
            <p className="ctaPanel__text">
              Tell us your destination and travel dates. Our team will help you choose a tour or arrange a trip around your plans.
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
