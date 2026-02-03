import PageHeader from "../components/PageHeader";
import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact"
        subtitle="Call, email, WhatsApp, or send a request and we’ll respond quickly."
      />
      <Contact />
    </>
  );
}
