import { useEffect, useState } from "react";
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
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chooseLoading, setChooseLoading] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axiosInstance.get("/plans/");
        setPlans(response.data);
      } catch (err) {
        setError("Failed to load plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const getBadge = (name) => {
    const planName = name?.toLowerCase();

    if (planName === "silver") return "Most Popular";
    if (planName === "gold") return "Best Value";
    return "Starter";
  };

  const isFeatured = (name) => name?.toLowerCase() === "silver";

  const handleChoosePlan = async (planId) => {
    setChooseLoading(planId);
    setError("");

    try {
      const orderResponse = await axiosInstance.post(
        `/payments/create-order/${planId}/`,
      );

      const orderData = orderResponse.data;
      const user = JSON.parse(localStorage.getItem("user"));

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "BuySel",
        description: `${orderData.plan.name} Subscription`,
        order_id: orderData.order_id,

        handler: async function (response) {
          await axiosInstance.post("/payments/verify/", {
            payment_id: orderData.payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          navigate("/dashboard");
        },

        prefill: {
          name: user?.username || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },

        theme: {
          color: "#065f46",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (err) {
      console.log(err.response?.data);
      setError("Payment could not be started. Please try again.");
    } finally {
      setChooseLoading(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ minHeight: 72 }}
          >
            <Button
              component={Link}
              to="/dashboard"
              startIcon={<ArrowBackIcon />}
              sx={{
                color: "#475467",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Back to Dashboard
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            mb: 5,
            textAlign: "center",
          }}
        >
          <Chip
            label="Subscription Plans"
            sx={{
              bgcolor: "#ecfdf5",
              color: "#047857",
              fontWeight: 800,
              borderRadius: 2,
              mb: 2,
              px: 1,
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 34, md: 48 },
              fontWeight: 750,
              color: "#111827",
              letterSpacing: "-0.8px",
              lineHeight: 1.1,
            }}
          >
            Choose a plan that fits your listings
          </Typography>

          <Typography
            sx={{
              mt: 1.5,
              color: "#667085",
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: 16,
            }}
          >
            Select a simple subscription plan and start publishing your
            properties with listing limits and validity.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <CircularProgress sx={{ color: "#065f46" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && plans.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {plans.map((plan) => {
              const featured = isFeatured(plan.name);

              return (
                <Card
                  key={plan.id}
                  elevation={0}
                  sx={{
                    border: featured
                      ? "1.5px solid #059669"
                      : "1px solid #e5e7eb",
                    borderRadius: 4,
                    bgcolor: "#ffffff",
                    position: "relative",
                    overflow: "hidden",
                    transition: "0.2s ease",
                    boxShadow: featured
                      ? "0 16px 35px rgba(5, 150, 105, 0.12)"
                      : "0 8px 24px rgba(15, 23, 42, 0.03)",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.08)",
                      borderColor: featured ? "#059669" : "#cbd5e1",
                    },
                  }}
                >
                  {featured && (
                    <Box
                      sx={{
                        height: 5,
                        bgcolor: "#059669",
                        width: "100%",
                      }}
                    />
                  )}

                  <CardContent
                    sx={{
                      p: { xs: 3, md: 3.5 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          bgcolor: featured ? "#065f46" : "#ecfdf5",
                          color: featured ? "#ffffff" : "#059669",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <WorkspacePremiumOutlinedIcon />
                      </Box>

                      <Chip
                        label={getBadge(plan.name)}
                        size="small"
                        sx={{
                          bgcolor: featured ? "#ecfdf5" : "#f8fafc",
                          color: featured ? "#047857" : "#475467",
                          border: "1px solid #e5e7eb",
                          fontWeight: 700,
                          borderRadius: "999px",
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h5"
                      fontWeight={750}
                      color="#1f2937"
                      sx={{ mt: 3 }}
                    >
                      {plan.name}
                    </Typography>

                    <Typography color="#667085" sx={{ mt: 0.8 }}>
                      Perfect for property listing management.
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="flex-end"
                      spacing={1}
                      sx={{ mt: 3 }}
                    >
                      <Typography
                        sx={{
                          fontSize: { xs: 38, md: 44 },
                          fontWeight: 800,
                          color: "#065f46",
                          lineHeight: 1,
                          letterSpacing: "-0.8px",
                        }}
                      >
                        ₹{Number(plan.price).toFixed(0)}
                      </Typography>

                      <Typography color="#667085" sx={{ mb: 0.5 }}>
                        / plan
                      </Typography>
                    </Stack>

                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: "#f8fafc",
                        border: "1px solid #eef2f7",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        sx={{ mb: 1.5 }}
                      >
                        <CheckCircleIcon
                          sx={{ color: "#059669", fontSize: 20 }}
                        />
                        <Typography color="#344054" fontWeight={600}>
                          {plan.duration_days} days validity
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "#059669", fontSize: 20 }}
                        />
                        <Typography color="#344054" fontWeight={600}>
                          Add up to {plan.property_limit} properties
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    <Button
                      fullWidth
                      variant={featured ? "contained" : "outlined"}
                      disabled={chooseLoading === plan.id}
                      onClick={() => handleChoosePlan(plan.id)}
                      sx={{
                        mt: 4,
                        py: 1.25,
                        borderRadius: 2,
                        fontWeight: 750,
                        textTransform: "none",
                        boxShadow: "none",
                        bgcolor: featured ? "#065f46" : "#ffffff",
                        color: featured ? "#ffffff" : "#065f46",
                        borderColor: "#bbf7d0",
                        "&:hover": {
                          bgcolor: featured ? "#047857" : "#ecfdf5",
                          borderColor: "#059669",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {chooseLoading === plan.id
                        ? "Choosing..."
                        : "Choose Plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {!loading && plans.length === 0 && !error && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent sx={{ py: 7, textAlign: "center" }}>
              <Typography fontWeight={700} color="#1f2937">
                No plans available
              </Typography>

              <Typography color="#667085" sx={{ mt: 1 }}>
                Plans will appear here once added by admin.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

export default Plans;
