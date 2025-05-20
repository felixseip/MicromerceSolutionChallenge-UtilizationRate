import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"
import { useMemo } from "react"
import sourceData from "./source-data.json"
import type { SourceDataType, TableDataType } from "./types"

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

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).map((dataRow) => {
  const emp = dataRow.employees;
  const util = emp?.workforceUtilisation;

  const getUtilByMonth = (month: string) => {
    const found = util?.lastThreeMonthsIndividually?.find(
      (m) => m.month.toLowerCase() === month.toLowerCase()
    );
    return found ? `${(parseFloat(found.utilisationRate) * 100).toFixed(0)}%` : "0%";
  };

  const row: TableDataType = {
    person: `${emp?.firstname} ${emp?.lastname}`,
    past12Months: util?.utilisationRateLastTwelveMonths
      ? `${(parseFloat(util.utilisationRateLastTwelveMonths) * 100).toFixed(0)}%`
      : "0%",
    y2d: util?.utilisationRateYearToDate
      ? `${(parseFloat(util.utilisationRateYearToDate) * 100).toFixed(0)}%`
      : "0%",
    may: getUtilByMonth("May"),
    june: getUtilByMonth("June"),
    july: getUtilByMonth("July"),
    netEarningsPrevMonth: util?.monthlyCostDifference
      ? `${parseFloat(util.monthlyCostDifference).toFixed(0)} EUR`
      : "0 EUR",
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