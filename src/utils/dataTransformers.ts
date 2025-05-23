import type { SourceDataType, TableDataType } from '../types';
import { formatUtilizationRate, formatNetEarnings } from './formatters';

export const findMonthRate = (
  lastThreeMonths: Array<{ month: string; utilisationRate: string }>,
  monthName: string
): string => {
  const monthData = lastThreeMonths.find(m => m.month === monthName);
  return monthData ? formatUtilizationRate(monthData.utilisationRate) : 'N/A';
};

export const isPersonActive = (personData: any): boolean => {
  return personData?.status === 'active';
};

export const transformSourceDataRow = (dataRow: SourceDataType): TableDataType | null => {
  const personData = dataRow?.employees || dataRow?.externals;

  if (!personData || !isPersonActive(personData)) {
    return null;
  }

  const workforceUtilisation = personData?.workforceUtilisation;
  const lastThreeMonths = workforceUtilisation?.lastThreeMonthsIndividually || [];
  const isExternal = Boolean(dataRow?.externals);

  return {
    person: personData.name.trim(),
    past12Months: formatUtilizationRate(workforceUtilisation?.utilisationRateLastTwelveMonths),
    y2d: formatUtilizationRate(workforceUtilisation?.utilisationRateYearToDate),
    may: findMonthRate(lastThreeMonths, 'May'),
    june: findMonthRate(lastThreeMonths, 'June'),
    july: findMonthRate(lastThreeMonths, 'July'),
    netEarningsPrevMonth: formatNetEarnings(
      workforceUtilisation?.monthlyCostDifference,
      isExternal
    ),
  };
};

export const transformSourceData = (sourceData: SourceDataType[]): TableDataType[] => {
  return sourceData
    .map(transformSourceDataRow)
    .filter(Boolean) as TableDataType[];
};

export const hasRowMeaningfulData = (row: TableDataType): boolean => {
  return Object.entries(row).some(([key, value]) => {
    return key !== 'person' && value !== 'N/A';
  });
};

export const filterTableData = (tableData: TableDataType[]): TableDataType[] => {
  return tableData.filter(hasRowMeaningfulData);
};