import PageHeader from "../components/PageHeader";
import ToursGrid from "../components/ToursGrid";
import Testimonials from "../components/Testimonials";
import ConsultationCTA from "../components/ConsultationCTA";
import WhyChooseUs from "../components/WhyChooseUs";
import SEO from "../components/SEO";

export default function ToursPage() {
  return (
    <>
      <SEO
        title="Tours & Travel Packages"
        description="Browse curated tours, filter by destination and budget, and request a custom quote."
        path="/tours"
      />
      <PageHeader
        title="Tours & Travel Packages"
        subtitle="Explore curated experiences, filter by destination and budget, and request pricing & availability."
      />
      <ToursGrid />
      <WhyChooseUs />
      <Testimonials />
      <ConsultationCTA eyebrow="Planning a custom itinerary?" />
    </>
  );
}
