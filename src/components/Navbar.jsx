import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Container from "./Container";
import { company } from "../data/company";

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Tours", to: "/tours" },
  { label: "Assessment", to: "/assessment" },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="nav nav--scrolled">
      <Container className="nav__inner">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <img className="brand__logo" src="/images/Log.jpg.jpeg" alt={`${company.name} logo`} />
          <span className="brand__text">
            <span className="brand__name">{company.name}</span>
            <span className="brand__sub">{company.licensedNote}</span>
          </span>
        </Link>

        <nav className="nav__links">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>
              {l.label}
            </NavLink>
          ))}
          <Link className="btn btn--small" to="/assessment">Start Now</Link>
        </nav>

        <button
          className="nav__toggle"
          aria-label="Open menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="hamburger" />
        </button>
      </Container>

      {open && (
        <div className="nav__mobile">
          <Container className="nav__mobileInner">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={(args) => "nav__mobileLink " + (args.isActive ? "active" : "")}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <Link className="btn" to="/assessment" onClick={() => setOpen(false)}>Start Now</Link>
          </Container>
        </div>
      )}
    </header>
  );
}
