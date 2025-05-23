import type { MRT_ColumnDef } from "material-react-table";
import type { TableDataType } from "../types";

const renderNetEarningsCell = ({ cell }: { cell: any }) => {
  const value = cell.getValue<string>();
  if (value === 'N/A') return value;

  const isNegative = value.startsWith('-');
  return (
    <span style={{ color: isNegative ? '#ff4d4f' : '#52c41a' }}>
      {value}
    </span>
  );
};

export const getTableColumns = (): MRT_ColumnDef<TableDataType>[] => [
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
    Cell: renderNetEarningsCell,
  },
];