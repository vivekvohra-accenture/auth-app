import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import type { SessionUser } from "../types/users";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import { generateMockToken } from "../utils/mockJwt";
import { useLazyGetUserByEmailQuery } from "../features/api/apiSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [getUserByEmail] = useLazyGetUserByEmailQuery();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: Record<string, string>) => {
    setAuthError("");
    setLoading(true);

    try {
      // Instead of sending password in URL query, fetch by email and verify password
      const users = await getUserByEmail(data.email).unwrap();

      if (!users || users.length === 0) {
        setAuthError("Invalid email or password");
        setLoading(false);
        return;
      }

      const user = users[0];

      if (user.password !== data.password) {
        setAuthError("Invalid email or password");
        setLoading(false);
        return;
      }

      const sessionUser: SessionUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      };
      
      const token = generateMockToken(sessionUser);
      dispatch(loginSuccess({ user: sessionUser, token }));

      navigate("/dashboard");
    } catch {
      setAuthError("Something went wrong while logging in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2
      }}
    >
      <Paper elevation={3} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          Login
        </Typography>

        {authError && <Alert severity="error" sx={{ mb: 2 }}>{authError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}