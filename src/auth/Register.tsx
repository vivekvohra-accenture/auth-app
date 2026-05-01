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
import type { UserDb } from "../types/users";
import { useLazyGetUserByEmailQuery, useGetUsersQuery, useCreateUserMutation } from "../features/api/apiSlice";

export default function Register() {
  const navigate = useNavigate();

  const [getUserByEmail] = useLazyGetUserByEmailQuery();
  const { data: allUsers } = useGetUsersQuery(); // To calculate the next ID easily
  const [createUser] = useCreateUserMutation();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      password: ""
    }
  });

  const [registerError, setRegisterError] = useState("");
  const [loading, setLoading] = useState(false);

  const getNextUserId = (users: UserDb[]) => {
    const numericIds = users
      .map((user) => Number(user.id))
      .filter((id): id is number => Number.isFinite(id));

    return numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
  };

  const onSubmit = async (data: Record<string, string>) => {
    setRegisterError("");
    setLoading(true);

    try {
      const existingUsers = await getUserByEmail(data.email).unwrap();

      if (existingUsers && existingUsers.length > 0) {
        setRegisterError("Email already registered");
        setLoading(false);
        return;
      }

      const nextId = getNextUserId(allUsers || []);

      const newUser: UserDb = {
        id: nextId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: "USER"
      };

      await createUser(newUser).unwrap();

      alert("Registration successful. Please login.");
      navigate("/");
    } catch {
      setRegisterError("Something went wrong while registering");
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
      <Paper elevation={3} sx={{ width: 420, p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ textAlign: "center", mb: 3 }}>
          Register
        </Typography>

        {registerError && <Alert severity="error" sx={{ mb: 2 }}>{registerError}</Alert>}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            {...register("firstName", { required: "First Name is required" })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            {...register("lastName", { required: "Last Name is required" })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Entered value does not match email format"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Mobile"
            margin="normal"
            {...register("mobile", { required: "Mobile is required" })}
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              },
              validate: (value) => {
                const hasLetter = /[a-zA-Z]/.test(value);
                const hasNumber = /[0-9]/.test(value);
                if (!hasLetter || !hasNumber) {
                  return "Password must contain at least one letter and one number";
                }
                return true;
              }
            })}
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
            {loading ? "Creating account..." : "Register"}
          </Button>
        </Box>

        <Box sx={{ mt: 2, textAlign: "center" }}>
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