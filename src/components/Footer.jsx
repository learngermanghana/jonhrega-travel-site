import Container from "./Container";
import { company } from "../data/company";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container className="footer__inner footer__inner--extended">
        <div>
          <div className="footer__brand">{company.name}</div>
          <div className="footer__sub">
            {company.licensedNote} • {company.licenseNumberPlaceholder}
          </div>
          <div className="footer__tiny">© {year} {company.name}. All rights reserved.</div>
          <div className="footer__powered">Powered by Sedifex</div>
        </div>

        <div className="footer__links">
          <a href={"mailto:" + company.email}>Email</a>
          <a href={"tel:" + company.phones[0].value}>Call</a>
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
