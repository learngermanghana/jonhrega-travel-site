import PageHeader from "../components/PageHeader";
import Services from "../components/Services";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Visa processing, study abroad guidance, flights, corporate travel management, medical tourism, and insurance."
      />
      <Services />
    </>
  );
}
