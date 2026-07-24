import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "./Container";
import { formatPrice, servicePath, serviceSummary } from "../utils/serviceDisplay";
import { fetchSedifexServices } from "../utils/sedifexServices";

function PopularServiceImage({ service }) {
  const imageUrl = service.imageUrl || service.imageUrls?.[0] || "";

  return (
    <div className="popularServiceCard__media">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={service.imageAlt || service.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      <div className="popularServiceCard__mediaFallback" aria-hidden="true" />
    </div>
  );
}

export default function PopularServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPopularServices() {
      try {
        const nextServices = await fetchSedifexServices({ signal: controller.signal });
        setServices(nextServices.slice(0, 6));
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
                  <div className="popularServiceCard__media">
                    <div className="popularServiceCard__mediaFallback" aria-hidden="true" />
                  </div>
                  <div className="popularServiceCard__body">
                    <div className="popularServiceCard__label">Loading</div>
                    <h3>Preparing service</h3>
                    <p>Please wait while we load current services.</p>
                  </div>
                </div>
              );
            }

            return (
              <article className="popularServiceCard" key={service.id}>
                <PopularServiceImage service={service} />
                <div className="popularServiceCard__body">
                  <div className="popularServiceCard__label">{service.category || "Travel Service"}</div>
                  <h3>{service.name}</h3>
                  <p>{serviceSummary(service.description, 125)}</p>
                  <div className="popularServiceCard__footer">
                    <strong>{formatPrice(service.price)}</strong>
                    <Link className="btn btn--small" to={`/booking?serviceId=${encodeURIComponent(service.id)}`}>
                      Book Now
                    </Link>
                  </div>
                  <Link className="textLink" to={servicePath(service)}>Read more</Link>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
