import { Link } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { company } from "../data/company";

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Read the terms for using Jonhrega Travel and Tours services, bookings, payments, and website."
        path="/terms"
      />
      <PageHeader
        title="Terms of Service"
        subtitle="Please read these terms before booking an appointment, requesting a travel service, or making payment."
      />
      <section className="section">
        <Container>
          <article className="card legalDoc">
            <p className="tiny">Last updated: July 9, 2026</p>

            <h2>1. Who we are</h2>
            <p>
              These Terms of Service apply to {company.name}, a licensed travel and tour company based in Accra, Ghana. By using this website, submitting a booking request, contacting us, or paying for a service, you agree to these terms.
            </p>

            <h2>2. Our services</h2>
            <p>
              We provide travel-related support including visa preparation guidance, study abroad support, flight booking assistance, tour planning, travel insurance support, corporate travel assistance, and appointment-based consultation services.
            </p>
            <p>
              Service details, pricing, availability, and timelines may change depending on destination rules, airline policies, embassy requirements, third-party provider terms, and the information you provide.
            </p>

            <h2>3. Appointments and booking requests</h2>
            <p>
              When you submit an appointment request, you agree to provide accurate contact information and truthful travel details. Submitting a booking request does not guarantee visa approval, flight availability, appointment availability, or service completion until our team confirms the details with you.
            </p>

            <h2>4. Payments and checkout</h2>
            <p>
              Some services may require online payment through secure checkout. Payment is considered confirmed only after the payment provider and our booking system verify the transaction. A browser return page or payment redirect does not by itself mean your payment has been fully confirmed.
            </p>

            <h2>5. Customer responsibilities</h2>
            <p>
              You are responsible for providing correct personal information, valid documents, truthful travel history, accurate contact details, and timely responses. We are not responsible for delays or refusals caused by incomplete, false, expired, or late documents.
            </p>

            <h2>6. Visa and travel decisions</h2>
            <p>
              Final decisions on visas, entry, border control, admissions, flights, insurance claims, and travel approvals are made by embassies, governments, airlines, institutions, insurers, or other third parties. We can guide and support you, but we cannot guarantee approval or acceptance by any third party.
            </p>

            <h2>7. Cancellations, refunds, and changes</h2>
            <p>
              Refunds, rescheduling, or cancellations depend on the service selected, work already completed, third-party fees paid, and provider rules. Some fees, including government, embassy, airline, insurance, appointment, or processing charges, may be non-refundable once paid or submitted.
            </p>

            <h2>8. Website information</h2>
            <p>
              We try to keep website information accurate and updated, but travel rules and prices can change quickly. Please contact us or book an appointment for confirmation before relying on any service details for time-sensitive travel decisions.
            </p>

            <h2>9. Contact</h2>
            <p>
              For questions about these terms, contact us through the contact page or email us at {company.displayEmail}.
            </p>

            <div className="actions">
              <Link className="btn" to="/booking">Book an Appointment</Link>
              <Link className="btn btn--ghost" to="/privacy">Privacy Policy</Link>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
