export const formatUtilizationRate = (rate: string | undefined): string => {
  if (!rate) {
    return 'N/A';
  }
  return `${Math.round(parseFloat(rate) * 100)}%`;
};

export const formatNetEarnings = (
  earnings: string | undefined,
  isExternal: boolean = false
): string => {
  if (!earnings) return 'N/A';

  const value = parseFloat(earnings);
  const formattedValue = Math.abs(value).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return isExternal ? `-${formattedValue}` : formattedValue;
};