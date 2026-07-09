import PageHeader from "../components/PageHeader";
import BookingForm from "../components/BookingForm";
import InternalLinksSection from "../components/InternalLinksSection";
import SEO from "../components/SEO";

const relatedLinks = [
  {
    to: "/services",
    title: "View Live Services",
    description: "Compare the Sedifex service catalog before choosing your appointment."
  },
  {
    to: "/contact",
    title: "Ask a Question First",
    description: "Contact Jonhrega if you need help choosing the right service."
  },
  {
    to: "/blog",
    title: "Travel Tips & Checklists",
    description: "Read practical guides before your appointment or visa application."
  }
];

export default function BookingPage() {
  return (
    <>
      <SEO
        title="Book Travel Service Appointment"
        description="Book a Jonhrega Travel and Tours appointment from the live Sedifex service catalog and pay securely with Paystack when required."
        path="/booking"
        image="/images/ghanapassport.jpg"
      />
      <PageHeader
        title="Book an Appointment"
        subtitle="Choose a service from Sedifex, reserve your preferred appointment time, and continue to secure checkout when payment is required."
      />
      <BookingForm />
      <InternalLinksSection
        title="Helpful planning links"
        description="Use these pages to choose the right service and prepare your travel request."
        links={relatedLinks}
      />
    </>
  );
}
