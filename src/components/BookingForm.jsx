import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "./Container";

const appointmentTimes = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00"
];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return "Staff will confirm price";

  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const requestedServiceId = searchParams.get("serviceId") || "";

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    serviceId: requestedServiceId,
    bookingDate: todayIsoDate(),
    bookingTime: "10:00",
    quantity: 1,
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoadingServices(true);
      setServiceError("");

      try {
        const response = await fetch("/api/sedifex/products", {
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "Could not load Sedifex services.");
        }

        const nextServices = Array.isArray(data.services) ? data.services : [];
        setServices(nextServices);

        setForm((current) => {
          const serviceExists = nextServices.some((service) => service.id === current.serviceId);
          return {
            ...current,
            serviceId: serviceExists ? current.serviceId : nextServices[0]?.id || current.serviceId
          };
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setServiceError(err.message || "Could not load Sedifex services.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingServices(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, []);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) || null,
    [form.serviceId, services]
  );

  const quantity = Math.max(1, Number(form.quantity) || 1);
  const unitPrice = Number(selectedService?.price || 0);
  const paymentAmount = Number.isFinite(unitPrice) && unitPrice > 0 ? unitPrice * quantity : 0;

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      const response = await fetch("/api/sedifex/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          serviceId: selectedService?.id || form.serviceId,
          serviceName: selectedService?.name || "Travel service appointment",
          bookingDate: form.bookingDate,
          bookingTime: form.bookingTime,
          quantity,
          notes: form.notes,
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone
          },
          paymentMethod: paymentAmount > 0 ? "paystack_checkout" : "manual",
          paymentAmount,
          sourceChannel: "client_website",
          attributes: {
            source: "website_booking_form",
            sourceLabel: "Client website",
            pageUrl: window.location.href,
            timezone: "Africa/Accra",
            locale: "en-GB"
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Could not create booking.");
      }

      if (data.checkoutUrl || data.authorizationUrl) {
        setSubmitMessage("Booking created. Redirecting you to secure checkout...");
        window.location.href = data.checkoutUrl || data.authorizationUrl;
        return;
      }

      setSubmitMessage(data.message || "Booking created successfully. Staff will contact you soon.");
    } catch (err) {
      setSubmitError(err.message || "Could not create booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>Book an appointment</h2>
          <p>
            Choose a Sedifex service, select your preferred appointment date and time, and continue to Paystack checkout when the service has a price.
          </p>
        </div>

        <div className="twoCol bookingLayout">
          <form className="card card--form bookingForm" onSubmit={submit}>
            <div className="formGrid">
              <label className="field field--wide">
                <span>Service</span>
                <select
                  value={form.serviceId}
                  onChange={(e) => updateField("serviceId", e.target.value)}
                  required
                  disabled={loadingServices || services.length === 0}
                >
                  {loadingServices && <option>Loading services...</option>}
                  {!loadingServices && services.length === 0 && <option>No services available</option>}
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} {Number(service.price) > 0 ? `- ${formatPrice(service.price)}` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Preferred date</span>
                <input
                  type="date"
                  min={todayIsoDate()}
                  value={form.bookingDate}
                  onChange={(e) => updateField("bookingDate", e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Preferred time</span>
                <select
                  value={form.bookingTime}
                  onChange={(e) => updateField("bookingTime", e.target.value)}
                  required
                >
                  {appointmentTimes.map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>

              <label className="field">
                <span>Full name</span>
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  placeholder="Customer name"
                />
              </label>

              <label className="field">
                <span>Phone / WhatsApp</span>
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  required
                  placeholder="+233..."
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="customer@example.com"
                />
              </label>

              <label className="field">
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => updateField("quantity", e.target.value)}
                  required
                />
              </label>

              <label className="field field--wide">
                <span>Notes / request details</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows="6"
                  placeholder="Tell us your destination, travel date, document needs, or questions."
                />
              </label>
            </div>

            {serviceError && <p className="formAlert formAlert--error">{serviceError}</p>}
            {submitError && <p className="formAlert formAlert--error">{submitError}</p>}
            {submitMessage && <p className="formAlert formAlert--success">{submitMessage}</p>}

            <button className="btn" type="submit" disabled={submitting || loadingServices || !selectedService}>
              {submitting ? "Creating booking..." : paymentAmount > 0 ? "Book & Pay with Paystack" : "Create Booking"}
            </button>

            <p className="tiny">
              Your booking is first saved in Sedifex. Payment is confirmed by Sedifex/Paystack after checkout, not by the browser return page.
            </p>
          </form>

          <aside className="infoBox bookingSummary">
            <h3>Appointment summary</h3>
            {selectedService ? (
              <>
                {selectedService.imageUrl && (
                  <img
                    className="bookingSummary__image"
                    src={selectedService.imageUrl}
                    alt={selectedService.imageAlt || selectedService.name}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                )}
                <div className="kv">
                  <div className="kv__k">Service</div>
                  <div className="kv__v">{selectedService.name}</div>
                </div>
                <div className="kv">
                  <div className="kv__k">Category</div>
                  <div className="kv__v">{selectedService.category || "Travel Services"}</div>
                </div>
                <div className="kv">
                  <div className="kv__k">Date</div>
                  <div className="kv__v">{form.bookingDate || "Not selected"}</div>
                </div>
                <div className="kv">
                  <div className="kv__k">Time</div>
                  <div className="kv__v">{form.bookingTime}</div>
                </div>
                <div className="kv">
                  <div className="kv__k">Amount</div>
                  <div className="kv__v">{paymentAmount > 0 ? formatPrice(paymentAmount) : formatPrice(0)}</div>
                </div>
                <p className="tiny">
                  {selectedService.description}
                </p>
              </>
            ) : (
              <p className="tiny">Load a service from Sedifex to see appointment details.</p>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
