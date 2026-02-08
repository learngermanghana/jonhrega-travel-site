export const seo = {
  baseUrl: "https://www.jonhregatravelandtours.com",
  siteName: "Jonhrega Travel and Tours",
  defaultDescription:
    "Jonhrega Travel and Tours (Licensed by Ghana Tourism Authority) — visas, study abroad, flights, tours, corporate travel, medical tourism, and travel insurance in Accra, Ghana.",
  defaultImage: "/og.svg",
  locale: "en_GB"
};

export function pageTitle(title) {
  return title ? `${title} | ${seo.siteName}` : seo.siteName;
}

function normalizePath(path = "/") {
  if (!path) return "/";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.replace(/\/+$/, "");
}

export function absUrl(path = "/") {
  const normalizedPath = normalizePath(path);
  return `${seo.baseUrl}${normalizedPath}`;
}

export function absImage(imgPath) {
  if (!imgPath) imgPath = seo.defaultImage;
  return imgPath.startsWith("http") ? imgPath : `${seo.baseUrl}${imgPath}`;
}
