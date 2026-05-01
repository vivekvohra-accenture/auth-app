import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../features/theme/themeSlice";  // 🆕 add this import
import { apiSlice } from "../features/api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,    // 🆕 add this line
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// These automatically update — no changes needed here
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;