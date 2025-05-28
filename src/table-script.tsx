import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";
import { formatCurrency } from "./utils/format-currency";
import { formatPercent } from "./utils/format-percent";

const displayMonths = ["May", "June", "July"];

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[])
  .map((dataRow) => {
    const personSource =
      dataRow.employees?.employmentStatus?.employmentStatus !== "Inaktiv"
        ? dataRow.employees
        : dataRow.externals?.employmentStatus?.employmentStatus !== "Inaktiv"
        ? dataRow.externals
        : null;

    if (!personSource) return null;

    const firstname = personSource.firstname || "";
    const lastname = personSource.lastname || "";
    const util = personSource.workforceUtilisation;

    const past12Months = util?.utilisationRateLastTwelveMonths
      ? formatPercent(parseFloat(util.utilisationRateLastTwelveMonths))
      : "-";
    const y2d = util?.utilisationRateYearToDate
      ? formatPercent(parseFloat(util.utilisationRateYearToDate))
      : "-";

    const lastThree = util?.lastThreeMonthsIndividually || [];
    const monthRates = displayMonths.reduce((acc, month) => {
      const entry = lastThree.find((m) => m.month === month);
      acc[month.toLowerCase()] = entry
        ? formatPercent(parseFloat(entry.utilisationRate))
        : "-";
      return acc;
    }, {} as Record<string, string>);

    const netEarningsPrevMonth = util?.monthlyCostDifference
      ? formatCurrency(parseFloat(util.monthlyCostDifference))
      : "-";

    const row: TableDataType = {
      person: `${firstname} ${lastname}`.trim(),
      past12Months,
      y2d,
      may: monthRates["may"],
      june: monthRates["june"],
      july: monthRates["july"],
      netEarningsPrevMonth,
    };

    return row;
  })
  .filter((row): row is TableDataType => row !== null);

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      { accessorKey: "person", header: "Person" },
      { accessorKey: "past12Months", header: "Past 12 Months" },
      { accessorKey: "y2d", header: "Y2D" },
      { accessorKey: "may", header: "May" },
      { accessorKey: "june", header: "June" },
      { accessorKey: "july", header: "July" },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({ columns, data: tableData });

  return <MaterialReactTable table={table} />;
};

export default Example;
