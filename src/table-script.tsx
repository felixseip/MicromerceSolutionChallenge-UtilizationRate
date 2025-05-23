import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import sourceData from "./source-data.json";
import type { SourceDataType } from "./types";
import { transformSourceData, filterTableData } from "./utils/dataTransformers";
import { getTableColumns } from "./components/TableColumns";

/* Employee Utilization Table Component
 * Displays employee and external contractor utilization rates and earnings
 */
const Example = () => {
  const filteredTableData = filterTableData(
    transformSourceData(sourceData as unknown as SourceDataType[])
  );

  const columns = getTableColumns();

  const table = useMaterialReactTable({
    columns,
    data: filteredTableData,
    enableSorting: true,
    initialState: {
      sorting: [
        {
          id: 'past12Months',
          desc: true,
        },
      ],
      pagination: {
        pageSize: 20,
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default Example;