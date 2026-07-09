import { Link } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { company } from "../data/company";

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Read how Jonhrega Travel and Tours collects, uses, stores, and protects customer information."
        path="/privacy"
      />
      <PageHeader
        title="Privacy Policy"
        subtitle="This explains how we handle information you share when using our website, contact forms, bookings, and services."
      />
      <section className="section">
        <Container>
          <article className="card legalDoc">
            <p className="tiny">Last updated: July 9, 2026</p>

            <h2>1. Information we collect</h2>
            <p>
              We may collect your name, phone number, email address, appointment details, service request, destination, travel notes, payment reference, and any documents or information you voluntarily provide for travel support.
            </p>

            <h2>2. How we use your information</h2>
            <p>
              We use your information to respond to enquiries, prepare service recommendations, process bookings, contact you about your appointment, support payment confirmation, provide travel guidance, and manage customer records for {company.name}.
            </p>

            <h2>3. Payments</h2>
            <p>
              Online payments may be processed by secure third-party payment providers such as Paystack. We do not ask you to send card details directly to us through email or chat. Payment confirmation is handled through secure checkout and verification systems.
            </p>

            <h2>4. Booking technology</h2>
            <p>
              Our website may use secure booking and business-management technology to receive appointment requests, service selections, customer details, and payment status. This helps us respond faster and keep service records organized.
            </p>

            <h2>5. Sharing information</h2>
            <p>
              We may share necessary information with embassies, visa centers, airlines, schools, insurers, hotels, payment providers, travel partners, or other service providers when needed to deliver the service you requested. We do not sell your personal information.
            </p>

            <h2>6. Data security</h2>
            <p>
              We take reasonable steps to protect customer information. However, no website, email, or online service is completely risk-free. Please avoid sending highly sensitive information unless our team confirms the safest way to submit it.
            </p>

            <h2>7. Data retention</h2>
            <p>
              We keep information for as long as needed to provide services, manage records, meet legal or accounting requirements, resolve disputes, and improve customer support. You may contact us to request correction or deletion where applicable.
            </p>

            <h2>8. Your choices</h2>
            <p>
              You can contact us to update your information, ask questions about your data, or request that we stop using your information for non-essential communication.
            </p>

            <h2>9. Contact</h2>
            <p>
              For privacy questions, contact {company.name} through the contact page or email us at {company.displayEmail}.
            </p>

            <div className="actions">
              <Link className="btn" to="/contact">Contact Us</Link>
              <Link className="btn btn--ghost" to="/terms">Terms of Service</Link>
            </div>
          </article>
        </Container>
      </section>
    </>
  );
}
