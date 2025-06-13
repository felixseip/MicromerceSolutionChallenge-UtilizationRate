import React, { useMemo, useEffect } from "react";    
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType as BaseTableDataType } from "./types";

// Extend base type to allow dynamic month keys
type ExtendedTableDataType = BaseTableDataType & Record<string, string>;

// Helper Functions
const formatPercentage = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return `${(num * 100).toFixed(0)}%`;
};

const formatCurrency = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "N/A";
  const num = parseFloat(value);
  if (isNaN(num)) return "N/A";
  return `${num.toFixed(0)} EUR`;
};

const getMonthlyUtilisation = (
  data: { month: string; utilisationRate: string }[] | undefined,
  monthName: string
): string => {
  if (!data) return "N/A";
  const found = data.find(
    (m) => m.month.toLowerCase() === monthName.toLowerCase()
  );
  return found ? formatPercentage(found.utilisationRate) : "N/A";
};

const WorkforceUtilizationTable: React.FC = () => {
  // Compute last three months list
  const lastThreeMonths = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (2 - i));
      const monthName = date.toLocaleString("default", { month: "long" });
      const accessor = monthName.toLowerCase();
      return { monthName, accessor };
    });
  }, []);

  // Prepare table data
  const tableData = useMemo<ExtendedTableDataType[]>(() => {
    return (sourceData as SourceDataType[])
      .filter(
        (row) =>
          row.employees?.status === "active" ||
          row.externals?.employmentStatus?.employmentStatus === "Aktiv"
      )
      .map((row) => {
        const person = row.employees?.name || row.externals?.name || "Unknown";
        const wf = row.employees?.workforceUtilisation || row.externals?.workforceUtilisation;

        const baseRow: any = {
          person,
          past12Months: formatPercentage(wf?.utilisationRateLastTwelveMonths),
          y2d: formatPercentage(wf?.utilisationRateYearToDate),
          netEarningsPrevMonth: formatCurrency(wf?.monthlyCostDifference),
        };

        lastThreeMonths.forEach(({ monthName, accessor }) => {
          baseRow[accessor] = getMonthlyUtilisation(
            wf?.lastThreeMonthsIndividually,
            monthName
          );
        });

        return baseRow;
      });
  }, [lastThreeMonths]);

  // Debug logs
  useEffect(() => {
    console.log("Last three months:", lastThreeMonths);
    console.log("Computed tableData:", tableData);
  }, [lastThreeMonths, tableData]);

  // Column definitions
  const columns = useMemo<MRT_ColumnDef<ExtendedTableDataType>[]>(
    () => {
      const baseCols: MRT_ColumnDef<ExtendedTableDataType>[] = [
        { accessorKey: "person", header: "Person" },
        { accessorKey: "past12Months", header: "Past 12 Months" },
        { accessorKey: "y2d", header: "Y2D" },
      ];

      const monthCols = lastThreeMonths.map(({ monthName, accessor }) => ({
        accessorKey: accessor as keyof ExtendedTableDataType,
        header: monthName,
      }));

      const endCol: MRT_ColumnDef<ExtendedTableDataType> = {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      };

      return [...baseCols, ...monthCols, endCol];
    }, [lastThreeMonths]
  );

  if (tableData.length === 0) {
    return <div>No data to display</div>;
  }

  const table = useMaterialReactTable({ columns, data: tableData });

  return (
    <div style={{ padding: "1rem" }}>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default WorkforceUtilizationTable;
