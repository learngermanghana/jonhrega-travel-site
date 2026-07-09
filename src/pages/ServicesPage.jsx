import PageHeader from "../components/PageHeader";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import ConsultationCTA from "../components/ConsultationCTA";
import InternalLinksSection from "../components/InternalLinksSection";
import SEO from "../components/SEO";
import { serviceSchemas } from "../data/structuredData";

const relatedLinks = [
  {
    to: "/booking",
    title: "Book an Appointment",
    description: "Choose a Sedifex service, submit your booking, and continue to Paystack checkout when payment is required."
  },
  {
    to: "/blog",
    title: "Travel Tips & Blog",
    description: "Read checklists and planning advice before you submit applications or book travel."
  },
  {
    to: "/tours",
    title: "Tours & Packages",
    description: "Explore destinations and request a package that matches your budget and timeline."
  }
];

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Live Travel & Visa Services"
        description="Browse Jonhrega Travel and Tours services from Sedifex, book an appointment, and pay securely with Paystack when required."
        path="/services"
        image="/images/plane inside.jpeg"
        structuredData={serviceSchemas()}
      />
      <PageHeader
        title="Our Services"
        subtitle="Live visa, study abroad, flight, travel, tourism, and insurance services powered by Sedifex."
      />
      <Services />
      <InternalLinksSection
        title="Next step resources"
        description="Use these related tools and guides to complete your travel plan faster."
        links={relatedLinks}
      />
      <WhyChooseUs />
      <Testimonials />
      <ConsultationCTA eyebrow="Ready to get started?" />
    </>
  );
}
