function positiveNumber(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

export function formatMoney(value, currency = "GHS") {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for price";

  const normalizedCurrency = String(currency || "GHS").trim().toUpperCase() || "GHS";

  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(2)}`;
  }
}

export function dualCurrencyValues(item, multiplier = 1) {
  const safeMultiplier = Number.isFinite(Number(multiplier)) && Number(multiplier) > 0
    ? Number(multiplier)
    : 1;

  const ghs = positiveNumber(item?.priceGhs);
  const usd = positiveNumber(item?.priceUsd);
  const sourcePrice = positiveNumber(item?.price);
  const sourceCurrency = String(item?.currency || "GHS").trim().toUpperCase();

  return {
    ghs: ghs ? ghs * safeMultiplier : sourceCurrency === "GHS" && sourcePrice ? sourcePrice * safeMultiplier : null,
    usd: usd ? usd * safeMultiplier : sourceCurrency === "USD" && sourcePrice ? sourcePrice * safeMultiplier : null,
    sourcePrice: sourcePrice ? sourcePrice * safeMultiplier : null,
    sourceCurrency
  };
}

export function formatDualPrice(item, { multiplier = 1, fallback = "Contact for price" } = {}) {
  const values = dualCurrencyValues(item, multiplier);

  if (values.ghs && values.usd) {
    return `${formatMoney(values.ghs, "GHS")} · ${formatMoney(values.usd, "USD")}`;
  }

  if (values.ghs) return formatMoney(values.ghs, "GHS");
  if (values.usd) return formatMoney(values.usd, "USD");
  if (values.sourcePrice) return formatMoney(values.sourcePrice, values.sourceCurrency);

  return fallback;
}

export function hasDualCurrencyPrice(item) {
  const values = dualCurrencyValues(item);
  return Boolean(values.ghs && values.usd);
}
