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
import type { UserDb } from "../types/users";

const API_URL = "http://localhost:3001/users";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getNextUserId = (users: UserDb[]) => {
    const numericIds = users
      .map((user) => Number(user.id))
      .filter((id): id is number => Number.isFinite(id));

    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const checkResponse = await fetch(
        `${API_URL}?email=${encodeURIComponent(formData.email)}`
      );

      const existingUsers: UserDb[] = await checkResponse.json();

      if (existingUsers.length > 0) {
        setError("Email already registered");
        return;
      }

      const allUsersResponse = await fetch(API_URL);
      const allUsers: UserDb[] = await allUsersResponse.json();
      const nextId = getNextUserId(allUsers);

      const newUser: UserDb = {
        id: nextId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        role: "USER"
      };

      const createResponse = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
      });

      if (!createResponse.ok) {
        throw new Error("Failed to register");
      }

      alert("Registration successful. Please login.");
      navigate("/");
    } catch (err) {
      setError("Something went wrong while registering");
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
      <Paper elevation={3} sx={{ width: 420, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Register
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <TextField
            fullWidth
            label="Mobile"
            margin="normal"
            value={formData.mobile}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}