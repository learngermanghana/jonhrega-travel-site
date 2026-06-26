import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "./Container";
import { company } from "../data/company";

export default function Contact() {
  const [searchParams] = useSearchParams();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("Visa Processing Services");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const qpService = searchParams.get("service");
    const topic = searchParams.get("topic");

    if (qpService) setService(qpService);

    if (topic) {
      setMessage(
        `Hello ${company.name},\n\nI need help with: ${topic}.\nPlease share requirements, processing time, and cost.\n\nThank you.`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapUrl = useMemo(() => {
    const q = encodeURIComponent(company.mapQuery);
    return "https://www.google.com/maps/search/?api=1&query=" + q;
  }, []);

  const emailLink = useMemo(() => {
    if (!company.email) return null;
    const msg =
      `Hello ${company.name},\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Service: ${service}\n\n` +
      `Message:\n${message}\n\n` +
      `Please respond with requirements, timeline, and cost.`;
    return `mailto:${company.email}?subject=${encodeURIComponent(service + " request")}&body=${encodeURIComponent(msg)}`;
  }, [name, phone, service, message]);

  function submit(e) {
    e.preventDefault();
    if (!emailLink) return;
    window.location.href = emailLink;
  }

  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Contact</h2>
          <p>Reach us by phone, email, or send a quick request below.</p>
        </div>

        <div className="twoCol twoCol--contact">
          <div className="infoBox">
            <h3>Contact details</h3>

            <div className="kv">
              <div className="kv__k">Email</div>
              <div className="kv__v">
                <a href={"mailto:" + company.email}>{company.email}</a>
              </div>
            </div>

            <div className="kv">
              <div className="kv__k">Phone</div>
              <div className="kv__v">
                {company.phones.map((phone) => (
                  <div key={phone.raw}>
                    <a href={"tel:" + phone.value}>{phone.raw}</a>
                  </div>
                ))}
              </div>
            </div>

            <div className="kv">
              <div className="kv__k">Digital Address</div>
              <div className="kv__v">
                {company.address.digital.map((l) => <div key={l}>{l}</div>)}
              </div>
            </div>

            <div className="kv">
              <div className="kv__k">Postal Address</div>
              <div className="kv__v">
                {company.address.postal.map((l) => <div key={l}>{l}</div>)}
              </div>
            </div>

            <div className="actions">
              <a className="btn" href={"mailto:" + company.email}>Email Us</a>
              <a className="btn btn--ghost" href={mapUrl} target="_blank" rel="noreferrer">Open Map</a>
            </div>
          </div>

          <form className="card card--form" onSubmit={submit}>
            <h3 className="card__title">Send a request by email</h3>

            <label className="field">
              <span>Your Name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
            </label>

            <label className="field">
              <span>Your Phone</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+233..." />
            </label>

            <label className="field">
              <span>Service</span>
              <select value={service} onChange={(e) => setService(e.target.value)}>
                <option>Visa Processing Services</option>
                <option>Study Abroad Services</option>
                <option>Flight Booking & Travel Packages</option>
                <option>Corporate Travel Management</option>
                <option>Medical Tourism Services</option>
                <option>Travel Insurance Services</option>
              </select>
            </label>

            <label className="field">
              <span>Message</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Tell us what you need..." rows="6" />
            </label>

            <button className="btn" type="submit" disabled={!emailLink}>
              Send by Email
            </button>

            <p className="tiny">
              This opens your email app with your message prepared. For detailed requests, use the Assessment form.
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
