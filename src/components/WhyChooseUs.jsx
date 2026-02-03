import Container from "./Container";

const highlights = [
  {
    title: "Licensed & locally based",
    text: "Work with a Ghana Tourism Authority licensed team that understands regional travel needs."
  },
  {
    title: "Personalized trip planning",
    text: "We build itineraries around your goals, budget, and timeline instead of one-size-fits-all packages."
  },
  {
    title: "Fast support & follow-up",
    text: "WhatsApp and phone support plus proactive updates as we coordinate bookings and documents."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Why Choose Jonhrega</h2>
          <p>Practical guidance, transparent communication, and travel expertise you can trust.</p>
        </div>
        <div className="highlightGrid">
          {highlights.map((item) => (
            <div className="highlightCard" key={item.title}>
              <h3 className="highlightCard__title">{item.title}</h3>
              <p className="highlightCard__text">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
