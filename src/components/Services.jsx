import { useEffect, useMemo, useState } from "react";
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

function ServiceImage({ service }) {
  const [hidden, setHidden] = useState(!service.imageUrl);

  return (
    <div className="serviceCard__media">
      {!hidden && (
        <img
          src={service.imageUrl}
          alt={service.imageAlt || service.name}
          onError={() => setHidden(true)}
        />
      )}
      <div className="serviceCard__mediaFallback" aria-hidden="true" />
    </div>
  );
}

function ServiceCard({ service }) {
  return (
    <article className="serviceCard">
      <ServiceImage service={service} />
      <div className="serviceCard__body">
        <div className="serviceCard__meta">
          <span>{service.category || "Travel Services"}</span>
          {service.brand && <span>{service.brand}</span>}
        </div>
        <h3 className="serviceCard__title">{service.name}</h3>
        <p className="serviceCard__text">{service.description}</p>
        <div className="serviceCard__footer">
          <strong>{formatPrice(service.price)}</strong>
          <Link className="btn btn--small" to={`/booking?serviceId=${encodeURIComponent(service.id)}`}>
            Book Appointment
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState("All services");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/sedifex/products", {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "Could not load services from Sedifex.");
        }

        setServices(Array.isArray(data.services) ? data.services : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load services from Sedifex.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  const categories = useMemo(() => {
    const values = services.map((service) => service.category || "Travel Services");
    return ["All services", ...Array.from(new Set(values)).sort()];
  }, [services]);

  const filteredServices = useMemo(() => {
    const search = query.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory = category === "All services" || (service.category || "Travel Services") === category;
      const searchable = [service.name, service.description, service.category, service.brand]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });
  }, [category, query, services]);

  return (
    <section id="services" className="section">
      <Container>
        <div className="section__head section__head--split">
          <div>
            <h2>Services from Sedifex</h2>
            <p>
              Browse the live Jonhrega service catalog from Sedifex. Choose a service, pick an appointment time, and continue to secure checkout when payment is required.
            </p>
          </div>
          <div className="section__actions">
            <Link className="btn" to="/booking">Book Appointment</Link>
          </div>
        </div>

        <div className="filterBar serviceFilter">
          <label className="filterField">
            <span>Search services</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Visa, flight, insurance..."
            />
          </label>
          <label className="filterField">
            <span>Category</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <div className="serviceFilter__status">
            <span>Catalog source</span>
            <strong>Sedifex live catalog</strong>
          </div>
        </div>

        {loading && (
          <div className="servicesGrid">
            {["Loading services", "Checking prices", "Preparing bookings"].map((item) => (
              <div className="serviceCard serviceCard--placeholder" key={item}>
                <div className="serviceCard__mediaFallback" />
                <div className="serviceCard__body">
                  <h3 className="serviceCard__title">{item}</h3>
                  <p className="serviceCard__text">Please wait while we connect to Sedifex.</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="emptyState">
            <h3>Service catalog setup needed</h3>
            <p>{error}</p>
            <Link className="btn" to="/contact">Contact Jonhrega</Link>
          </div>
        )}

        {!loading && !error && filteredServices.length === 0 && (
          <div className="emptyState">
            <h3>No services found</h3>
            <p>Try another search term, or contact us for a custom travel service.</p>
            <Link className="btn" to="/contact">Contact Us</Link>
          </div>
        )}

        {!loading && !error && filteredServices.length > 0 && (
          <div className="servicesGrid">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
