import { Link, useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { company } from "../data/company";

export default function BookingThankYouPage() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";
  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("paymentReference") ||
    "";
  const whatsappNumber = company.whatsapp.value.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    `Hello ${company.name}, I just submitted a booking request on your website. Please confirm the next steps.`
  );

  return (
    <>
      <SEO
        title="Booking Request Received"
        description="Your Jonhrega Travel and Tours booking request has been received. Our team will contact you by phone or WhatsApp."
        path="/booking/thank-you"
      />
      <PageHeader
        title="Booking request received"
        subtitle="Thank you. Our team will contact you by phone or WhatsApp with the next steps."
      />
      <section className="section">
        <Container>
          <div className="bookingThankYouLayout">
            <article className="card bookingThankYouCard">
              <div className="bookingThankYouCard__icon" aria-hidden="true">✓</div>
              <h2>Your request has been received</h2>
              <p>
                We have received your appointment request. Please keep your phone available because Jonhrega Travel and Tours may contact you by call or WhatsApp to confirm requirements, timing, and next steps.
              </p>

              {bookingId && (
                <p className="tiny">
                  Booking reference: <strong>{bookingId}</strong>
                </p>
              )}

              {reference && (
                <div className="callout paymentReturnNotice">
                  <div className="callout__title">Payment verification</div>
                  <div className="callout__text">
                    Your checkout return was received. Payment is confirmed only after secure verification.
                  </div>
                  <div className="callout__hint">
                    Payment reference: <strong>{reference}</strong>
                  </div>
                </div>
              )}

              <div className="actions">
                <a className="btn" href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}>
                  Chat on WhatsApp
                </a>
                <Link className="btn btn--ghost" to="/services">
                  View Services
                </Link>
              </div>
            </article>

            <aside className="infoBox bookingThankYouSteps">
              <h3>What happens next?</h3>
              <ul>
                <li>Our team reviews your selected service and appointment request.</li>
                <li>We contact you by phone or WhatsApp for confirmation.</li>
                <li>If documents are needed, we share the checklist and next steps.</li>
                <li>If payment was made, it is verified securely before marking the booking as paid.</li>
              </ul>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
