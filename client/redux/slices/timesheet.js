import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timesheetForm: false,
};

const timesheetSlice = createSlice({
  name: "timesheetForm",
  initialState,
  reducers: {
    setTimesheetForm: (state, action) => {
      state.timesheetForm = action.payload;
    },
  },
});

export const { setTimesheetForm } = timesheetSlice.actions;
export default timesheetSlice.reducer;
