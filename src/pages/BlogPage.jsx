import PageHeader from "../components/PageHeader";
import BlogHighlights from "../components/BlogHighlights";
import ConsultationCTA from "../components/ConsultationCTA";
import SEO from "../components/SEO";

export default function BlogPage() {
  return (
    <>
      <SEO
        title="Travel Tips"
        description="Practical travel tips, visa checklists, and planning advice from Jonhrega Travel and Tours."
        path="/blog"
      />
      <PageHeader
        title="Travel Tips & Blog"
        subtitle="Helpful articles, checklists, and planning advice for your next trip."
      />
      <BlogHighlights />
      <ConsultationCTA eyebrow="Need help planning?" />
    </>
  );
}
