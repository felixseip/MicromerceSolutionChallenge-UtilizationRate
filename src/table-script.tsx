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
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} august - The value for August.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */

const tableData: TableDataType[] = (
  sourceData as unknown as SourceDataType[]
).flatMap((dataRow, index) => {

  // Extracting employee/external data
  const employeeData = dataRow?.employees ?? dataRow?.externals;
  console.log(employeeData?.status);

  // Here got confused if we've to consider status or statusAggregation?.status Attribute to check if the employee is active or not

  // For now, I'm considering the status attribute
  if (employeeData?.status != "active") {
  return []; // Skipping inactive employees
  }

  // Extracting informations
  const person = `${employeeData?.firstname} ${employeeData?.lastname}`;
  const util = employeeData?.workforceUtilisation;
  const y2d = util?.utilisationRateYearToDate;
  const past12Months = util?.utilisationRateLastTwelveMonths;

  // For extracting the utilisation rate by month
  const get_utilByMonth = (month: string) => {
    return util?.lastThreeMonthsIndividually?.find(
      (util) => util?.month === month
    )?.utilisationRate;
  }

  // A utility funtion for formatting the util rate
  const formatPercent = (value?: string | null) => {
    const num = Number(value);
    return isNaN(num) ? "..." : (num * 100).toFixed(1) + "%";
  };
  
  // Extracting the last month Salary and expenses
  const lastMonthSalary = Number(dataRow?.employees?.costsByMonth?.periods?.at(-1)?.monthlySalary ?? 0);
  const lastMonthExpenses = Number(dataRow?.employees?.costsByMonth?.potentialEarningsByMonth?.at(-1)?.costs ?? 0);

  const previousMonthSalary = lastMonthSalary - lastMonthExpenses;

  const row: TableDataType = {
    person: `${person}`,
    past12Months: formatPercent(past12Months),
    y2d: formatPercent(y2d),
    june: formatPercent(get_utilByMonth("June")),
    july: formatPercent(get_utilByMonth("July")),
    august: formatPercent(get_utilByMonth("August")),
    netEarningsPrevMonth: `${previousMonthSalary} EUR`,
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
