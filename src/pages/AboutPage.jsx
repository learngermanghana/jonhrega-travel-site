import PageHeader from "../components/PageHeader";
import About from "../components/About";
import SEO from "../components/SEO";

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Jonhrega"
        description="Learn about Jonhrega Travel and Tours, based in Accra with licensed travel support."
        path="/about"
      />
      <PageHeader
        title="About Us"
        subtitle="We are based in Accra and provide travel and visa support for individuals and organizations."
      />
      <About />
    </>
  );
}
