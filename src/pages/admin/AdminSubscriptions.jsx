import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CardMembershipOutlinedIcon from "@mui/icons-material/CardMembershipOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminSubscriptions() {
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminAxiosInstance.get(
          "/admin-panel/subscriptions/",
        );

        setSubscriptions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin-login");
          return;
        }

        setError("Unable to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [navigate]);

  const filteredSubscriptions = useMemo(() => {
    const value = search.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const username =
        subscription.username ||
        subscription.user_name ||
        subscription.user?.username ||
        "";

      const email =
        subscription.email ||
        subscription.user_email ||
        subscription.user?.email ||
        "";

      const planName = subscription.plan_name || subscription.plan?.name || "";

      const matchesSearch =
        !value ||
        username.toLowerCase().includes(value) ||
        email.toLowerCase().includes(value) ||
        planName.toLowerCase().includes(value);

      const status = subscription.status?.toLowerCase() || "";
      const matchesStatus = !statusFilter || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const getStatusStyle = (status) => {
    const normalizedStatus = status?.toLowerCase();

    if (normalizedStatus === "active") {
      return {
        label: "Active",
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    if (normalizedStatus === "expired") {
      return {
        label: "Expired",
        bgcolor: "#fef3f2",
        color: "#b42318",
        border: "#fecdca",
      };
    }

    if (normalizedStatus === "cancelled") {
      return {
        label: "Cancelled",
        bgcolor: "#f2f4f7",
        color: "#475467",
        border: "#d0d5dd",
      };
    }

    return {
      label: status || "Pending",
      bgcolor: "#fffaeb",
      color: "#b54708",
      border: "#fedf89",
    };
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.13), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
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
            Manage Subscriptions
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "#667085",
              fontSize: { xs: 14, md: 15 },
            }}
          >
            View active, expired and cancelled agent subscriptions.
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
                label="Search subscriptions"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="User, email or plan"
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
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={textFieldStyle}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="expired">Expired</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
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
          {filteredSubscriptions.length} subscriptions found
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
        ) : filteredSubscriptions.length === 0 ? (
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
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(15, 118, 110, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <CardMembershipOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.8,
                  fontWeight: 850,
                  color: "#344054",
                  fontSize: 18,
                }}
              >
                No subscriptions found
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
                Try changing your search or status filter.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.7}>
            {filteredSubscriptions.map((subscription) => {
              const statusStyle = getStatusStyle(subscription.status);

              const username =
                subscription.username ||
                subscription.user_name ||
                subscription.user?.username ||
                "Unknown user";

              const email =
                subscription.email ||
                subscription.user_email ||
                subscription.user?.email ||
                "No email";

              const planName =
                subscription.plan_name ||
                subscription.plan?.name ||
                "Unknown plan";

              const propertyLimit =
                subscription.property_limit ??
                subscription.plan?.property_limit ??
                0;

              const usedProperties =
                subscription.used_properties ??
                subscription.properties_used ??
                0;

              const startDate =
                subscription.start_date ||
                subscription.started_at ||
                subscription.created_at;

              const endDate =
                subscription.end_date ||
                subscription.expiry_date ||
                subscription.expires_at;

              return (
                <Card
                  key={subscription.id}
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
                        "linear-gradient(145deg, rgba(236,253,245,0.85) 0%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0) 100%)",
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
                      bgcolor: "rgba(15, 118, 110, 0.08)",
                      boxShadow: "0 0 50px rgba(15, 118, 110, 0.1)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      borderColor: "#bbf7d0",
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
                        alignItems="flex-start"
                        sx={{ minWidth: 0, width: "100%" }}
                      >
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: "20px",
                            bgcolor: "#ecfdf5",
                            color: "#0f766e",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            boxShadow:
                              "0 14px 28px rgba(15, 118, 110, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
                            "& svg": {
                              fontSize: 28,
                            },
                          }}
                        >
                          <CardMembershipOutlinedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 18, md: 20 },
                              fontWeight: 850,
                              color: "#101828",
                              letterSpacing: "-0.4px",
                              lineHeight: 1.15,
                            }}
                          >
                            {username}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.4,
                              color: "#667085",
                              fontSize: 13.5,
                              wordBreak: "break-all",
                            }}
                          >
                            {email}
                          </Typography>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 0.9, sm: 1.5 }}
                            sx={{ mt: 1.3 }}
                          >
                            <InfoText
                              icon={<WorkspacePremiumOutlinedIcon />}
                              text={planName}
                            />

                            <InfoText
                              icon={<HomeWorkOutlinedIcon />}
                              text={`${usedProperties}/${propertyLimit} listings used`}
                            />
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack
                        spacing={1}
                        alignItems={{ xs: "flex-start", lg: "flex-end" }}
                        sx={{ width: { xs: "100%", lg: "auto" } }}
                      >
                        <Chip
                          label={statusStyle.label}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bgcolor,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 800,
                            textTransform: "capitalize",
                            borderRadius: "999px",
                            px: 0.5,
                          }}
                        />

                        <Stack
                          direction="row"
                          spacing={0.6}
                          alignItems="center"
                          sx={{
                            px: 1.2,
                            py: 0.75,
                            borderRadius: "999px",
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 6px 16px rgba(15, 23, 42, 0.035)",
                          }}
                        >
                          <CalendarMonthOutlinedIcon
                            sx={{ fontSize: 18, color: "#98a2b3" }}
                          />

                          <Typography
                            sx={{
                              color: "#667085",
                              fontSize: 13,
                              fontWeight: 650,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {formatDate(startDate)} - {formatDate(endDate)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

function InfoText({ icon, text }) {
  return (
    <Stack direction="row" spacing={0.55} alignItems="center">
      <Box
        sx={{
          color: "#98a2b3",
          display: "flex",
          "& svg": {
            fontSize: 18,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#475467",
          fontSize: 13.5,
          fontWeight: 650,
          textTransform: "capitalize",
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#f8fafc",
  },
};

export default AdminSubscriptions;
