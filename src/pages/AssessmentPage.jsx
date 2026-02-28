import PageHeader from "../components/PageHeader";
import VisaAssessmentForm from "../components/VisaAssessmentForm";
import InternalLinksSection from "../components/InternalLinksSection";
import SEO from "../components/SEO";
import { faqSchema } from "../data/structuredData";

const relatedLinks = [
  {
    to: "/services",
    title: "Compare Visa & Travel Services",
    description: "Review service options before submitting your final booking or documentation request."
  },
  {
    to: "/blog",
    title: "Visa Tips & Checklists",
    description: "Use practical blog guides to prepare documents and timelines for your application."
  },
  {
    to: "/tours",
    title: "Add a Tour to Your Trip",
    description: "Bundle your visa support with a destination package to save planning time."
  }
];

export default function AssessmentPage() {
  return (
    <>
      <SEO
        title="Visa Assessment & Booking"
        description="Submit a visa assessment or booking request and get a fast response on WhatsApp."
        path="/assessment"
        image="/images/ghanapassport.jpg"
        structuredData={[faqSchema()]}
      />
      <PageHeader
        title="Visa Assessment / Booking"
        subtitle="Send your request directly to WhatsApp for fast response."
      />
      <VisaAssessmentForm />
      <InternalLinksSection
        title="Helpful planning links"
        description="Explore related pages to improve your visa readiness and travel planning."
        links={relatedLinks}
      />
    </>
  );
}
