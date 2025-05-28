/**
 * Formats a number as a currency string in German locale with EUR suffix.
 *
 * @param value - A numeric value representing currency.
 * @returns A string formatted as currency (e.g., "3.500 EUR").
 */
export const formatCurrency = (value: number): string =>
  `${value.toLocaleString("de-DE")} EUR`;
