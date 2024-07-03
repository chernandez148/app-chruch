// timesheetSlice.js or similar
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employeeForm: false, // Initial state should match the structure of your data
};

const employeeFormSlice = createSlice({
  name: "employeeForm", // Name should match the slice name you want to use in the Redux store
  initialState,
  reducers: {
    setEmployeeForm: (state, action) => {
      state.employeeForm = action.payload;
    },
  },
});

export const { setEmployeeForm } = employeeFormSlice.actions;
export default employeeFormSlice.reducer;
