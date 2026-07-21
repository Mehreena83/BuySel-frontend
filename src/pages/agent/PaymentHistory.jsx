import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import axiosInstance from "../../api/axiosInstance";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    if (status === "success") return "success";
    if (status === "failed") return "error";
    return "warning";
  };

  const getStatusStyle = (status) => {
    if (status === "success") {
      return {
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    if (status === "failed") {
      return {
        bgcolor: "#fef3f2",
        color: "#b42318",
        border: "#fecdca",
      };
    }

    return {
      bgcolor: "#fffaeb",
      color: "#b54708",
      border: "#fedf89",
    };
  };

  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";

    if (method === "card") return "Card";
    if (method === "upi") return "UPI";
    if (method === "netbanking") return "Net Banking";
    if (method === "wallet") return "Wallet";
    if (method === "emi") return "EMI";
    if (method === "paylater") return "Pay Later";

    return method;
  };

  const calculateExpireDate = (payment) => {
    if (payment.expire_date) return payment.expire_date;

    const startDate = payment.plan_taken_date || payment.created_at;
    const duration = Number(payment.plan_duration || 0);

    if (!startDate || !duration) return null;

    const date = new Date(startDate);
    date.setDate(date.getDate() + duration);

    return date;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/payments/history/");
        setPayments(response.data);
      } catch (err) {
        console.log(err.response?.data);
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fb",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.12), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 50%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 27, md: 34 },
              fontWeight: 850,
              color: "#101828",
              letterSpacing: "-0.8px",
            }}
          >
            Plan Order History
          </Typography>

          <Typography color="#667085" sx={{ mt: 1, fontSize: 15 }}>
            View your plan purchases, payment method, amount and expiry details.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#059669" }} />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              mb: 3,
              border: "1px solid #fecdca",
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && payments.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed #d0d5dd",
              borderRadius: "28px",
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 24px 54px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  mx: "auto",
                  borderRadius: "24px",
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 18px 34px rgba(15,118,110,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <ReceiptLongOutlinedIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography
                sx={{
                  mt: 2,
                  fontWeight: 850,
                  fontSize: 20,
                  color: "#101828",
                }}
              >
                No order history yet
              </Typography>

              <Typography color="#667085" sx={{ mt: 1, mb: 3 }}>
                Your plan purchases will appear here.
              </Typography>

              <Button
                component={Link}
                to="/plans"
                variant="contained"
                sx={{
                  bgcolor: "#065f46",
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  px: 3,
                  py: 1.05,
                  boxShadow: "0 12px 24px rgba(6,95,70,0.18)",
                  "&:hover": {
                    bgcolor: "#047857",
                    boxShadow: "0 14px 28px rgba(6,95,70,0.22)",
                  },
                }}
              >
                Choose Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {!loading && !error && payments.length > 0 && (
          <Stack spacing={2}>
            {payments.map((payment) => {
              const statusStyle = getStatusStyle(payment.status);

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
                      "0 18px 42px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                    transition: "0.24s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(145deg, rgba(236,253,245,0.82) 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 100%)",
                      pointerEvents: "none",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: 140,
                      height: 140,
                      borderRadius: "50%",
                      right: -55,
                      top: -55,
                      bgcolor: "rgba(15,118,110,0.07)",
                      boxShadow: "0 0 55px rgba(15,118,110,0.1)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      borderColor: "#bbf7d0",
                      boxShadow:
                        "0 26px 58px rgba(15,23,42,0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      position: "relative",
                      zIndex: 1,
                      p: { xs: 2.4, md: 3 },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "stretch", md: "flex-start" }}
                      spacing={2.5}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1.3}
                          alignItems="center"
                        >
                          <Box
                            sx={{
                              width: 52,
                              height: 52,
                              borderRadius: "18px",
                              bgcolor: "#ecfdf5",
                              color: "#0f766e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              boxShadow:
                                "0 14px 28px rgba(15,118,110,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                              "& svg": {
                                fontSize: 28,
                              },
                            }}
                          >
                            <ReceiptLongOutlinedIcon />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 850,
                                color: "#101828",
                                fontSize: 19,
                                textTransform: "capitalize",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                letterSpacing: "-0.3px",
                              }}
                            >
                              {payment.plan_name || "Plan"}
                            </Typography>

                            <Typography color="#667085" fontSize={13.5}>
                              Duration: {payment.plan_duration || "N/A"} days
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: {
                              xs: "1fr",
                              sm: "repeat(2, 1fr)",
                            },
                            gap: 1.4,
                            mt: 2.4,
                          }}
                        >
                          <InfoItem
                            label="Plan Taken"
                            value={formatDate(
                              payment.plan_taken_date || payment.created_at,
                            )}
                          />

                          <InfoItem
                            label="Expire Date"
                            value={formatDate(calculateExpireDate(payment))}
                          />

                          <InfoItem
                            label="Payment Method"
                            value={formatPaymentMethod(payment.payment_method)}
                          />

                          <InfoItem
                            label="Amount"
                            value={`₹${Number(
                              payment.amount || 0,
                            ).toLocaleString("en-IN")}`}
                          />

                          <InfoItem
                            label="Order ID"
                            value={payment.razorpay_order_id || "N/A"}
                          />

                          <InfoItem
                            label="Payment ID"
                            value={payment.razorpay_payment_id || "N/A"}
                          />
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: { xs: "flex-start", md: "flex-end" },
                          flexDirection: "column",
                          gap: 1.1,
                          flexShrink: 0,
                        }}
                      >
                        <Chip
                          label={payment.status || "created"}
                          color={getStatusColor(payment.status)}
                          size="small"
                          sx={{
                            bgcolor: statusStyle.bgcolor,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                            fontWeight: 850,
                            textTransform: "capitalize",
                            borderRadius: "999px",
                            px: 0.7,
                            minWidth: 88,
                          }}
                        />

                        <Button
                          component={Link}
                          to="/plans"
                          size="small"
                          sx={{
                            textTransform: "none",
                            fontWeight: 800,
                            color: "#047857",
                            px: 1.2,
                            borderRadius: "12px",
                            bgcolor: "#ffffff",
                            border: "1px solid #bbf7d0",
                            boxShadow: "0 8px 18px rgba(15,118,110,0.06)",
                            "&:hover": {
                              bgcolor: "#ecfdf5",
                              color: "#065f46",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          View Plans
                        </Button>
                      </Box>
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

function InfoItem({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.25,
        borderRadius: "15px",
        bgcolor: "rgba(248,250,252,0.85)",
        border: "1px solid #eef2f7",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 18px rgba(15,23,42,0.035)",
      }}
    >
      <Typography
        sx={{
          color: "#98a2b3",
          fontSize: 12,
          fontWeight: 700,
          mb: 0.35,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#344054",
          fontSize: 13,
          fontWeight: 700,
          wordBreak: "break-word",
          lineHeight: 1.4,
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

export default PaymentHistory;
