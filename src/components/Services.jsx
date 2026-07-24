import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { formatPrice, servicePath, serviceSummary } from "../utils/serviceDisplay";
import { fetchSedifexServices } from "../utils/sedifexServices";

function ServiceImage({ service }) {
  const imageUrl = service.imageUrl || service.imageUrls?.[0] || "";
  const [hidden, setHidden] = useState(!imageUrl);

  return (
    <div className="serviceCard__media">
      {!hidden && (
        <img
          src={imageUrl}
          alt={service.imageAlt || service.name}
          loading="lazy"
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
        <p className="serviceCard__text">{serviceSummary(service.description, 145)}</p>
        <div className="serviceCard__priceRow">
          <span>Service fee</span>
          <strong>{formatPrice(service.price)}</strong>
        </div>
        <div className="serviceCard__actions">
          <Link className="btn btn--small" to={`/booking?serviceId=${encodeURIComponent(service.id)}`}>
            Book Appointment
          </Link>
          <Link className="textLink" to={servicePath(service)}>
            Read more
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
        const nextServices = await fetchSedifexServices({ signal: controller.signal });
        setServices(nextServices);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Could not load services right now.");
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
            <h2>Choose Your Travel Service</h2>
            <p>
              Browse our current service list, compare what fits your travel need, and open any service to read the full details before booking.
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
            <strong>Current online services</strong>
          </div>
        </div>

        {loading && (
          <div className="servicesGrid">
            {["Loading services", "Checking available options", "Preparing appointment links"].map((item) => (
              <div className="serviceCard serviceCard--placeholder" key={item}>
                <div className="serviceCard__mediaFallback" />
                <div className="serviceCard__body">
                  <h3 className="serviceCard__title">{item}</h3>
                  <p className="serviceCard__text">Please wait while we load the latest service list.</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="emptyState">
            <h3>Service list is not available</h3>
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
