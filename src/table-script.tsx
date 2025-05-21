import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {string} past12Months - The utilization rate for the past 12 months.
 * @prop {string} y2d - The year-to-date utilization rate.
 * @prop {string} may - The utilization rate for May.
 * @prop {string} june - The utilization rate for June.
 * @prop {string} july - The utilization rate for July.
 * @prop {string} netEarningsPrevMonth - The net earnings for the previous month in EUR.
 */

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[]).map((dataRow) => {
  const personData = dataRow?.employees || dataRow?.externals;

  if (!personData) {
    return null;
  }

  const isActive = personData.status === 'active';

  if (!isActive) {
    return null;
  }

  const person = personData?.name.trim();

  const workforceUtilisation = personData?.workforceUtilisation;

  const formatUtilizationRate = (rate: string) => {
    if (!rate) {
      return 'N/A';
    }
    return `${Math.round(parseFloat(rate) * 100)}%`;
  };

  const lastThreeMonths = workforceUtilisation?.lastThreeMonthsIndividually || [];

  const findMonthRate = (monthName: string) => {
    const monthData = lastThreeMonths.find(m => m.month === monthName);
    return monthData ? formatUtilizationRate(monthData.utilisationRate) : 'N/A';
  };

  const formatNetEarnings = (earnings: string | undefined) => {
    if (!earnings)
        return 'N/A';

    const value = parseFloat(earnings);
    const formattedValue = Math.abs(value).toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return dataRow?.externals ? `-${formattedValue}` : formattedValue;
  };

  const row: TableDataType = {
    person: person,
    past12Months: formatUtilizationRate(workforceUtilisation?.utilisationRateLastTwelveMonths),
    y2d: formatUtilizationRate(workforceUtilisation?.utilisationRateYearToDate),
    may: findMonthRate('May'),
    june: findMonthRate('June'),
    july: findMonthRate('July'),
    netEarningsPrevMonth: formatNetEarnings(workforceUtilisation?.monthlyCostDifference),
  };

  return row;
}).filter(Boolean) as TableDataType[];

const filteredTableData = tableData.filter(row => {
  const hasData = Object.entries(row).some(([key, value]) => {
    return key !== 'person' && value !== 'N/A';
  });
  return hasData;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "may",
        header: "May",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",

        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          if (value === 'N/A') return value;

          // Style negative values (for external contractors) in red
          const isNegative = value.startsWith('-');
          return (
            <span style={{ color: isNegative ? '#ff4d4f' : '#52c41a' }}>
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: filteredTableData,
    enableSorting: true,
    initialState: {
      sorting: [
        {
          id: 'past12Months',
          desc: true,
        },
      ],
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Example;