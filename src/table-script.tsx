import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table"; // Importing Material React Table components and types
import { useMemo } from "react"; // Importing useMemo hook from React
import sourceData from "./source-data.json"; // Importing source data from a local JSON file
import type { SourceDataType, TableDataType } from "./types"; // Importing TypeScript types
import { format, subMonths } from "date-fns"; // Importing date formatting utilities

//  Helper: Get Net Earning for a specific month (e.g. "June" format: "yyyy-MM")
//  This function receives the costsByMonth object and a targetMonth string.
//  It searches for the entry in potentialEarningsByMonth that matches the targetMonth.
//  If found, it returns the costs with "EUR" appended, otherwise returns "-".
function getNetEarningsForMonth(
  costsByMonth:
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[]; // Array of earnings by month
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[]; // Array of earnings by month
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[]; // Array of earnings by month
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _updatedDate: string;
        _createdDate: string;
        _applicationId: string;
        periods: { monthlySalary: string; start: string; end: string }[];
        potentialEarningsByMonth: { costs: string; month: string }[];
        _definitionId: string;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[];
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _updatedDate: string;
        _createdDate: string;
        _applicationId: string;
        periods: { monthlySalary: string; start: string; end: string }[];
        potentialEarningsByMonth: { costs: string; month: string }[];
        _definitionId: string;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[];
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[];
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      }
    | {
        _updatedDate: string;
        _createdDate: string;
        _applicationId: string;
        periods: { monthlySalary: string; start: string; end: string }[];
        potentialEarningsByMonth: { costs: string; month: string }[];
        _definitionId: string;
      }
    | {
        _applicationId: string;
        potentialEarningsByMonth: { costs: string; month: string }[];
        _updatedDate: string;
        _definitionId: string;
        _createdDate: string;
        periods?: undefined;
      },
  targetMonth: any
) {
  if (!costsByMonth?.potentialEarningsByMonth) return "-";
  const entry = costsByMonth.potentialEarningsByMonth.find(
    (e) => e.month === targetMonth
  );
  return entry ? `${entry.costs} EUR` : "-";
}

//  Helper: Get utilization for a specific month (e.g. "June")
function getUtilizationForMonth(lastThreeMonths: any[], monthName: string) {
  if (!lastThreeMonths) return "-";
  const entry = lastThreeMonths.find((m) =>
    m.month.toLowerCase().startsWith(monthName.toLowerCase())
  );
  return entry ? `${Math.round(Number(entry.utilisationRate) * 100)}%` : "-";
}

// Actual date and previous month calculation(format "yyyy-MM")
const now = new Date();
const prevMonth = format(subMonths(now, 1), "yyyy-MM");

const tableData: TableDataType[] = (
  Array.isArray(sourceData) ? sourceData : [sourceData]
)
  .filter((entry) => entry.employees && entry.employees.status === "active")
  .map((entry) => {
    const emp = entry.employees!;
    const util = emp.workforceUtilisation || {};
    const costsByMonth = emp.costsByMonth || {};

    return {
      person: `${emp.firstname} ${emp.lastname}`,
      past12Months:
        util.utilisationRateLastTwelveMonths !== undefined
          ? `${Math.round(Number(util.utilisationRateLastTwelveMonths) * 100)}%`
          : "-",
      y2d:
        util.utilisationRateYearToDate !== undefined
          ? `${Math.round(Number(util.utilisationRateYearToDate) * 100)}%`
          : "-",
      may: getUtilizationForMonth(util.lastThreeMonthsIndividually, "May"),
      june: getUtilizationForMonth(util.lastThreeMonthsIndividually, "June"),
      july: getUtilizationForMonth(util.lastThreeMonthsIndividually, "July"),
      netEarningsPrevMonth: getNetEarningsForMonth(costsByMonth, prevMonth),
    };
  });

const Table = () => {
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

export default Table;
