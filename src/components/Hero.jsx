import Container from "./Container";
import { company } from "../data/company";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="hero">
      <Container className="hero__inner">
        <div className="hero__copy">
          <div className="badge">{company.licensedNote}</div>
          <h1 className="hero__title">Visa, Flights &amp; Study Abroad Made Easy</h1>
          <p className="hero__text">
            Schengen • UK • USA • Canada • UAE — Trusted Travel Experts in Ghana
          </p>

          <div className="hero__cta">
            <Link className="btn" to="/assessment">
              Start Your Application
            </Link>
            <Link className="btn btn--ghost" to="/services">
              Explore Our Services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
