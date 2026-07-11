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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Button
          component={Link}
          to="/dashboard"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "#475467",
            fontWeight: 700,
            textTransform: "none",
            mb: 3,
          }}
        >
          Back to Dashboard
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: { xs: 28, md: 36 },
              fontWeight: 900,
              color: "#0f172a",
              letterSpacing: "-0.5px",
            }}
          >
            Plan Order History
          </Typography>

          <Typography color="#667085" sx={{ mt: 1 }}>
            View your plan purchases, payment method, amount and expiry details.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#059669" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && payments.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "white",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <ReceiptLongOutlinedIcon
                sx={{ fontSize: 54, color: "#059669" }}
              />

              <Typography sx={{ mt: 2, fontWeight: 900, fontSize: 20 }}>
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
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 800,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#047857",
                    boxShadow: "none",
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
            {payments.map((payment) => (
              <Card
                key={payment.id}
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  bgcolor: "white",
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: "#bbf7d0",
                    boxShadow: "0 12px 30px rgba(15,23,42,0.07)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    spacing={2.5}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: "#ecfdf5",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <ReceiptLongOutlinedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: "#0f172a",
                              fontSize: 18,
                              textTransform: "capitalize",
                            }}
                          >
                            {payment.plan_name || "Plan"}
                          </Typography>

                          <Typography color="#667085" fontSize={13}>
                            Duration: {payment.plan_duration || "N/A"} days
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                          },
                          gap: 1.5,
                          mt: 2.5,
                        }}
                      >
                        <InfoItem
                          label="Plan Taken Date"
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
                          value={`₹${Number(payment.amount || 0).toLocaleString(
                            "en-IN",
                          )}`}
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
                        gap: 1,
                        flexShrink: 0,
                      }}
                    >
                      <Chip
                        label={payment.status || "created"}
                        color={getStatusColor(payment.status)}
                        sx={{
                          fontWeight: 900,
                          textTransform: "capitalize",
                          borderRadius: 2,
                        }}
                      />

                      <Button
                        component={Link}
                        to="/plans"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontWeight: 800,
                          color: "#059669",
                        }}
                      >
                        View Plans
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
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
        p: 1.4,
        borderRadius: 2,
        bgcolor: "#f8fafc",
        border: "1px solid #eef2f7",
      }}
    >
      <Typography
        color="#94a3b8"
        fontSize={12}
        fontWeight={900}
        sx={{ textTransform: "uppercase", letterSpacing: 0.4 }}
      >
        {label}
      </Typography>

      <Typography
        color="#344054"
        fontSize={13.5}
        fontWeight={800}
        sx={{
          mt: 0.5,
          wordBreak: "break-word",
        }}
      >
        {value || "N/A"}
      </Typography>
    </Box>
  );
}

export default PaymentHistory;
