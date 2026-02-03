import Container from "./Container";
import { Link } from "react-router-dom";

export default function ConsultationCTA({ eyebrow = "Let’s plan your next move" }) {
  return (
    <section className="section section--alt">
      <Container>
        <div className="ctaPanel">
          <div>
            <div className="ctaPanel__eyebrow">{eyebrow}</div>
            <h2 className="ctaPanel__title">Book a consultation or request a callback.</h2>
            <p className="ctaPanel__text">
              Tell us your destination, dates, and goals. We’ll follow up with a clear plan and pricing.
            </p>
          </div>
          <div className="ctaPanel__actions">
            <Link className="btn" to="/assessment">
              Book a Consultation
            </Link>
            <Link className="btn btn--ghost" to="/contact">
              Request a Callback
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
