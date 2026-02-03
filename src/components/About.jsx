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
              We are a travel and tour company based in Accra, supporting clients with international travel
              planning, visa services, study abroad guidance, corporate travel management, and more.
            </p>
            <p>
              Our goal is simple: help you prepare properly, reduce stress, and travel with confidence.
            </p>

            <div className="callout">
              <div className="callout__title">{company.licensedNote}</div>
              <div className="callout__text">{company.licenseNumberPlaceholder}</div>
              <div className="callout__hint">
                (Add the official license number here once you have it.)
              </div>
            </div>
          </div>

          <div className="infoBox">
            <h3>Why clients choose us</h3>
            <ul>
              <li>Clear requirements and document guidance</li>
              <li>Fast, professional communication</li>
              <li>Support for individuals and corporate teams</li>
              <li>End-to-end travel planning when needed</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
