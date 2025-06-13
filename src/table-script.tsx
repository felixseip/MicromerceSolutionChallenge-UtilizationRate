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

const tableData: TableDataType[] = (sourceData as unknown as SourceDataType[])
  .splice(0, 14)
  .map((dataRow, index) => {
    let person;
    let netEarningsPrevMonth: number = 0;
    let past12Months: number;
    let y2d: number;
    let may: number;
    let june: number;
    let july: number;
    if (
      dataRow.employees !== undefined &&
      dataRow.employees !== null &&
      dataRow.employees.status.toLowerCase() === "active"
    ) {
      person = `${dataRow.employees.firstname} ${dataRow.employees.lastname}`;
      netEarningsPrevMonth = Number(
        dataRow.employees.statusAggregation?.monthlySalary
      );
    } else if (
      dataRow.externals !== undefined &&
      dataRow.externals !== null &&
      dataRow.externals.status.toLowerCase() === "active"
    ) {
      person = `${dataRow.externals.firstname} ${dataRow.externals.lastname}`;
      netEarningsPrevMonth = Number(
        dataRow.externals.statusAggregation?.monthlySalary
      );
    }

    const row: TableDataType = {
      person: `${person}`,
      past12Months: `past12Months ${index} placeholder`,
      y2d: `y2d ${index} placeholder`,
      may: `may ${index} placeholder`,
      june: `june ${index} placeholder`,
      july: `july ${index} placeholder`,
      netEarningsPrevMonth: `${
        Number.isNaN(netEarningsPrevMonth) ? 0 : netEarningsPrevMonth
      } EUR`,
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
