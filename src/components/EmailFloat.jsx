import { company } from "../data/company";

export default function EmailFloat() {
  if (!company.email) return null;

  const subject = encodeURIComponent("Travel/visa services assistance");
  const body = encodeURIComponent(
    `Hello ${company.name},\n\nI need assistance with travel/visa services. Please share requirements and next steps.`
  );
  const link = `mailto:${company.email}?subject=${subject}&body=${body}`;

  return (
    <a className="emailFloat" href={link} aria-label="Email Jonhrega Travel and Tours">
      <span className="emailFloat__dot" aria-hidden="true" />
      Email us
    </a>
  );
}
