// timesheetSlice.js or similar
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timecard: {}, // Initial state should match the structure of your data
};

const timesheetSlice = createSlice({
  name: "timecard", // Name should match the slice name you want to use in the Redux store
  initialState,
  reducers: {
    setTimecard: (state, action) => {
      state.timecard = action.payload; // Update timecard array with payload data
    },
  },
});

export const { setTimecard } = timesheetSlice.actions;
export default timesheetSlice.reducer;
