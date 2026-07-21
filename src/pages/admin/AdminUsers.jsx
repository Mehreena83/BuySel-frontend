import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminAxiosInstance.get("/admin-panel/users/");
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin-login");
          return;
        }

        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const filteredUsers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !searchValue ||
        user.username?.toLowerCase().includes(searchValue) ||
        user.email?.toLowerCase().includes(searchValue) ||
        user.phone?.toLowerCase().includes(searchValue);

      const matchesRole = !roleFilter || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const getRoleStyle = (role) => {
    if (role === "agent") {
      return {
        label: "Agent",
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    return {
      label: "User",
      bgcolor: "#eff8ff",
      color: "#175cd3",
      border: "#b2ddff",
    };
  };

  const getStatusStyle = (isActive) => {
    if (isActive) {
      return {
        label: "Active",
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    return {
      label: "Inactive",
      bgcolor: "#fef3f2",
      color: "#b42318",
      border: "#fecdca",
    };
  };

  const handleToggleUserStatus = async (user) => {
    try {
      setUpdatingUserId(user.id);

      const response = await adminAxiosInstance.patch(
        `/admin-panel/users/${user.id}/toggle-status/`,
      );

      const updatedUser = response.data?.user;

      setUsers((previousUsers) =>
        previousUsers.map((currentUser) =>
          currentUser.id === user.id
            ? updatedUser || {
                ...currentUser,
                is_active: !currentUser.is_active,
              }
            : currentUser,
        ),
      );

      setSnackbar({
        open: true,
        message:
          response.data?.message ||
          (user.is_active
            ? "User blocked successfully."
            : "User activated successfully."),
        severity: "success",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

      setSnackbar({
        open: true,
        message:
          err.response?.data?.message ||
          err.response?.data?.detail ||
          "Unable to update user status.",
        severity: "error",
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.13), transparent 28%), radial-gradient(circle at top right, rgba(23,92,211,0.08), transparent 30%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 35 },
              fontWeight: 850,
              color: "#101828",
              letterSpacing: "-1px",
              lineHeight: 1.12,
            }}
          >
            Manage Users
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "#667085",
              fontSize: { xs: 14, md: 15 },
            }}
          >
            View registered users and property agents.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "26px",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(14px)",
            boxShadow:
              "0 20px 45px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2.2, md: 2.7 },
              "&:last-child": {
                pb: { xs: 2.2, md: 2.7 },
              },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "2fr 1fr",
                },
                gap: 1.5,
              }}
            >
              <TextField
                size="small"
                label="Search users"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Username, email or phone"
                InputProps={{
                  startAdornment: (
                    <SearchOutlinedIcon
                      sx={{
                        mr: 1,
                        color: "#98a2b3",
                        fontSize: 20,
                      }}
                    />
                  ),
                }}
                sx={textFieldStyle}
              />

              <TextField
                select
                size="small"
                label="Role"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={textFieldStyle}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">Users</MenuItem>
                <MenuItem value="agent">Agents</MenuItem>
              </TextField>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "16px",
              border: "1px solid #fecdca",
            }}
          >
            {error}
          </Alert>
        )}

        <Typography
          sx={{
            mb: 1.8,
            color: "#475467",
            fontSize: 14,
            fontWeight: 750,
          }}
        >
          {filteredUsers.length} users found
        </Typography>

        {loading ? (
          <Box
            sx={{
              minHeight: 320,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#0f766e" }} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed #d0d5dd",
              borderRadius: "28px",
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 24px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 7 }}>
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  mx: "auto",
                  borderRadius: "26px",
                  bgcolor: "#eff8ff",
                  color: "#175cd3",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(23, 92, 211, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <PeopleAltOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.8,
                  fontWeight: 850,
                  color: "#344054",
                  fontSize: 18,
                }}
              >
                No users found
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
                Try changing your search or role filter.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.7}>
            {filteredUsers.map((user) => {
              const roleStyle = getRoleStyle(user.role);
              const statusStyle = getStatusStyle(user.is_active);

              return (
                <Card
                  key={user.id}
                  elevation={0}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: "26px",
                    bgcolor: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(14px)",
                    boxShadow:
                      "0 18px 42px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                    transition: "0.24s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(145deg, rgba(239,248,255,0.75) 0%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0) 100%)",
                      pointerEvents: "none",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      right: -48,
                      top: -48,
                      bgcolor: "rgba(23, 92, 211, 0.07)",
                      boxShadow: "0 0 50px rgba(23, 92, 211, 0.08)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      borderColor: "#b2ddff",
                      boxShadow:
                        "0 26px 58px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      p: { xs: 2.2, md: 2.7 },
                      "&:last-child": {
                        pb: { xs: 2.2, md: 2.7 },
                      },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", lg: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", lg: "center" }}
                      gap={2.5}
                    >
                      <Stack
                        direction="row"
                        spacing={1.6}
                        alignItems="center"
                        sx={{ minWidth: 0, width: "100%" }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "#0f766e",
                            width: 56,
                            height: 56,
                            fontWeight: 850,
                            fontSize: 18,
                            flexShrink: 0,
                            boxShadow:
                              "0 14px 28px rgba(15, 118, 110, 0.18), inset 0 1px 0 rgba(255,255,255,0.25)",
                          }}
                        >
                          {user.username?.charAt(0)?.toUpperCase() || "U"}
                        </Avatar>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 18, md: 20 },
                              fontWeight: 850,
                              color: "#101828",
                              letterSpacing: "-0.4px",
                              lineHeight: 1.15,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.username || "Unknown user"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.45,
                              color: "#667085",
                              fontSize: 13.5,
                              wordBreak: "break-all",
                            }}
                          >
                            {user.email || "No email"}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.25,
                              color: "#98a2b3",
                              fontSize: 13,
                              wordBreak: "break-all",
                            }}
                          >
                            {user.phone || "No phone"}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        sx={{
                          width: { xs: "100%", lg: "auto" },
                          justifyContent: { xs: "flex-start", sm: "flex-end" },
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          label={roleStyle.label}
                          size="small"
                          sx={{
                            bgcolor: roleStyle.bgcolor,
                            color: roleStyle.color,
                            border: `1px solid ${roleStyle.border}`,
                            fontWeight: 800,
                            borderRadius: "999px",
                            px: 0.5,
                          }}
                        />

                        <Chip
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bgcolor,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 800,
                            borderRadius: "999px",
                            px: 0.5,
                          }}
                        />

                        <Button
                          size="small"
                          variant={user.is_active ? "outlined" : "contained"}
                          color={user.is_active ? "error" : "success"}
                          disabled={updatingUserId === user.id}
                          onClick={() => handleToggleUserStatus(user)}
                          sx={{
                            minWidth: 108,
                            borderRadius: "15px",
                            textTransform: "none",
                            fontWeight: 800,
                            boxShadow: user.is_active
                              ? "0 8px 18px rgba(15,23,42,0.05)"
                              : "0 10px 22px rgba(6,118,71,0.15)",
                            bgcolor: user.is_active ? "#ffffff" : undefined,
                            transition: "0.2s ease",
                            "&:hover": {
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          {updatingUserId === user.id ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : user.is_active ? (
                            "Block"
                          ) : (
                            "Activate"
                          )}
                        </Button>

                        <Typography
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: "999px",
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 6px 16px rgba(15, 23, 42, 0.035)",
                            color: "#667085",
                            fontSize: 13,
                            fontWeight: 650,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Joined{" "}
                          {user.date_joined
                            ? new Date(user.date_joined).toLocaleDateString(
                                "en-IN",
                              )
                            : "N/A"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{
            borderRadius: "14px",
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#f8fafc",
  },
};

export default AdminUsers;
