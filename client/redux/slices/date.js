// Example action creator or reducer handling setting the date
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  date: "",
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
  },
});

export const { setDate } = dateSlice.actions;
export default dateSlice.reducer;
