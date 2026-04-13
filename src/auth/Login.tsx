import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import type { SessionUser, UserDb } from "../types/users";

const API_URL = "http://localhost:3001/users";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      );

      const users: UserDb[] = await response.json();

      if (users.length === 0) {
        setError("Invalid email or password");
        return;
      }

      const user = users[0];

      const sessionUser: SessionUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      };

      localStorage.setItem("currentUser", JSON.stringify(sessionUser));
      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong while logging in");
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
        bgcolor: "#f5f5f5",
        px: 2
      }}
    >
      <Paper elevation={3} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}