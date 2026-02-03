import PageHeader from "../components/PageHeader";
import Contact from "../components/Contact";
import SEO from "../components/SEO";

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Contact Jonhrega Travel and Tours by phone, email, or WhatsApp for fast response."
        path="/contact"
      />
      <PageHeader
        title="Contact"
        subtitle="Call, email, WhatsApp, or send a request and we’ll respond quickly."
      />
      <Contact />
    </>
  );
}
