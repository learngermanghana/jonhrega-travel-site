import Container from "./Container";
import { testimonials } from "../data/testimonials";

export default function Testimonials() {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Testimonials</h2>
          <p>What clients say about our support and service.</p>
        </div>

        <div className="testimonialsGrid">
          {testimonials.map((t) => (
            <div className="quoteCard" key={t.name}>
              <div className="quoteCard__quote">“{t.quote}”</div>
              <div className="quoteCard__name">— {t.name}</div>
            </div>
          ))}
        </div>

        <div className="tiny" style={{ marginTop: ".8rem" }}>
          (Replace these with real client reviews anytime.)
        </div>
      </Container>
    </section>
  );
}
