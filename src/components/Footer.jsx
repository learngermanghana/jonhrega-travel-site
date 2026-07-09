import Container from "./Container";
import { company } from "../data/company";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  const officeAddress = company.address.office.join(", ");

  return (
    <footer className="footer">
      <Container className="footer__inner footer__inner--extended footerGrid">
        <div>
          <div className="footer__brand">{company.name}</div>
          <div className="footer__sub">
            {company.licensedNote} • {company.licenseNumberPlaceholder}
          </div>
          <div className="footer__tiny">© {year} {company.name}. All rights reserved.</div>
          <div className="footer__powered">Powered by Sedifex</div>
        </div>

        <div className="footerBlock">
          <h3>Contact</h3>
          <a href={"mailto:" + company.email}>{company.displayEmail}</a>
          {company.phones.map((phone) => (
            <a href={"tel:" + phone.value} key={phone.raw}>{phone.value}</a>
          ))}
          <a href={`https://wa.me/${company.whatsapp.value.replace(/\D/g, "")}`}>WhatsApp: {company.whatsapp.value}</a>
        </div>

        <div className="footerBlock">
          <h3>Office</h3>
          <span>{officeAddress}</span>
          {company.openingHours.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="footer__links">
          <Link to="/services">Services</Link>
          <Link to="/booking">Booking</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </Container>
    </footer>
  );
}
