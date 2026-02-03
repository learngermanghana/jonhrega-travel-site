import PageHeader from "../components/PageHeader";
import ToursGrid from "../components/ToursGrid";

export default function ToursPage() {
  return (
    <>
      <PageHeader
        title="Tours & Travel Packages"
        subtitle="Explore curated experiences and request pricing & availability."
      />
      <ToursGrid />
    </>
  );
}
