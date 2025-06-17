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

/**
 * Helper function to format utilization rate as percentage
 */
const formatUtilizationRate = (rate: string | number | undefined): string => {
  if (rate === undefined || rate === null) return "0%";
  const numericRate = typeof rate === "string" ? parseFloat(rate) : rate;
  return isNaN(numericRate) ? "0%" : `${(numericRate * 100).toFixed(0)}%`;
};

/**
 * Helper function to get utilization rate for a specific month
 */
const getMonthUtilization = (monthlyData: any[], monthName: string): string => {
  if (!monthlyData || monthlyData.length === 0) return "0%";
  const monthData = monthlyData.find(
    (item) => item?.month?.toLowerCase() === monthName.toLowerCase()
  );
  return monthData ? formatUtilizationRate(monthData.utilisationRate) : "0%";
};

/**
 * Helper function to calculate net earnings for previous month
 */
const calculateNetEarnings = (
  monthlyData: any[],
  hourlyRate: string | undefined,
  monthlyCostDifference: string | undefined
): string => {
  if (!monthlyData || monthlyData.length === 0 || !hourlyRate) {
    return "0 EUR";
  }

  // Get the most recent month's utilization (assuming it's the previous month)
  const recentMonth = monthlyData[0]; // First item should be most recent
  if (!recentMonth) return "0 EUR";

  const utilizationRate = parseFloat(recentMonth.utilisationRate || "0");
  const rate = parseFloat(hourlyRate || "0");
  const costDiff = parseFloat(monthlyCostDifference || "0");

  if (isNaN(utilizationRate) || isNaN(rate)) {
    return "0 EUR";
  }

  // Simple calculation: hourly rate * utilization factor + cost difference
  const baseEarnings = rate * utilizationRate * 160; // Assuming ~160 hours per month
  const netEarnings = baseEarnings + (isNaN(costDiff) ? 0 : costDiff);

  return `${netEarnings.toFixed(0)} EUR`;
};

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[])
  .filter((dataRow) => {
    return (
      dataRow?.employees &&
      dataRow.employees.firstname &&
      dataRow.employees.lastname &&
      dataRow.employees.workforceUtilisation
    );
  })
  .map((dataRow) => {
    const employee = dataRow.employees!;
    const utilization = employee.workforceUtilisation!;

    // Build person name
    const person = `${employee.firstname} ${employee.lastname}`;

    // Extract utilization rates
    const past12Months = formatUtilizationRate(
      utilization.utilisationRateLastTwelveMonths
    );
    const y2d = formatUtilizationRate(utilization.utilisationRateYearToDate);

    // Get monthly utilization rates
    const monthlyData = utilization.lastThreeMonthsIndividually || [];
    const may = getMonthUtilization(monthlyData, "May");
    const june = getMonthUtilization(monthlyData, "June");
    const july = getMonthUtilization(monthlyData, "July");

    // Calculate net earnings for previous month
    const netEarningsPrevMonth = calculateNetEarnings(
      monthlyData,
      employee.hourlyRateForProjects,
      utilization.monthlyCostDifference
    );

    const row: TableDataType = {
      person,
      past12Months,
      y2d,
      may,
      june,
      july,
      netEarningsPrevMonth,
    };

    return row;
  });

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
        size: 150,
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
        size: 130,
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
        size: 80,
      },
      {
        accessorKey: "may",
        header: "May",
        size: 80,
      },
      {
        accessorKey: "june",
        header: "June",
        size: 80,
      },
      {
        accessorKey: "july",
        header: "July",
        size: 80,
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
        size: 180,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableSorting: true,
    enableColumnFilters: true,
    enablePagination: false,
    enableBottomToolbar: false,
    muiTableContainerProps: {
      sx: {
        maxHeight: "600px",
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
