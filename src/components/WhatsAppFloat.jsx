import { company } from "../data/company";

export default function WhatsAppFloat() {
  const wa = company.whatsappNumbers?.[0]?.value; // digits only
  if (!wa) return null;

  const text = encodeURIComponent(
    `Hello ${company.name}, I need assistance with travel/visa services. Please share requirements and next steps.`
  );

  const link = `https://wa.me/${wa}?text=${text}`;

  return (
    <a className="waFloat" href={link} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <span className="waFloat__dot" aria-hidden="true" />
      Chat on WhatsApp
    </a>
  );
}
