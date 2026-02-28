import PageHeader from "../components/PageHeader";
import BlogHighlights from "../components/BlogHighlights";
import ConsultationCTA from "../components/ConsultationCTA";
import InternalLinksSection from "../components/InternalLinksSection";
import SEO from "../components/SEO";
import { articleSchemas } from "../data/structuredData";

const relatedLinks = [
  {
    to: "/assessment",
    title: "Start Visa Assessment",
    description: "Apply the blog checklists directly in the visa assessment form for faster processing."
  },
  {
    to: "/services",
    title: "Travel Service Options",
    description: "Match each guide with the right visa, study abroad, or insurance support service."
  },
  {
    to: "/tours",
    title: "Tours & Package Ideas",
    description: "Turn travel tips into actionable destination and package choices."
  }
];

export default function BlogPage() {
  return (
    <>
      <SEO
        title="Travel Tips"
        description="Practical travel tips, visa checklists, and planning advice from Jonhrega Travel and Tours."
        path="/blog"
        image="/images/plane.jpeg"
        ogType="article"
        structuredData={articleSchemas()}
      />
      <PageHeader
        title="Travel Tips & Blog"
        subtitle="Helpful articles, checklists, and planning advice for your next trip."
      />
      <BlogHighlights />
      <InternalLinksSection
        title="Related planning tools"
        description="Continue from travel guides into assessments and service pages."
        links={relatedLinks}
      />
      <ConsultationCTA eyebrow="Need help planning?" />
    </>
  );
}
