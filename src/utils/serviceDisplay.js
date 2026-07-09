export function decodeEntities(value = "") {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function cleanServiceText(value = "") {
  return decodeEntities(value)
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function serviceSummary(value = "", maxLength = 150) {
  const text = cleanServiceText(value).replace(/\s+/g, " ").trim();
  if (!text) return "Book this service with Jonhrega Travel and Tours.";
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength);
  const lastStop = Math.max(clipped.lastIndexOf(". "), clipped.lastIndexOf("! "), clipped.lastIndexOf("? "));
  if (lastStop > 70) return clipped.slice(0, lastStop + 1).trim();

  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 70 ? lastSpace : maxLength).trim()}...`;
}

export function serviceParagraphs(value = "") {
  const text = cleanServiceText(value);
  if (!text) return ["Book this service with Jonhrega Travel and Tours. Our team will contact you with requirements, timeline, and next steps."];

  const paragraphs = text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (paragraphs.length > 1) return paragraphs;

  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function servicePath(service) {
  return `/services/${encodeURIComponent(service.id || service.name || "service")}`;
}

export function findServiceByParam(services, param) {
  const decoded = decodeURIComponent(param || "");
  return services.find((service) => String(service.id) === decoded) || null;
}

export function formatPrice(price) {
  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for price";

  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}
