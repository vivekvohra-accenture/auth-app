import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import type { SessionUser, UserDb } from "../types/users";

const API_URL = "http://localhost:3001/users";

export default function Dashboard() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [allUsers, setAllUsers] = useState<UserDb[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (!storedUser) {
      navigate("/");
      return;
    }

    const parsedUser: SessionUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);

    if (parsedUser.role === "ADMIN") {
      fetchAllUsers();
    }
  }, [navigate]);

  const fetchAllUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      const users: UserDb[] = await response.json();
      setAllUsers(users);
    } catch (err) {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4
        }}
      >
        <Box>
          <Typography variant="h4">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, {currentUser.firstName} ({currentUser.role})
          </Typography>
        </Box>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {currentUser.role === "ADMIN" ? (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">All Users</Typography>
          </Box>

          {loading ? (
            <Typography sx={{ p: 2 }}>Loading users...</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>First Name</strong></TableCell>
                  <TableCell><strong>Last Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Mobile</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobile}</TableCell>
                    <TableCell>{user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      ) : (
        <Card elevation={3} sx={{ maxWidth: 500, borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" mb={2}>
              My Profile
            </Typography>

            <Typography><strong>First Name:</strong> {currentUser.firstName}</Typography>
            <Typography><strong>Last Name:</strong> {currentUser.lastName}</Typography>
            <Typography><strong>Email:</strong> {currentUser.email}</Typography>
            <Typography><strong>Mobile:</strong> {currentUser.mobile}</Typography>
            <Typography><strong>Role:</strong> {currentUser.role}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}