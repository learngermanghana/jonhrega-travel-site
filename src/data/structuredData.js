import { company } from "./company";
import { services } from "./services";
import { seo, absUrl, absImage } from "./seo";
import { blogPosts } from "./blogPosts";

const organizationId = `${seo.baseUrl}#organization`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: company.name,
    url: seo.baseUrl,
    logo: absImage("/images/Jonhrega T.T.png"),
    email: company.email,
    telephone: company.phones?.[0]?.value,
    sameAs: [seo.baseUrl],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.address.digital[0]}, ${company.address.digital[1]}, ${company.address.digital[2]}`,
      addressLocality: "Accra",
      addressCountry: "GH"
    }
  };
}

export function serviceSchemas() {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    provider: {
      "@type": "Organization",
      "@id": organizationId,
      name: company.name
    },
    areaServed: "Ghana",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absUrl("/assessment")
    },
    description: service.items.join(", ")
  }));
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I start a visa assessment?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Go to the visa assessment page, fill in your travel details, and submit directly to WhatsApp for quick guidance."
        }
      },
      {
        "@type": "Question",
        name: "Do you support study abroad and travel insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Jonhrega Travel and Tours supports study abroad admissions, student visas, and travel insurance options."
        }
      },
      {
        "@type": "Question",
        name: "Can I request tours and flight bookings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can request tours, flight booking, and custom itinerary planning through the consultation form."
        }
      }
    ]
  };
}

export function articleSchemas() {
  return blogPosts.map((post) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Organization",
      "@id": organizationId,
      name: company.name
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId,
      name: company.name,
      logo: {
        "@type": "ImageObject",
        url: absImage("/images/Jonhrega T.T.png")
      }
    },
    mainEntityOfPage: absUrl(`/blog#${post.slug}`),
    image: absImage("/og.svg"),
    datePublished: "2026-01-01",
    dateModified: "2026-01-01"
  }));
}
