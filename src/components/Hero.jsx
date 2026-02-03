import Container from "./Container";
import { company } from "../data/company";
import { Link } from "react-router-dom";

export default function Hero() {
  const wa = company.whatsappNumbers?.[0]?.value;
  const waLink = wa ? ("https://wa.me/" + wa) : null;

  return (
    <section className="hero">
      <Container className="hero__inner">
        <div className="hero__copy">
          <img
            className="hero__logo"
            src="/images/Log.jpg.jpeg"
            alt={`${company.name} logo`}
          />
          <div className="badge">{company.licensedNote}</div>
          <h1 className="hero__title">
            Travel, visa, and study-abroad support you can trust.
          </h1>
          <p className="hero__text">
            {company.name} helps individuals and companies with visa processing, study abroad guidance,
            flights, corporate travel management, medical tourism planning, and travel insurance.
          </p>

          <div className="hero__cta">
            <Link className="btn" to="/contact">
              Contact Us
            </Link>

            {waLink && (
              <a className="btn btn--ghost" href={waLink} target="_blank" rel="noreferrer">
                WhatsApp Now
              </a>
            )}
          </div>

          <div className="hero__meta">
            <div className="metaCard">
              <div className="metaCard__label">Email</div>
              <a href={"mailto:" + company.email}>{company.email}</a>
            </div>
            <div className="metaCard">
              <div className="metaCard__label">Phone</div>
              <a href={"tel:" + company.phones[0].value}>{company.phones[0].value}</a>
            </div>
            <div className="metaCard">
              <div className="metaCard__label">Website</div>
              <span>{company.website}</span>
            </div>
          </div>
        </div>

        <div className="hero__panel" aria-hidden="true">
          <div className="panelCard">
            <div className="panelCard__title">Quick Services</div>
            <ul className="panelCard__list">
              <li>Visa processing + interview prep</li>
              <li>Study abroad placement + admission</li>
              <li>Flights + hotel + transfers</li>
              <li>Corporate travel management</li>
              <li>Medical tourism arrangements</li>
              <li>Schengen-approved insurance</li>
            </ul>
          </div>

          <div className="panelCard panelCard--muted">
            <div className="panelCard__title">Trusted Guidance</div>
            <p className="panelCard__text">
              We help you prepare the right documents and plan your travel confidently.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
