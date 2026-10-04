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
        description="Browse current Jonhrega tour packages, prices, inclusions, and Sedifex-managed departure dates."
        path="/tours"
      />
      <PageHeader
        title="Tours & Travel Packages"
        subtitle="Explore current packages, compare destinations and tour styles, and book available departures managed through Sedifex."
      />
      <ToursGrid />
      <WhyChooseUs />
      <Testimonials />
      <ConsultationCTA eyebrow="Planning a custom itinerary?" />
    </>
  );
}
