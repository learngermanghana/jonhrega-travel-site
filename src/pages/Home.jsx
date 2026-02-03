import Hero from "../components/Hero";
import HomeOffers from "../components/HomeOffers";
import TrustBadges from "../components/TrustBadges";
import Testimonials from "../components/Testimonials";
import Services from "../components/Services";
import About from "../components/About";
import Contact from "../components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeOffers />
      <TrustBadges />
      <Testimonials />
      <Services />
      <About />
      <Contact />
    </>
  );
}
