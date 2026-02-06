import Container from "./Container";
import { Link } from "react-router-dom";

const offers = [
  {
    title: "Canada – Study, Work Permit & PR",
    subtitle: "Canada visa from Ghana (Study • Work • PR)",
    description:
      "Apply for Canada student visa, Express Entry permanent residency, visitor visa or work permit with expert documentation support.",
    topic: "Canada: Student visa, Work Permit, Express Entry PR, or Visitor Visa",
    image: "/images/canada.jpeg"
  },
  {
    title: "United Kingdom – Tourist & Student Visa",
    subtitle: "UK visa application from Ghana",
    description:
      "Professional assistance for UK visitor visa, business travel, short-term study and family visit applications.",
    topic: "UK: Visitor visa, Student visa, Business travel, or Family visit",
    image: "/images/Uk.jpeg"
  },
  {
    title: "United States – B1/B2 Visitor Visa",
    subtitle: "USA B1/B2 visitor visa from Ghana",
    description:
      "Guidance for US tourist and business visa applications including DS-160 review and interview preparation.",
    topic: "USA: B1/B2 Visitor Visa (DS-160 review + Interview prep)",
    image: "/images/usa.jpeg"
  }
];

function makeContactLink(topic) {
  const service = encodeURIComponent("Visa Processing Services");
  const t = encodeURIComponent(topic);
  return `/contact?service=${service}&topic=${t}`;
}

export default function HomeOffers() {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Affordable Flights, Tours & Visa Support</h2>
          <p>
            Book affordable international flights, explore carefully curated tour experiences,
            and receive professional visa guidance and application support.
          </p>
        </div>

        <div className="offersGrid">
          {offers.map((o) => (
            <div className="offerCard" key={o.title}>
              <div className="offerCard__media">
                {/* Optional photo. If not found, it hides automatically. */}
                <img
                  src={o.image}
                  alt={o.title}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="offerCard__mediaFallback" aria-hidden="true" />
              </div>

              <div className="offerCard__body">
                <div className="offerCard__subtitle">{o.subtitle}</div>
                <h3 className="offerCard__title">{o.title}</h3>
                <p className="offerCard__text">{o.description}</p>

                <Link className="offerCard__link" to={makeContactLink(o.topic)}>
                  Apply Now <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
