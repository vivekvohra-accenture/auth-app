import { createSlice } from "@reduxjs/toolkit";

type ThemeState = {
  mode: "light" | "dark";
};

const getStoredTheme = (): "light" | "dark" => {
  const stored = localStorage.getItem("themeMode");
  return stored === "dark" ? "dark" : "light";
};

const initialState: ThemeState = {
  mode: getStoredTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("themeMode", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;