import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SessionUser } from "../../types/users";
import { isTokenExpired } from "../../utils/mockJwt";

type AuthState = {
  currentUser: SessionUser | null;
  token: string | null;           // 🆕 added
  isAuthenticated: boolean;
};

// ---------- READ FROM LOCALSTORAGE ON APP LOAD ----------
const getStoredAuth = (): { user: SessionUser | null; token: string | null } => {
  const storedUser = localStorage.getItem("currentUser");
  const storedToken = localStorage.getItem("token");

  if (!storedUser || !storedToken) {
    return { user: null, token: null };
  }

  // 🆕 If token expired, clear everything
  if (isTokenExpired(storedToken)) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(storedUser) as SessionUser, token: storedToken };
  } catch {
    return { user: null, token: null };
  }
};

const storedAuth = getStoredAuth();

const initialState: AuthState = {
  currentUser: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: !!storedAuth.user && !!storedAuth.token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🆕 Replaces setCurrentUser — now handles token + localStorage too
    loginSuccess: (
      state,
      action: PayloadAction<{ user: SessionUser; token: string }>
    ) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save to localStorage (so it survives refresh)
      localStorage.setItem("currentUser", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    // 🆕 Replaces clearCurrentUser — clears everything in one place
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;