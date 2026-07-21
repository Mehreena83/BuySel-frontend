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

import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminPayments() {
  const navigate = useNavigate();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminAxiosInstance.get("/admin-panel/payments/");

        setPayments(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin-login");
          return;
        }

        setError("Unable to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  const filteredPayments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !value ||
        payment.username?.toLowerCase().includes(value) ||
        payment.plan_name?.toLowerCase().includes(value) ||
        payment.razorpay_order_id?.toLowerCase().includes(value) ||
        payment.razorpay_payment_id?.toLowerCase().includes(value);

      const matchesStatus = !statusFilter || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const getStatusStyle = (status) => {
    if (status === "success") {
      return {
        label: "Success",
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    if (status === "failed") {
      return {
        label: "Failed",
        bgcolor: "#fef3f2",
        color: "#b42318",
        border: "#fecdca",
      };
    }

    return {
      label: "Created",
      bgcolor: "#fffaeb",
      color: "#b54708",
      border: "#fedf89",
    };
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.13), transparent 28%), radial-gradient(circle at top right, rgba(53,56,205,0.08), transparent 30%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
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
            Payment History
          </Typography>

          <Typography
            sx={{
              mt: 0.8,
              color: "#667085",
              fontSize: { xs: 14, md: 15 },
            }}
          >
            View all plan payment transactions.
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
                label="Search payments"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="User, plan or payment ID"
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
                <MenuItem value="created">Created</MenuItem>
                <MenuItem value="success">Success</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
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
          {filteredPayments.length} payments found
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
        ) : filteredPayments.length === 0 ? (
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
                  bgcolor: "#eef4ff",
                  color: "#3538cd",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(53, 56, 205, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <PaymentsOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.8,
                  fontWeight: 850,
                  color: "#344054",
                  fontSize: 18,
                }}
              >
                No payments found
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
                Try changing your search or status filter.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.7}>
            {filteredPayments.map((payment) => {
              const status = getStatusStyle(payment.status);

              return (
                <Card
                  key={payment.id}
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
                        "linear-gradient(145deg, rgba(238,244,255,0.75) 0%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0) 100%)",
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
                      bgcolor: "rgba(53, 56, 205, 0.07)",
                      boxShadow: "0 0 50px rgba(53, 56, 205, 0.08)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      borderColor: "#c7d7fe",
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
                      gap={2}
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
                            bgcolor: "#eef4ff",
                            color: "#3538cd",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                            boxShadow:
                              "0 14px 28px rgba(53, 56, 205, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
                            "& svg": {
                              fontSize: 28,
                            },
                          }}
                        >
                          <PaymentsOutlinedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography
                            sx={{
                              fontSize: { xs: 20, md: 22 },
                              fontWeight: 900,
                              color: "#101828",
                              letterSpacing: "-0.5px",
                              lineHeight: 1,
                            }}
                          >
                            ₹
                            {Number(payment.amount || 0).toLocaleString(
                              "en-IN",
                            )}
                          </Typography>

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={{ xs: 0.8, sm: 1.5 }}
                            sx={{ mt: 1.2 }}
                          >
                            <InfoText
                              icon={<PersonOutlineOutlinedIcon />}
                              text={payment.username || "Unknown user"}
                            />

                            <InfoText
                              icon={<WorkspacePremiumOutlinedIcon />}
                              text={payment.plan_name || "Unknown plan"}
                            />

                            <InfoText
                              icon={<CalendarMonthOutlinedIcon />}
                              text={
                                payment.created_at
                                  ? new Date(
                                      payment.created_at,
                                    ).toLocaleDateString("en-IN")
                                  : "N/A"
                              }
                            />
                          </Stack>

                          <Box sx={{ mt: 1.3 }}>
                            <IdText
                              label="Order ID"
                              value={
                                payment.razorpay_order_id || "Not available"
                              }
                            />

                            <IdText
                              label="Payment ID"
                              value={
                                payment.razorpay_payment_id || "Not available"
                              }
                            />
                          </Box>
                        </Box>
                      </Stack>

                      <Stack
                        direction={{ xs: "row", lg: "column" }}
                        spacing={1}
                        alignItems={{ xs: "center", lg: "flex-end" }}
                        sx={{
                          width: { xs: "100%", lg: "auto" },
                          justifyContent: { xs: "space-between", lg: "unset" },
                        }}
                      >
                        <Chip
                          label={status.label}
                          size="small"
                          sx={{
                            bgcolor: status.bgcolor,
                            color: status.color,
                            border: `1px solid ${status.border}`,
                            fontWeight: 800,
                            borderRadius: "999px",
                            px: 0.5,
                          }}
                        />

                        <Typography
                          sx={{
                            color: "#667085",
                            fontSize: 13,
                            textTransform: "capitalize",
                            fontWeight: 650,
                          }}
                        >
                          {payment.payment_method || "Unknown method"}
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
            fontSize: 17,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#667085",
          fontSize: 13.5,
          fontWeight: 550,
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

function IdText({ label, value }) {
  return (
    <Typography
      sx={{
        mt: 0.35,
        color: "#98a2b3",
        fontSize: 12.5,
        wordBreak: "break-all",
        lineHeight: 1.5,
      }}
    >
      <Box component="span" sx={{ fontWeight: 800, color: "#667085" }}>
        {label}:
      </Box>{" "}
      {value}
    </Typography>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#f8fafc",
  },
};

export default AdminPayments;
