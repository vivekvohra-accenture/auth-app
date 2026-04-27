import React, { useMemo } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { router } from "./router";
import { store } from "./app/store";
import { useAppSelector } from "./app/hooks";
import { getAppTheme } from "./theme/theme";

// 🆕 Wrapper that reads theme from Redux and applies it
function AppWithTheme() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* The code below links the router( defines which page for which route ) this page or app in general */}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

// We wrap the entire app in Redux Provider here, SO that theme and Store is everywhere
// but from here where does it link to
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppWithTheme />       {/* 🆕 changed from RouterProvider to this */}
    </Provider>
  </React.StrictMode>
);