import { Link } from "react-router-dom";
import { company } from "../data/company";

export default function MobileActionBar() {
  const primaryPhone = company.phones[0]?.value || company.whatsapp.value;
  const whatsappNumber = company.whatsapp.value.replace(/\D/g, "");

  return (
    <div className="mobileActionBar" aria-label="Quick contact actions">
      <a href={`tel:${primaryPhone}`} className="mobileActionBar__item">
        Call
      </a>
      <a href={`https://wa.me/${whatsappNumber}`} className="mobileActionBar__item">
        WhatsApp
      </a>
      <Link to="/booking" className="mobileActionBar__item mobileActionBar__item--primary">
        Book
      </Link>
    </div>
  );
}
