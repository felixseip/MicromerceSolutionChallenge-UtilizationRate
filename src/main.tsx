import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import WorkforceUtilizationTable from "./table-script";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <WorkforceUtilizationTable />
  </StrictMode>
);
