import { Link } from "react-router-dom";
import Container from "./Container";
import { company } from "../data/company";

export default function About() {
  return (
    <section id="about" className="section section--alt">
      <Container>
        <div className="twoCol">
          <div>
            <h2>About {company.name}</h2>
            <p>
              {company.name} is a licensed travel and tour company in Accra, Ghana. We support clients with visa preparation, study abroad guidance, flight booking, travel insurance, tour planning, and corporate travel arrangements.
            </p>
            <p>
              Our work is built around clear guidance, realistic timelines, document readiness, and fast communication. Whether you are preparing for a visa appointment, booking a flight, or planning a trip, our team helps you understand the next step before you spend money.
            </p>

            <div className="callout">
              <div className="callout__title">{company.licensedNote}</div>
              <div className="callout__text">{company.licenseNumberPlaceholder}</div>
              <div className="callout__hint">Appointments can be requested online, and our team will follow up with requirements, timeline, and next steps.</div>
            </div>

            <div className="actions">
              <Link className="btn" to="/booking">Book an Appointment</Link>
              <Link className="btn btn--ghost" to="/services">View Services</Link>
            </div>
          </div>

          <div className="infoBox aboutInfoBox">
            <h3>How we help you travel better</h3>
            <ul>
              <li>Clear service options before you book</li>
              <li>Document and requirement guidance</li>
              <li>Appointment-based support for better planning</li>
              <li>Secure online checkout when payment is required</li>
              <li>Support for individuals, families, and corporate teams</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
