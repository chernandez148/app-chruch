import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user";
import timesheetReducer from "./slices/timesheet";
import dateReducer from "./slices/date";
import timecardReducer from "./slices/timecard";
import employeeFormReducer from "./slices/employeeForm";

export const store = configureStore({
  reducer: {
    user: userReducer,
    timesheet: timesheetReducer,
    date: dateReducer,
    timecard: timecardReducer,
    employeeForm: employeeFormReducer,
  },
});
