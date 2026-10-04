import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "./Container";
import { serviceSummary } from "../utils/serviceDisplay";
import { fetchSedifexBookableItems } from "../utils/sedifexServices";
import { fetchSedifexTourDepartures } from "../utils/sedifexTours";

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

const trustBadges = [
  "Licensed by Ghana Tourism Authority",
  "Secure online checkout",
  "WhatsApp follow-up",
  "Accra-based travel support"
];

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatPrice(price, currency = "GHS") {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return "Staff will confirm price";

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: String(currency || "GHS").toUpperCase(),
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  } catch {
    return `${String(currency || "GHS").toUpperCase()} ${amount.toFixed(2)}`;
  }
}

function slotTimeValue(slot) {
  if (!slot?.startAt) return "10:00";
  const parsed = new Date(slot.startAt);
  if (Number.isNaN(parsed.getTime())) return "10:00";

  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: slot.timezone || "Africa/Accra"
    }).format(parsed);
  } catch {
    return slot.startAt.slice(11, 16) || "10:00";
  }
}

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedServiceId = searchParams.get("serviceId") || "";
  const requestedSlotId = searchParams.get("slotId") || "";

  const [services, setServices] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const [serviceError, setServiceError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    serviceId: requestedServiceId,
    bookingDate: todayIsoDate(),
    bookingTime: "10:00",
    name: "",
    email: "",
    phone: "",
    notes: "",
    quantity: "1"
  });

  useEffect(() => {
    const controller = new AbortController();

    async function loadServices() {
      setLoadingServices(true);
      setServiceError("");

      try {
        const [nextServices, tourDepartures] = await Promise.all([
          fetchSedifexBookableItems({ signal: controller.signal }),
          requestedSlotId ? fetchSedifexTourDepartures({ signal: controller.signal }) : Promise.resolve([])
        ]);
        setServices(nextServices);

        const requestedDeparture = requestedSlotId
          ? tourDepartures.find((slot) => slot.id === requestedSlotId) || null
          : null;
        setSelectedDeparture(requestedDeparture);

        setForm((current) => {
          const serviceExists = nextServices.some((service) => service.id === current.serviceId);
          const nextServiceId = serviceExists
            ? current.serviceId
            : nextServices.some((service) => service.id === requestedServiceId)
              ? requestedServiceId
              : nextServices[0]?.id || current.serviceId;

          return {
            ...current,
            serviceId: nextServiceId,
            bookingDate: requestedDeparture?.eventDate || requestedDeparture?.startAt?.slice(0, 10) || current.bookingDate,
            bookingTime: requestedDeparture ? slotTimeValue(requestedDeparture) : current.bookingTime
          };
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setServiceError(err.message || "Could not load services right now.");
        }
      } finally {
        if (!controller.signal.aborted) setLoadingServices(false);
      }
    }

    loadServices();
    return () => controller.abort();
  }, [requestedServiceId, requestedSlotId]);

  const selectedService = useMemo(
    () => services.find((service) => service.id === form.serviceId) || null,
    [form.serviceId, services]
  );

  const isTourPackage = selectedService?.isTourPackage === true;
  const requestedQuantity = Math.max(1, Math.floor(Number(form.quantity) || 1));
  const maxTravellers = selectedDeparture?.seatsRemaining || selectedService?.tour?.capacity || null;
  const quantity = isTourPackage
    ? Math.min(requestedQuantity, maxTravellers && maxTravellers > 0 ? maxTravellers : requestedQuantity)
    : 1;
  const unitPrice = Number(selectedDeparture?.price ?? selectedService?.price ?? 0);
  const paymentAmount = Number.isFinite(unitPrice) && unitPrice > 0 ? unitPrice * quantity : 0;
  const paymentCurrency = selectedDeparture?.currency || selectedService?.currency || "GHS";

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitMessage("");

    try {
      if (!acceptedTerms) {
        throw new Error("Please accept the Terms of Service and Privacy Policy before booking.");
      }

      const response = await fetch("/api/sedifex/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          serviceId: selectedService?.id || form.serviceId,
          serviceName: selectedService?.name || "Travel service appointment",
          slotId: selectedDeparture?.id || requestedSlotId || undefined,
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
          currency: paymentCurrency,
          sourceChannel: "client_website",
          attributes: {
            source: "website_booking_form",
            sourceLabel: "Client website",
            pageUrl: window.location.href,
            timezone: "Africa/Accra",
            locale: "en-GB",
            serviceAppointment: !isTourPackage,
            tourPackage: isTourPackage,
            eventKind: isTourPackage ? "trip" : undefined,
            quantityHidden: !isTourPackage,
            termsAccepted: true,
            termsAcceptedAt: new Date().toISOString()
          }
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Could not create booking.");
      }

      if (data.checkoutUrl || data.authorizationUrl) {
        setSubmitMessage(
          "Your appointment request has been received. If payment is required, you will now continue to secure checkout."
        );
        window.location.href = data.checkoutUrl || data.authorizationUrl;
        return;
      }

      navigate(`/booking/thank-you${data.bookingId ? `?bookingId=${encodeURIComponent(data.bookingId)}` : ""}`);
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
            Tell us what you need, choose your preferred date and time, and we will receive your request immediately. If the service requires payment, you will continue to secure Paystack checkout after submitting.
          </p>
        </div>

        <div className="bookingTrustGrid" aria-label="Booking trust points">
          {trustBadges.map((badge) => (
            <div className="bookingTrustBadge" key={badge}>{badge}</div>
          ))}
        </div>

        <div className="bookingHowItWorks">
          <div className="section__head">
            <h2>How booking works</h2>
            <p>Follow these steps so our team can prepare the right guidance for your travel request.</p>
          </div>
          <div className="bookingSteps">
            <div className="miniCard">
              <div className="miniCard__title">1. Choose your service</div>
              <div className="miniCard__text">Select visa help, study abroad guidance, flights, insurance, tours, or another travel service.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">2. Pick a time</div>
              <div className="miniCard__text">Choose the appointment date and time that works best for you.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">3. Submit your details</div>
              <div className="miniCard__text">Share your contact details and travel notes so we know exactly what you need.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">4. Pay if required</div>
              <div className="miniCard__text">Continue to secure checkout only when the selected service requires online payment.</div>
            </div>
            <div className="miniCard">
              <div className="miniCard__title">5. Get follow-up</div>
              <div className="miniCard__text">Our team contacts you with requirements, timeline, and next steps.</div>
            </div>
          </div>
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
                      {service.isTourPackage ? "Tour: " : ""}{service.name} {Number(service.price) > 0 ? `- ${formatPrice(service.price, service.currency)}` : ""}
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
                  disabled={Boolean(selectedDeparture)}
                />
              </label>

              <label className="field">
                <span>{selectedDeparture ? "Departure time" : "Preferred time"}</span>
                <select
                  value={form.bookingTime}
                  onChange={(e) => updateField("bookingTime", e.target.value)}
                  required
                  disabled={Boolean(selectedDeparture)}
                >
                  {selectedDeparture && !appointmentTimes.includes(form.bookingTime) ? (
                    <option value={form.bookingTime}>{form.bookingTime}</option>
                  ) : null}
                  {appointmentTimes.map((time) => <option key={time}>{time}</option>)}
                </select>
              </label>

              {isTourPackage ? (
                <label className="field">
                  <span>Travellers</span>
                  <input
                    type="number"
                    min="1"
                    max={maxTravellers && maxTravellers > 0 ? maxTravellers : undefined}
                    value={form.quantity}
                    onChange={(e) => updateField("quantity", e.target.value)}
                    required
                  />
                </label>
              ) : null}

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

            <label className="termsCheck">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                required
              />
              <span>
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            {serviceError && <p className="formAlert formAlert--error">{serviceError}</p>}
            {submitError && <p className="formAlert formAlert--error">{submitError}</p>}
            {submitMessage && <p className="formAlert formAlert--success">{submitMessage}</p>}

            <button className="btn" type="submit" disabled={submitting || loadingServices || !selectedService || !acceptedTerms}>
              {submitting ? "Creating appointment..." : paymentAmount > 0 ? "Book & Pay Securely" : "Create Appointment"}
            </button>

            <p className="tiny">
              Your appointment request is saved first. Online payment is confirmed only after secure checkout verification.
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
                  <div className="kv__v">{paymentAmount > 0 ? formatPrice(paymentAmount, paymentCurrency) : formatPrice(0, paymentCurrency)}</div>
                </div>
                {selectedDeparture ? (
                  <div className="kv">
                    <div className="kv__k">Departure</div>
                    <div className="kv__v">{selectedDeparture.displayDateText || selectedDeparture.eventDate || "Selected trip"}</div>
                  </div>
                ) : null}
                {isTourPackage ? (
                  <div className="kv">
                    <div className="kv__k">Travellers</div>
                    <div className="kv__v">{quantity}{maxTravellers ? ` of ${maxTravellers} available` : ""}</div>
                  </div>
                ) : null}
                <p className="tiny">
                  {serviceSummary(selectedService.tour?.shortSummary || selectedService.description, 160)}
                </p>
              </>
            ) : (
              <p className="tiny">Load a service from our service list to see appointment details.</p>
            )}
          </aside>
        </div>
      </Container>
    </section>
  );
}
