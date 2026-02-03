import { useEffect } from "react";
import { seo, pageTitle, absUrl, absImage } from "../data/seo";

function setMetaTag({ name, property, content }) {
  if (typeof document === "undefined") return;
  const selector = name
    ? `meta[name="${name}"]`
    : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    if (name) tag.setAttribute("name", name);
    if (property) tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(url) {
  if (typeof document === "undefined") return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

export default function SEO({ title, description, path = "/", image }) {
  useEffect(() => {
    const t = pageTitle(title);
    const d = description || seo.defaultDescription;
    const url = absUrl(path);
    const img = absImage(image);

    if (typeof document !== "undefined") {
      document.title = t;
    }

    setMetaTag({ name: "description", content: d });
    setCanonical(url);

    setMetaTag({ property: "og:type", content: "website" });
    setMetaTag({ property: "og:site_name", content: seo.siteName });
    setMetaTag({ property: "og:title", content: t });
    setMetaTag({ property: "og:description", content: d });
    setMetaTag({ property: "og:url", content: url });
    setMetaTag({ property: "og:image", content: img });
    setMetaTag({ property: "og:locale", content: seo.locale });

    setMetaTag({ name: "twitter:card", content: "summary_large_image" });
    setMetaTag({ name: "twitter:title", content: t });
    setMetaTag({ name: "twitter:description", content: d });
    setMetaTag({ name: "twitter:image", content: img });
  }, [title, description, path, image]);

  return null;
}
