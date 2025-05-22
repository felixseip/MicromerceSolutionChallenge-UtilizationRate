// FormatCurrency function
const formatCurrency = (value: number | string): string =>
  parseFloat(value as string).toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });

export default formatCurrency;
