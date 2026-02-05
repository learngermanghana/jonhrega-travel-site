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

export function absUrl(path = "/") {
  return `${seo.baseUrl}${path}`;
}

export function absImage(imgPath) {
  if (!imgPath) imgPath = seo.defaultImage;
  return imgPath.startsWith("http") ? imgPath : `${seo.baseUrl}${imgPath}`;
}
