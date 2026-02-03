import { seo, pageTitle, absUrl, absImage } from "../data/seo";

export default function SEO({ title, description, path = "/", image }) {
  const t = pageTitle(title);
  const d = description || seo.defaultDescription;
  const url = absUrl(path);
  const img = absImage(image);

  return (
    <>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />

      {/* OpenGraph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={seo.siteName} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={seo.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
      <meta name="twitter:image" content={img} />
    </>
  );
}
