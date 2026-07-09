import PageHeader from "../components/PageHeader";
import About from "../components/About";
import SEO from "../components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Jonhrega"
        description="Learn about Jonhrega Travel and Tours, a licensed Accra travel company offering visa, flight, tour, insurance, and appointment-based travel support."
        path="/about"
      />
      <PageHeader
        title="About Us"
        subtitle="Licensed travel support in Accra for visa preparation, flights, study abroad guidance, insurance, tours, and appointment-based travel assistance."
      />
      <About />
    </>
  );
}
