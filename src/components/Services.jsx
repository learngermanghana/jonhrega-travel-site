import Container from "./Container";
import { services } from "../data/services";

function ServiceCard({ title, items }) {
  return (
    <div className="card">
      <h3 className="card__title">{title}</h3>
      <ul className="card__list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section">
      <Container>
        <div className="section__head">
          <h2>Services</h2>
          <p>
            Choose the support you need — from visas and admissions to full travel planning.
          </p>
        </div>

        <div className="grid">
          {services.map((s) => (
            <ServiceCard key={s.title} title={s.title} items={s.items} />
          ))}
        </div>
      </Container>
    </section>
  );
}
