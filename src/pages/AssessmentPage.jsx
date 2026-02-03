import PageHeader from "../components/PageHeader";
import VisaAssessmentForm from "../components/VisaAssessmentForm";
import SEO from "../components/SEO";

export default function AssessmentPage() {
  return (
    <>
      <SEO
        title="Visa Assessment & Booking"
        description="Submit a visa assessment or booking request and get a fast response on WhatsApp."
        path="/assessment"
      />
      <PageHeader
        title="Visa Assessment / Booking"
        subtitle="Send your request directly to WhatsApp for fast response."
      />
      <VisaAssessmentForm />
    </>
  );
}
