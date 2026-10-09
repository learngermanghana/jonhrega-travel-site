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
        description="Browse Jonhrega tour packages, compare prices and inclusions, and choose your next departure."
        path="/tours"
      />
      <PageHeader
        title="Tours & Travel Packages"
        subtitle="Find your next getaway. Compare destinations, see what’s included, and choose a departure that suits you."
      />
      <ToursGrid />
      <WhyChooseUs />
      <Testimonials />
      <ConsultationCTA eyebrow="Planning a custom itinerary?" />
    </>
  );
}
