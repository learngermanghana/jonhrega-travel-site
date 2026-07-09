import PageHeader from "../components/PageHeader";
import Contact from "../components/Contact";
import SEO from "../components/SEO";

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Contact Jonhrega Travel and Tours by phone or email for fast response."
        path="/contact"
      />
      <PageHeader
        title="Contact"
        subtitle="Call, email, or message us on WhatsApp and we’ll respond quickly."
      />
      <Contact />
    </>
  );
}
