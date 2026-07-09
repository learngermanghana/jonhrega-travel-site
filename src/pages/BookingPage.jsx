import PageHeader from "../components/PageHeader";
import BookingForm from "../components/BookingForm";
import BookingFAQ from "../components/BookingFAQ";
import InternalLinksSection from "../components/InternalLinksSection";
import SEO from "../components/SEO";

const relatedLinks = [
  {
    to: "/services",
    title: "View Our Services",
    description: "Compare available travel, visa, flight, insurance, and consultation services before choosing your appointment."
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
        description="Book a Jonhrega Travel and Tours appointment and pay securely with Paystack when required."
        path="/booking"
        image="/images/ghanapassport.jpg"
      />
      <PageHeader
        title="Book an Appointment"
        subtitle="Choose the service you need, reserve your preferred appointment time, and continue to secure checkout when payment is required."
      />
      <BookingForm />
      <BookingFAQ />
      <InternalLinksSection
        title="Helpful planning links"
        description="Use these pages to choose the right service and prepare your travel request."
        links={relatedLinks}
      />
    </>
  );
}
