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
    to: "/assessment",
    title: "Visa Assessment Tool",
    description: "Submit your travel profile and get a guided visa and document response on WhatsApp."
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
        title="Travel & Visa Services"
        description="Visa processing, study abroad guidance, flights, corporate travel management, medical tourism, and insurance."
        path="/services"
        image="/images/plane inside.jpeg"
        structuredData={serviceSchemas()}
      />
      <PageHeader
        title="Our Services"
        subtitle="Visa processing, study abroad guidance, flights, corporate travel management, medical tourism, and insurance."
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
