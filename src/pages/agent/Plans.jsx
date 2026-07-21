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
import { useNavigate } from "react-router-dom";
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
        console.error(err.response?.data || err.message);
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.12), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 50%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
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
              fontWeight: 850,
              borderRadius: "999px",
              mb: 2,
              px: 1,
              border: "1px solid #bbf7d0",
              boxShadow: "0 10px 24px rgba(15,118,110,0.08)",
            }}
          />

          <Typography
            sx={{
              fontSize: { xs: 34, md: 48 },
              fontWeight: 850,
              color: "#101828",
              letterSpacing: "-1.3px",
              lineHeight: 1.08,
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
                    position: "relative",
                    overflow: "hidden",
                    border: featured
                      ? "1.5px solid rgba(5,150,105,0.55)"
                      : "1px solid rgba(255,255,255,0.9)",
                    borderRadius: "28px",
                    bgcolor: "rgba(255,255,255,0.94)",
                    backdropFilter: "blur(14px)",
                    transition: "0.25s ease",
                    boxShadow: featured
                      ? "0 24px 58px rgba(5,150,105,0.18), inset 0 1px 0 rgba(255,255,255,0.95)"
                      : "0 18px 42px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background: featured
                        ? "linear-gradient(145deg, rgba(236,253,245,0.92) 0%, rgba(255,255,255,0.20) 44%, rgba(255,255,255,0) 100%)"
                        : "linear-gradient(145deg, rgba(236,253,245,0.72) 0%, rgba(255,255,255,0.17) 42%, rgba(255,255,255,0) 100%)",
                      pointerEvents: "none",
                    },
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      right: -60,
                      top: -60,
                      bgcolor: featured
                        ? "rgba(5,150,105,0.12)"
                        : "rgba(15,118,110,0.07)",
                      boxShadow: "0 0 60px rgba(15,118,110,0.12)",
                      pointerEvents: "none",
                    },
                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "#bbf7d0",
                      boxShadow: featured
                        ? "0 30px 68px rgba(5,150,105,0.23), inset 0 1px 0 rgba(255,255,255,0.95)"
                        : "0 26px 58px rgba(15,23,42,0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
                    },
                  }}
                >
                  {featured && (
                    <Box
                      sx={{
                        height: 6,
                        bgcolor: "#059669",
                        width: "100%",
                        position: "relative",
                        zIndex: 1,
                      }}
                    />
                  )}

                  <CardContent
                    sx={{
                      position: "relative",
                      zIndex: 1,
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
                          width: 54,
                          height: 54,
                          borderRadius: "18px",
                          bgcolor: featured ? "#065f46" : "#ecfdf5",
                          color: featured ? "#ffffff" : "#059669",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: featured
                            ? "0 16px 30px rgba(6,95,70,0.24), inset 0 1px 0 rgba(255,255,255,0.22)"
                            : "0 14px 28px rgba(15,118,110,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                          "& svg": {
                            fontSize: 28,
                          },
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
                          fontWeight: 800,
                          borderRadius: "999px",
                          px: 0.7,
                          boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="h5"
                      fontWeight={850}
                      color="#101828"
                      sx={{ mt: 3, letterSpacing: "-0.4px" }}
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
                          fontWeight: 900,
                          color: "#065f46",
                          lineHeight: 1,
                          letterSpacing: "-1px",
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
                        borderRadius: "18px",
                        bgcolor: "rgba(248,250,252,0.82)",
                        border: "1px solid #eef2f7",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.95), 0 10px 24px rgba(15,23,42,0.035)",
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
                        <Typography color="#344054" fontWeight={700}>
                          {plan.duration_days} days validity
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1.2} alignItems="center">
                        <CheckCircleIcon
                          sx={{ color: "#059669", fontSize: 20 }}
                        />
                        <Typography color="#344054" fontWeight={700}>
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
                        borderRadius: "15px",
                        fontWeight: 850,
                        textTransform: "none",
                        bgcolor: featured ? "#065f46" : "#ffffff",
                        color: featured ? "#ffffff" : "#065f46",
                        borderColor: "#bbf7d0",
                        boxShadow: featured
                          ? "0 14px 28px rgba(6,95,70,0.22), inset 0 1px 0 rgba(255,255,255,0.24)"
                          : "0 10px 22px rgba(15,23,42,0.05)",
                        "&:hover": {
                          bgcolor: featured ? "#047857" : "#ecfdf5",
                          borderColor: "#059669",
                          boxShadow: featured
                            ? "0 18px 36px rgba(6,95,70,0.26), inset 0 1px 0 rgba(255,255,255,0.24)"
                            : "0 12px 26px rgba(15,23,42,0.07)",
                          transform: "translateY(-1px)",
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
              border: "1px dashed #d0d5dd",
              borderRadius: "28px",
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 24px 54px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ py: 7, textAlign: "center" }}>
              <Typography fontWeight={850} color="#1f2937">
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
