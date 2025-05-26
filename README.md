To run this code:

- `npm install` or `yarn`
- `npm run start` or `yarn start`

The relevant files in the src folder to work with are:
- table-script.tsx -> contains the relevant code for preparing and displaying the data
- source-data.json -> contains all the relevant data needed for the exercise

### 📗 User Story

As a User of the Workforce Management Backoffice, I would like to understand workforce utilisation rate on a per person level with associated costs.

    Utilization rate is the percentage of an employee's total hours spent doing billable work instead of internal or non-billable work

### 📋 Detailed Requirements Description

Please implement a dashboard that has the structure of the table below:

- dashboard shows each active person (employees and externals)
- we can see utilisation year to date, last twelve months, last three months

| Person     | Past 12 Months | Y2D | May | June | July | Net Earnings Prev Month |
| ---------- | -------------- | --- | --- | ---- | ---- | ----------------------- |
| Person A   | 89%            | ... | ... | 72%  | ...  | 3500 EUR                |
| External D | ...            | ... | ... | 72%  | ...  | -1980 EUR               |

### ✅ Acceptance Criteria

- All fields that fetch data (e.g. Net earnings prev Month) are fetched correctly for each cell
- All mathematical operations are correctly performed and displayed in an intuitive way

###  Implementation Details
Active Persons Only:
Only persons with status "active" are shown in the table.

Utilization Rates:
The utilization rates for the past 12 months, year-to-date, and the last three individual months (May, June, July) are extracted from the data and displayed as percentages. If a value is missing, a dash (-) is shown.

Net Earnings Previous Month:
The net earnings for the previous month are dynamically determined using the current date and displayed in EUR. If no data is available, a dash (-) is shown.

Data Processing:

All data is loaded from source-data.json.

In table-script.tsx, the data is filtered and mapped to match the table requirements.

Helper functions are used:

getNetEarningsForMonth: Finds the net earnings for a given month (format: YYYY-MM) in the potentialEarningsByMonth array.

getUtilizationForMonth: Finds the utilization rate for a specific month (e.g., "June") from the lastThreeMonthsIndividually array and formats it as a percentage.

The code uses date-fns to calculate the previous month and handle date formatting.

Table Rendering:
The Table component uses Material React Table to render the processed data with the required column headers.

Example Table Row:

| Person        | Past 12 Months | Y2D | May | June | July | Net Earnings Prev Month |
| ----------    | -------------- | --- | --- | ---- | ---- | ----------------------- |
| Justus Peter  |  67%           | 67% | -   | 0%   | 67%  | 0 EUR                   |

Extensibility:
To add more months or columns, adjust the mapping and column definitions in table-script.tsx.
To change the data source, update source-data.json accordingly.