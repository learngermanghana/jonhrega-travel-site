import Container from "./Container";
import { trustBadges } from "../data/trustBadges";
import { company } from "../data/company";

export default function TrustBadges() {
  return (
    <section className="section section--alt">
      <Container>
        <div className="section__head">
          <h2>Trust & Compliance</h2>
          <p>
            {company.name} is <strong>{company.licensedNote}</strong>. Add the official license number when ready.
          </p>
        </div>

        <div className="badgeGrid">
          {trustBadges.map((b) => (
            <div className="miniCard" key={b.title}>
              <div className="miniCard__title">{b.title}</div>
              <div className="miniCard__text">{b.text}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
