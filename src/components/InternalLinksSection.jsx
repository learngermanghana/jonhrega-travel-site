import { Link } from "react-router-dom";
import Container from "./Container";

export default function InternalLinksSection({ title, description, links }) {
  return (
    <section className="section">
      <Container>
        <div className="section__head">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="quickLinksGrid">
          {links.map((link) => (
            <Link className="quickLinkCard" key={link.to} to={link.to}>
              <h3>{link.title}</h3>
              <p>{link.description}</p>
              <span>Explore</span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
