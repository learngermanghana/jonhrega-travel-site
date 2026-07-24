import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../components/Container";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { findServiceByParam, formatPrice, serviceParagraphs } from "../utils/serviceDisplay";
import { fetchSedifexServices } from "../utils/sedifexServices";

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoading(true);
      setError("");

      try {
        const nextServices = await fetchSedifexServices({ signal: controller.signal });
        setServices(nextServices);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load this service right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  const service = useMemo(() => findServiceByParam(services, serviceId), [services, serviceId]);
  const paragraphs = useMemo(() => serviceParagraphs(service?.description || ""), [service]);
  const imageUrl = service?.imageUrl || service?.imageUrls?.[0] || "";

  if (loading) {
    return (
      <>
        <SEO title="Loading Service" description="Loading Jonhrega Travel and Tours service details." path="/services" />
        <PageHeader title="Loading service" subtitle="Please wait while we load the current service details." />
        <section className="section">
          <Container>
            <div className="card legalDoc">Loading service details...</div>
          </Container>
        </section>
      </>
    );
  }

  if (error || !service) {
    return (
      <>
        <SEO title="Service Not Found" description="This Jonhrega Travel and Tours service could not be found." path="/services" />
        <PageHeader title="Service not found" subtitle="This service may have been removed or is temporarily unavailable." />
        <section className="section">
          <Container>
            <div className="emptyState">
              <h3>We could not open this service</h3>
              <p>{error || "Please return to the services page and choose another service."}</p>
              <div className="actions">
                <Link className="btn" to="/services">View Services</Link>
                <Link className="btn btn--ghost" to="/contact">Contact Jonhrega</Link>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <SEO
        title={service.name}
        description={paragraphs[0] || "Book this travel service with Jonhrega Travel and Tours."}
        path={`/services/${encodeURIComponent(service.id)}`}
        image={imageUrl || "/images/plane inside.jpeg"}
      />
      <PageHeader
        title={service.name}
        subtitle={`${service.category || "Travel Services"} • ${formatPrice(service.price)}`}
      />

      <section className="section">
        <Container>
          <div className="serviceDetailLayout">
            <article className="card serviceDetailCard">
              {imageUrl && (
                <img
                  className="serviceDetailCard__image"
                  src={imageUrl}
                  alt={service.imageAlt || service.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
              )}

              <div className="serviceDetailCard__meta">
                <span>{service.category || "Travel Services"}</span>
                {service.brand && <span>{service.brand}</span>}
                <span>{formatPrice(service.price)}</span>
              </div>

              <h2>Service details</h2>
              <div className="serviceDetailText">
                {paragraphs.map((paragraph) => (
                  paragraph.startsWith("•") ? (
                    <p className="serviceDetailText__bullet" key={paragraph}>{paragraph}</p>
                  ) : (
                    <p key={paragraph}>{paragraph}</p>
                  )
                ))}
              </div>
            </article>

            <aside className="infoBox serviceDetailSidebar">
              <h3>Ready to continue?</h3>
              <p>
                Book an appointment and our team will contact you with requirements, timeline, and next steps.
              </p>
              <div className="kv">
                <div className="kv__k">Service fee</div>
                <div className="kv__v">{formatPrice(service.price)}</div>
              </div>
              <div className="actions">
                <Link className="btn" to={`/booking?serviceId=${encodeURIComponent(service.id)}`}>
                  Book Appointment
                </Link>
                <Link className="btn btn--ghost" to="/services">
                  Back to Services
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
