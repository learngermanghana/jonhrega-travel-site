import PageHeader from "../components/PageHeader";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Testimonials from "../components/Testimonials";
import ConsultationCTA from "../components/ConsultationCTA";
import SEO from "../components/SEO";

export default function ServicesPage() {
  return (
    <>
      <SEO
        title="Travel & Visa Services"
        description="Visa processing, study abroad guidance, flights, corporate travel management, medical tourism, and insurance."
        path="/services"
      />
      <PageHeader
        title="Our Services"
        subtitle="Visa processing, study abroad guidance, flights, corporate travel management, medical tourism, and insurance."
      />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <ConsultationCTA eyebrow="Ready to get started?" />
    </>
  );
}
