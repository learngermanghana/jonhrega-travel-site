import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";

function formatPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for price";

  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export default function PopularServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPopularServices() {
      try {
        const response = await fetch("/api/sedifex/products", {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "Could not load popular services.");
        }

        setServices((Array.isArray(data.services) ? data.services : []).slice(0, 6));
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load popular services.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadPopularServices();
    return () => controller.abort();
  }, []);

  if (!loading && (error || services.length === 0)) return null;

  return (
    <section className="section section--alt">
      <Container>
        <div className="section__head section__head--split">
          <div>
            <h2>Popular Services</h2>
            <p>
              Start with one of our most requested travel services, then book an appointment when you are ready.
            </p>
          </div>
          <div className="section__actions">
            <Link className="btn btn--ghost" to="/services">View All Services</Link>
          </div>
        </div>

        <div className="popularServicesGrid">
          {(loading ? [1, 2, 3] : services).map((service) => {
            if (loading) {
              return (
                <div className="popularServiceCard" key={service}>
                  <div className="popularServiceCard__label">Loading</div>
                  <h3>Preparing service</h3>
                  <p>Please wait while we load current services.</p>
                </div>
              );
            }

            return (
              <div className="popularServiceCard" key={service.id}>
                <div className="popularServiceCard__label">{service.category || "Travel Service"}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="popularServiceCard__footer">
                  <strong>{formatPrice(service.price)}</strong>
                  <Link className="btn btn--small" to={`/booking?serviceId=${encodeURIComponent(service.id)}`}>
                    Book Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
