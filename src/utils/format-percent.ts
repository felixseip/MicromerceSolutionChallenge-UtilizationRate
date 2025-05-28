/**
 * Formats a decimal number as a percentage string.
 *
 * @param value - A number between 0 and 1 representing a percentage.
 * @returns A string formatted as a whole number percentage (e.g., "67%").
 */
export const formatPercent = (value: number): string =>
  `${(value * 100).toFixed(0)}%`;
