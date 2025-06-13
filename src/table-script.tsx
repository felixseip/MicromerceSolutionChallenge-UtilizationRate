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
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

// Filtering the data to only use the employees or externals who are active

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[])
  .filter((item) => {
    const personData = item.employees ?? item.externals;
    return personData?.status === "active";
  })
  .map((dataRow) => {
    // Joining both employee and external  employees into personData
    const personData = dataRow.employees ?? dataRow.externals;

    const person = `${personData?.name ?? "-"}`; // extracting the employees name

    // function to format the data into percentage
    const percentageConverter = (data: string): string => {
      const percentage = `${(parseFloat(data) * 100).toFixed(0)}%`;
      return percentage;
    };

    // extracting the utilization rate of past 12 months
    const pastYearUtilization = percentageConverter(
      personData?.workforceUtilisation?.utilisationRateLastTwelveMonths ?? ""
    );

    // extracting the Y2d data
    const y2dData = percentageConverter(
      personData?.workforceUtilisation?.utilisationRateYearToDate ?? ""
    );

    // creating an array of past three months
    const lastThreeMonths =
      personData?.workforceUtilisation?.lastThreeMonthsIndividually ?? [];

    console.log(personData);

    // function to extract utilization rate of particular month
    const findMonth = (name: string): string => {
      const entry = lastThreeMonths?.find((item) => item.month === name);
      const percentage = percentageConverter(entry?.utilisationRate ?? "");
      return percentage;
    };

    const formatNetEarningsPrevMonth = (): string => {
      // getting todays date to calculate the previous month date
      const today = new Date();
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthDate = previousMonth.toISOString().slice(0, 7);

      const earningsEntry =
        personData?.costsByMonth?.potentialEarningsByMonth?.find(
          (item) => item.month === monthDate
        );

      const earnings = parseFloat(earningsEntry?.costs ?? "0");

      return `${earnings >= 0 ? "" : "-"}${Math.abs(earnings)} EUR`;
    };

    const row: TableDataType = {
      person: `${person}`,
      past12Months: pastYearUtilization,
      y2d: y2dData,
      june: findMonth("June"),
      july: findMonth("July"),
      august: findMonth("August"),
      netEarningsPrevMonth: formatNetEarningsPrevMonth(),
    };

    return row;
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
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "august",
        header: "August",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
