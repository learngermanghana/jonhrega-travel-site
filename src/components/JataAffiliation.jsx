import Container from "./Container";

export default function JataAffiliation() {
  return (
    <section
      aria-labelledby="jata-affiliation-title"
      style={{ padding: "2.5rem 0", background: "#fff" }}
    >
      <Container>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
            padding: "1.5rem",
            border: "1px solid rgba(15, 23, 42, 0.1)",
            borderRadius: "18px",
            boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
            textAlign: "center"
          }}
        >
          <img
            src="/images/894ad77a-2e20-4b2c-9c0f-81bc4f094a0c.jpeg"
            alt="JATA Overseas Allied Member logo"
            loading="lazy"
            style={{
              width: "120px",
              maxWidth: "32vw",
              height: "auto",
              objectFit: "contain"
            }}
          />

          <div style={{ maxWidth: "560px" }}>
            <p
              style={{
                margin: "0 0 0.35rem",
                fontSize: "0.82rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase"
              }}
            >
              JATA Overseas Allied Member
            </p>
            <h2
              id="jata-affiliation-title"
              style={{ margin: 0, fontSize: "clamp(1.35rem, 3vw, 2rem)" }}
            >
              Affiliate member of Japan Association of Travel Agents (JATA)
            </h2>
          </div>
        </div>
      </Container>
    </section>
  );
}
