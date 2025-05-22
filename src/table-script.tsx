import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";
import { Chip } from "@mui/material";
import formatCurrency from "../helpers/helperFunctions";
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
// Need to filter the data as the teams are not individual people.
const filteredData = (sourceData as unknown as SourceDataType[]).filter((dataRow) => {
  if (!dataRow?.teams) {
    return true;
  }
});

const tableData: TableDataType[] = filteredData.map((dataRow, index) => {
  // Added last name so we know who we are looking at, if there's 3 shahrukhs, we can distinguish them by their last names (hopefully)
  // Here, the data contains teams (which is not a person) as-well, we need to filter the data this means.

  const person = dataRow?.employees ? `${dataRow?.employees?.name}` : `${dataRow?.externals?.name}`;
  const pastTwelveMonths = `${
    dataRow?.employees
      ? dataRow?.employees?.workforceUtilisation?.utilisationRateLastTwelveMonths
      : dataRow?.externals?.workforceUtilisation?.utilisationRateLastTwelveMonths
  }`;
  const yearToDate = `${
    dataRow?.employees
      ? dataRow?.employees?.workforceUtilisation?.utilisationRateYearToDate
      : dataRow?.externals?.workforceUtilisation?.utilisationRateYearToDate
  }`;

  const person_status = `${dataRow?.employees ? dataRow?.employees?.status : dataRow?.externals?.status}`;

  const costsArray =
    dataRow?.employees?.costsByMonth?.potentialEarningsByMonth ?? dataRow?.externals?.costsByMonth?.costsByMonth;
  const mayData = costsArray?.find((monthData) => monthData.month === "2025-05")?.costs ?? 0;
  const juneData = costsArray?.find((monthData) => monthData.month === "2025-06")?.costs ?? 0;
  const julyData = costsArray?.find((monthData) => monthData.month === "2025-07")?.costs ?? 0;

  // Net earnings = Total Revenue − Total Costs
  const netEarnings =
    dataRow?.employees?.workforceUtilisation?.monthlyCostDifference ??
    dataRow?.externals?.workforceUtilisation?.monthlyCostDifference;
  // Checking if external or not with !! operator
  const isExternal = !!dataRow?.externals;

  // Checking if external then put a minus sign because externals means cost and not revenue.
  const netEarningsPrevMonth = netEarnings
    ? `${isExternal ? "-" : ""}${Math.abs(parseFloat(netEarnings)).toLocaleString("de-DE", {
        style: "currency",
        currency: "EUR",
      })}`
    : "N/A";

  //Some formatted data
  const past12MonthsPercent = (parseFloat(pastTwelveMonths) * 100).toFixed(2) + " %";
  const ytdPercent = (parseFloat(yearToDate) * 100).toFixed(2) + " %";

  /* Add serial number to know how many instances i have and which instance i am currently looking at.
   This also helps in sorting the instances asc/desc depending on how i want to look at the data/ show it to an interested party*/

  const row: TableDataType = {
    person_status: person_status,
    serialNumber: index + 1,
    person: `${person}`,
    past12Months: `${past12MonthsPercent}`,
    y2d: `${ytdPercent}`,
    may: formatCurrency(mayData),
    june: formatCurrency(juneData),
    july: formatCurrency(julyData),
    netEarningsPrevMonth: netEarningsPrevMonth,
  };

  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "serialNumber",
        header: "Serial #",
        muiTableBodyCellProps: {
          style: { textAlign: "left" },
        },
      },
      {
        accessorKey: "person_status",
        header: "Status",
        Cell: ({ cell }) => {
          const status = cell.getValue<string>();
          console.log("status: ", status);
          return <Chip label={status} color={status.toLowerCase() === "active" ? "success" : "error"} />;
        },
      },
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
    layoutMode: "grid",
    // columnResizeMode:"onChange",

    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
