import Container from "./Container";
import { company } from "../data/company";

export default function PageHeader({ title, subtitle }) {
  return (
    <header className="pageHeader">
      <Container className="pageHeader__inner">
        <div className="badge">{company.licensedNote}</div>
        <h1 className="pageHeader__title">{title}</h1>
        {subtitle ? <p className="pageHeader__sub">{subtitle}</p> : null}
      </Container>
    </header>
  );
}
