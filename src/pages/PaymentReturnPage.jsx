import { Link, useSearchParams } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";

export default function PaymentReturnPage() {
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") ||
    searchParams.get("trxref") ||
    searchParams.get("paymentReference") ||
    "";

  return (
    <>
      <SEO
        title="Payment Processing"
        description="Your checkout return has been received. Sedifex will confirm the final payment status."
        path="/payment/return"
      />
      <PageHeader
        title="Payment is being verified"
        subtitle="We have received your checkout return. Sedifex and Paystack will confirm the final payment status before the booking is marked as paid."
      />
      <section className="section">
        <Container>
          <div className="card paymentReturnCard">
            <h2>Thank you</h2>
            <p>
              Your booking request has been created and your checkout return was received. Please do not submit the same booking again unless our team asks you to.
            </p>
            {reference && (
              <p className="tiny">
                Payment reference: <strong>{reference}</strong>
              </p>
            )}
            <div className="actions">
              <Link className="btn" to="/services">View Services</Link>
              <Link className="btn btn--ghost" to="/contact">Contact Jonhrega</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
