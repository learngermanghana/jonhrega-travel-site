import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "./Container";
import { company } from "../data/company";

const visaTypes = [
  "Visitor / Tourist",
  "Business",
  "Student",
  "Work Permit",
  "Permanent Residency (PR)",
  "Other"
];

export default function VisaAssessmentForm() {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("Visa Assessment");
  const [destination, setDestination] = useState("");
  const [visaType, setVisaType] = useState("Visitor / Tourist");
  const [travelDate, setTravelDate] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");

  // Prefill from query string (optional)
  useEffect(() => {
    const qpPurpose = searchParams.get("purpose");
    const qpDestination = searchParams.get("destination");
    const qpVisaType = searchParams.get("visaType");

    if (qpPurpose) setPurpose(qpPurpose);
    if (qpDestination) setDestination(qpDestination);
    if (qpVisaType) setVisaType(qpVisaType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const emailLink = useMemo(() => {
    if (!company.email) return null;

    const msg =
      `Hello ${company.name},\n\n` +
      `I want to request: ${purpose}\n` +
      `Full Name: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Destination: ${destination}\n` +
      `Visa Type: ${visaType}\n` +
      `Preferred Travel Date: ${travelDate || "Not specified"}\n` +
      `Budget: ${budget || "Not specified"}\n\n` +
      `Notes:\n${notes || "None"}\n\n` +
      `Please share requirements, processing steps, timeline, and cost.`;

    return `mailto:${company.email}?subject=${encodeURIComponent(purpose)}&body=${encodeURIComponent(msg)}`;
  }, [purpose, fullName, phone, destination, visaType, travelDate, budget, notes]);

  function submit(e) {
    e.preventDefault();
    if (!emailLink) return;
    window.location.href = emailLink;
  }

  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Visa Assessment / Booking Form</h2>
          <p>
            Fill this form and send it by email. We’ll respond with requirements and next steps.
          </p>
        </div>

        <form className="card card--form" onSubmit={submit}>
          <div className="formGrid">
            <label className="field">
              <span>Full Name</span>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Your full name" />
            </label>

            <label className="field">
              <span>Phone Number</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+233..." />
            </label>

            <label className="field">
              <span>Purpose</span>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                <option>Visa Assessment</option>
                <option>Study Abroad Support</option>
                <option>Flight Booking</option>
                <option>Tour Package Booking</option>
                <option>Corporate Travel</option>
                <option>Medical Tourism</option>
                <option>Travel Insurance</option>
              </select>
            </label>

            <label className="field">
              <span>Destination Country / Package</span>
              <input value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="e.g. Canada / Dubai (5 Days)" />
            </label>

            <label className="field">
              <span>Visa Type</span>
              <select value={visaType} onChange={(e) => setVisaType(e.target.value)}>
                {visaTypes.map((v) => <option key={v}>{v}</option>)}
              </select>
            </label>

            <label className="field">
              <span>Preferred Travel Date</span>
              <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
            </label>

            <label className="field">
              <span>Budget (optional)</span>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. GHS 5,000" />
            </label>

            <label className="field field--wide">
              <span>Notes (documents, background, questions)</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows="6" placeholder="Tell us what you need..." />
            </label>
          </div>

          <button className="btn" type="submit" disabled={!emailLink}>
            Send by Email
          </button>

          <p className="tiny">
            This opens your email app with a prepared message addressed to us.
          </p>
        </form>
      </Container>
    </section>
  );
}
