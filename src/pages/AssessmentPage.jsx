import PageHeader from "../components/PageHeader";
import VisaAssessmentForm from "../components/VisaAssessmentForm";

export default function AssessmentPage() {
  return (
    <>
      <PageHeader
        title="Visa Assessment / Booking"
        subtitle="Send your request directly to WhatsApp for fast response."
      />
      <VisaAssessmentForm />
    </>
  );
}
