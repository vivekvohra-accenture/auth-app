import { useMemo } from "react";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { router } from "./router";
import { useAppSelector } from "./app/hooks";
import { getAppTheme } from "./theme/theme";

export default function App() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}