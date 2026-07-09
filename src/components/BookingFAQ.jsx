import Container from "./Container";

const faqs = [
  {
    question: "Do you guarantee visa approval?",
    answer:
      "No travel agency can guarantee visa approval. We help you prepare properly, understand requirements, and avoid common document mistakes. Final decisions are made by embassies, governments, visa centers, and border authorities."
  },
  {
    question: "Can I book an appointment before paying?",
    answer:
      "Yes. Some services can be requested first and our team will confirm the next steps. If the selected service requires payment, the booking form will send you to secure checkout after submission."
  },
  {
    question: "What happens after I pay?",
    answer:
      "After checkout, your payment is verified securely. Our team will then follow up with your appointment details, required documents, timeline, and the next action needed from you."
  },
  {
    question: "Can I reschedule my appointment?",
    answer:
      "You can contact us to request a new time. Rescheduling depends on staff availability, the type of service, and whether any third-party appointment or processing fee has already been used."
  },
  {
    question: "What documents do I need?",
    answer:
      "Document requirements depend on your destination and service type. Bring or prepare your passport, travel history, employment or school details, financial documents, and any invitation or admission documents when applicable."
  },
  {
    question: "Do you support Schengen, UK, USA, Canada, and UAE travel?",
    answer:
      "Yes. We support clients with travel planning and guidance for several destinations including Schengen countries, the UK, USA, Canada, UAE, and other international routes."
  }
];

export default function BookingFAQ() {
  return (
    <section className="section section--alt">
      <Container>
        <div className="section__head">
          <h2>Booking Questions</h2>
          <p>
            Read these quick answers before you submit your appointment request.
          </p>
        </div>

        <div className="faqGrid">
          {faqs.map((item) => (
            <details className="faqItem" key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
