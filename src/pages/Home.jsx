import HomeOffers from "../components/HomeOffers";
import TrustBadges from "../components/TrustBadges";
import Testimonials from "../components/Testimonials";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";
import SEO from "../components/SEO";
import {
  organizationSchema,
  serviceSchemas,
  faqSchema
} from "../data/structuredData";

export default function Home() {
  return (
    <>
      <SEO
        title="Travel, Tours & Visa Support"
        description="Licensed travel support in Accra for visas, tours, study abroad, flights, and corporate travel."
        path="/"
        image="/images/plane.jpeg"
        structuredData={[
          organizationSchema(),
          faqSchema(),
          ...serviceSchemas()
        ]}
      />
      <HomeOffers />
      <TrustBadges />
      <Testimonials />
      <Services />
      <About />
      <Contact />
    </>
  );
}
