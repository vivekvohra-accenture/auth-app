import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import { DarkMode, LightMode } from "@mui/icons-material";
import { useGetUsersQuery } from "../features/api/apiSlice";

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Add theme mode reading:
  const themeMode = useAppSelector((state) => state.theme.mode);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // RTK Query handles loading, data, and error automatically!
  // skip the query if user is not ADMIN
  const { data: allUsers = [], isLoading, isError } = useGetUsersQuery(undefined, {
    skip: currentUser?.role !== "ADMIN"
  });

  const handleLogout = () => {
    dispatch(logout());          // clears Redux + localStorage automatically
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

        
        <IconButton onClick={() => dispatch(toggleTheme())} color="primary">
          {themeMode === "light" ? <DarkMode /> : <LightMode />}
        </IconButton>

      </Box>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load users</Alert>}

      {currentUser.role === "ADMIN" ? (
        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">All Users</Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
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
            <Typography variant="h6" sx={{ mb: 2 }}>
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