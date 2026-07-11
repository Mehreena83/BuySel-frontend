import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";

import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Dashboard() {
  const location = useLocation();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [recentProperties, setRecentProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subscriptionResponse, propertiesResponse] =
          await Promise.allSettled([
            axiosInstance.get("/plans/my-subscription/"),
            axiosInstance.get("/properties/my-properties/"),
          ]);

        if (subscriptionResponse.status === "fulfilled") {
          setSubscription(subscriptionResponse.value.data);
        } else {
          console.log(subscriptionResponse.reason?.response?.data);
        }

        if (propertiesResponse.status === "fulfilled") {
          const properties = Array.isArray(propertiesResponse.value.data)
            ? propertiesResponse.value.data
            : [];
          setRecentProperties(properties.slice(0, 3));
        } else {
          console.log(propertiesResponse.reason?.response?.data);
        }
      } finally {
        setSubscriptionLoading(false);
        setPropertiesLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentPlan =
    subscription?.plan_name || subscription?.current_plan || "No Active Plan";

  const propertyUsed = Number(subscription?.property_used ?? 0);
  const remainingLimit = Number(subscription?.remaining_limit ?? 0);
  const totalLimit = propertyUsed + remainingLimit;

  const hasActivePlan =
    Boolean(subscription) && currentPlan !== "No Active Plan";

  const usagePercentage =
    totalLimit > 0 ? Math.min((propertyUsed / totalLimit) * 100, 100) : 0;

  const formattedEndDate = subscription?.end_date
    ? new Date(subscription.end_date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const isActive = (path) => location.pathname === path;

  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: <HomeOutlinedIcon />,
    },
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      label: "Properties",
      path: "/my-properties",
      icon: <HomeWorkOutlinedIcon />,
    },
    {
      label: "Plans",
      path: "/plans",
      icon: <WorkspacePremiumOutlinedIcon />,
    },
    {
      label: "Orders",
      path: "/payment-history",
      icon: <ReceiptLongOutlinedIcon />,
    },
    {
      label: "Inquiries",
      path: "/my-inquiries",
      icon: <MailOutlineOutlinedIcon />,
    },
  ];

  const statCards = [
    {
      title: "Current Plan",
      value: subscriptionLoading ? "Loading..." : currentPlan,
      subtitle: hasActivePlan
        ? `Valid until ${formattedEndDate}`
        : "Choose a plan to start listing",
      icon: <WorkspacePremiumOutlinedIcon />,
      accent: "#0f766e",
      soft: "#ecfdf5",
    },
    {
      title: "Properties Added",
      value: subscriptionLoading ? "Loading..." : propertyUsed,
      subtitle: "Total submitted properties",
      icon: <HomeWorkOutlinedIcon />,
      accent: "#0f766e",
      soft: "#ecfdf5",
    },
    {
      title: "Remaining Limit",
      value: subscriptionLoading ? "Loading..." : remainingLimit,
      subtitle: hasActivePlan
        ? "Available property slots"
        : "Available after plan activation",
      icon: <AddHomeOutlinedIcon />,
      accent: "#0f766e",
      soft: "#ecfdf5",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const getStatusStyle = (property) => {
    if (property.is_expired) {
      return {
        label: "Expired",
        bgcolor: "#fef2f2",
        color: "#b91c1c",
        icon: <CancelOutlinedIcon sx={{ fontSize: 15 }} />,
      };
    }

    if (property.status === "approved") {
      return {
        label: "Approved",
        bgcolor: "#ecfdf3",
        color: "#047857",
        icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 15 }} />,
      };
    }

    if (property.status === "rejected") {
      return {
        label: "Rejected",
        bgcolor: "#fef2f2",
        color: "#b91c1c",
        icon: <CancelOutlinedIcon sx={{ fontSize: 15 }} />,
      };
    }

    return {
      label: "Pending",
      bgcolor: "#fffbeb",
      color: "#b45309",
      icon: <ScheduleRoundedIcon sx={{ fontSize: 15 }} />,
    };
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb", color: "#101828" }}>
      <Box
        component="header"
        sx={{
          bgcolor: "rgba(255,255,255,0.94)",
          borderBottom: "1px solid #eaecf0",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(14px)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 76,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                fontSize: { xs: 25, md: 29 },
                fontWeight: 900,
                color: "#101828",
                letterSpacing: "-1px",
              }}
            >
              Buy
              <Box component="span" sx={{ color: "#0f766e" }}>
                Sel
              </Box>
            </Typography>

            <Stack
              direction="row"
              spacing={2.1}
              sx={{
                ml: { md: 4 },
                display: { xs: "none", lg: "flex" },
                alignItems: "center",
                height: "100%",
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={navButtonStyle(isActive(item.path))}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <Stack
                direction="row"
                spacing={1.1}
                alignItems="center"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#0f766e",
                    width: 40,
                    height: 40,
                    fontWeight: 800,
                    fontSize: 15,
                  }}
                >
                  {user?.username?.charAt(0)?.toUpperCase() || "A"}
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#101828",
                      lineHeight: 1.2,
                    }}
                  >
                    {user?.username || "Agent"}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.2,
                      fontSize: 12,
                      color: "#667085",
                      lineHeight: 1.2,
                    }}
                  >
                    Property Agent
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#ff0000",
                  borderColor: "#d0d5dd",
                  px: 1.8,
                  display: { xs: "none", md: "inline-flex" },
                  "&:hover": {
                    bgcolor: "#f9fafb",
                    borderColor: "#98a2b3",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1.5}
          sx={{
            mb: 3,
            pl: { xs: 1, md: 3 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 27, md: 34 },
                fontWeight: 900,
                color: "#101828",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#667085",
                fontSize: { xs: 14, md: 15 },
              }}
            >
              Welcome back, {user?.username || "Agent"}. Here is your property
              business overview.
            </Typography>
          </Box>

          <Chip
            label={today}
            sx={{
              ml: { sm: "auto" },
              alignSelf: { xs: "flex-start", sm: "center" },
              bgcolor: "#ffffff",
              color: "#475467",
              border: "1px solid #eaecf0",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          />
        </Stack>

        <Card
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "22px", md: "28px" },
            border: "1px solid rgba(255,255,255,0.12)",
            bgcolor: "#064e3b",
            boxShadow: "0 24px 70px rgba(6, 78, 59, 0.16)",
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 260,
              height: 260,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.06)",
              top: -110,
              right: -40,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 170,
              height: 170,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.04)",
              bottom: -90,
              left: "42%",
            }}
          />

          <CardContent
            sx={{
              position: "relative",
              zIndex: 1,
              p: { xs: 2.6, md: 4 },
              "&:last-child": { pb: { xs: 2.6, md: 4 } },
            }}
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", lg: "center" }}
              gap={{ xs: 3, lg: 5 }}
              sx={{ width: "100%" }}
            >
              {/* <Box sx={{ maxWidth: 680 }}> */}
              <Box
                sx={{
                  maxWidth: 720,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <Chip
                  icon={<BoltRoundedIcon />}
                  label="Agent Workspace"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    color: "#d1fae5",
                    border: "1px solid rgba(255,255,255,0.14)",
                    fontWeight: 700,
                    mb: 1.8,
                    "& .MuiChip-icon": {
                      color: "#d1fae5",
                    },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: 28, md: 41 },
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-1.2px",
                    lineHeight: 1.08,
                  }}
                >
                  Manage listings with clarity and confidence.
                </Typography>

                <Typography
                  sx={{
                    mt: 1.5,
                    color: "#d1fae5",
                    fontSize: { xs: 14, md: 15.5 },
                    lineHeight: 1.7,
                    maxWidth: 610,
                  }}
                >
                  Track your active plan, property usage, recent listings and
                  inquiries from one simple workspace.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    component={Link}
                    to="/add-property"
                    disabled={!hasActivePlan}
                    variant="contained"
                    startIcon={<AddCircleOutlineOutlinedIcon />}
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#047857",
                      px: 2.6,
                      py: 1.15,
                      borderRadius: "12px",
                      fontWeight: 800,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#ecfdf5",
                        boxShadow: "none",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "rgba(255,255,255,0.45)",
                      },
                    }}
                  >
                    Add Property
                  </Button>

                  <Button
                    component={Link}
                    to="/plans"
                    variant="outlined"
                    endIcon={<ArrowForwardRoundedIcon />}
                    sx={{
                      color: "#ffffff",
                      borderColor: "rgba(255,255,255,0.35)",
                      px: 2.5,
                      py: 1.15,
                      borderRadius: "12px",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#ffffff",
                        bgcolor: "rgba(255,255,255,0.08)",
                      },
                    }}
                  >
                    {hasActivePlan ? "Change Plan" : "Choose Plan"}
                  </Button>
                </Stack>
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", lg: 430 },
                  minHeight: 230,
                  p: { xs: 2.3, md: 2.8 },
                  borderRadius: "22px",
                  bgcolor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(12px)",
                  ml: { lg: "auto" },
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "stretch",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#d1fae5",
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}
                    >
                      Listing Usage
                    </Typography>

                    <Typography
                      sx={{
                        mt: 1,
                        color: "#ffffff",
                        fontSize: { xs: 31, md: 36 },
                        fontWeight: 900,
                        letterSpacing: "-0.8px",
                        lineHeight: 1,
                      }}
                    >
                      {subscriptionLoading
                        ? "..."
                        : `${propertyUsed} / ${totalLimit || 0}`}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      bgcolor: "rgba(255,255,255,0.14)",
                      display: "grid",
                      placeItems: "center",
                      color: "#ffffff",
                      flexShrink: 0,
                      "& svg": {
                        fontSize: 28,
                      },
                    }}
                  >
                    <HomeWorkOutlinedIcon />
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={usagePercentage}
                  sx={{
                    width: "100%",
                    mt: 3,
                    height: 9,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.18)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#ffffff",
                      borderRadius: 99,
                    },
                  }}
                />

                <Box
                  sx={{
                    width: "100%",
                    mt: 1.4,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#d1fae5",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  >
                    Used {propertyUsed}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#d1fae5",
                      fontSize: 13,
                      fontWeight: 500,
                      textAlign: "right",
                    }}
                  >
                    Remaining {remainingLimit}
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: { xs: "grid", lg: "none" },
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.2,
            mb: 3,
          }}
        >
          <Button
            component={Link}
            to="/my-properties"
            startIcon={<HomeWorkOutlinedIcon />}
            sx={mobileMenuStyle}
          >
            Properties
          </Button>

          <Button
            component={Link}
            to="/add-property"
            disabled={!hasActivePlan}
            startIcon={<AddCircleOutlineOutlinedIcon />}
            sx={mobileMenuStyle}
          >
            Add Property
          </Button>

          <Button
            component={Link}
            to="/plans"
            startIcon={<WorkspacePremiumOutlinedIcon />}
            sx={mobileMenuStyle}
          >
            Plans
          </Button>

          <Button
            component={Link}
            to="/my-inquiries"
            startIcon={<MailOutlineOutlinedIcon />}
            sx={mobileMenuStyle}
          >
            Inquiries
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          {statCards.map((card) => (
            <Card
              key={card.title}
              elevation={0}
              sx={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid #eaecf0",
                borderRadius: "20px",
                bgcolor: "#ffffff",
                minHeight: 165,
                height: "100%",
                transition: "0.2s ease",
                "&:hover": {
                  borderColor: "#b7d9d2",
                  boxShadow: "0 12px 30px rgba(16,24,40,0.06)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  bgcolor: card.accent,
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2.4, md: 2.6 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:last-child": { pb: { xs: 2.4, md: 2.6 } },
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  gap={2}
                  sx={{ mb: 1.6 }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        color: "#475467",
                        fontSize: 14,
                        fontWeight: 700,
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: { xs: 25, md: 28 },
                        fontWeight: 850,
                        color: "#101828",
                        letterSpacing: "-0.5px",
                        lineHeight: 1.05,
                        textTransform:
                          card.title === "Current Plan" ? "capitalize" : "none",
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: "16px",
                      bgcolor: card.soft,
                      color: card.accent,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      "& svg": {
                        fontSize: 25,
                      },
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>

                <Divider sx={{ my: 1.6 }} />

                <Typography
                  sx={{
                    color: "#475467",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                    mt: "auto",
                  }}
                >
                  {card.subtitle}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "minmax(0, 1.8fr) minmax(300px, 0.8fr)",
            },
            gap: 2,
            mt: 2,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: "1px solid #eaecf0",
              borderRadius: "20px",
              bgcolor: "#ffffff",
              overflow: "hidden",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2.3, md: 3 },
                "&:last-child": { pb: { xs: 2.3, md: 3 } },
              }}
            >
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                gap={2}
                sx={{ width: "100%" }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: "#101828",
                    }}
                  >
                    Recent Properties
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      color: "#667085",
                      fontSize: 13.5,
                    }}
                  >
                    Your latest submitted listings
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/my-properties"
                  variant="outlined"
                  size="small"
                  sx={{
                    ml: "auto",
                    alignSelf: "flex-start",
                    flexShrink: 0,
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#047857",
                    bgcolor: "#ecfdf5",
                    borderColor: "#bbf7d0",
                    borderRadius: "999px",
                    px: 2.2,
                    py: 0.8,
                    minWidth: 86,
                    "&:hover": {
                      bgcolor: "#d1fae5",
                      borderColor: "#86efac",
                    },
                  }}
                >
                  View All
                </Button>
              </Stack>

              <Divider sx={{ my: 2.3 }} />

              {propertiesLoading ? (
                <Box
                  sx={{
                    minHeight: 220,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress size={28} sx={{ color: "#0f766e" }} />
                </Box>
              ) : recentProperties.length === 0 ? (
                <EmptyBox hasActivePlan={hasActivePlan} />
              ) : (
                <Stack spacing={1.3}>
                  {recentProperties.map((property) => {
                    const status = getStatusStyle(property);

                    return (
                      <Box
                        key={property.id}
                        sx={{
                          p: { xs: 1.7, sm: 2 },
                          border: "1px solid #eaecf0",
                          borderRadius: "16px",
                          bgcolor: "#ffffff",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                          transition:
                            "border-color .2s ease, box-shadow .2s ease, transform .2s ease",
                          "&:hover": {
                            borderColor: "#b7d9d2",
                            boxShadow: "0 10px 28px rgba(16,24,40,0.06)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "14px",
                              bgcolor: "#ecfdf5",
                              color: "#0f766e",
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <HomeWorkOutlinedIcon />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#101828",
                                fontSize: 15,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.title}
                            </Typography>

                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={{ xs: 0.3, sm: 1.1 }}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              sx={{ mt: 0.6, color: "#667085" }}
                            >
                              <Stack
                                direction="row"
                                spacing={0.45}
                                alignItems="center"
                              >
                                <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />

                                <Typography sx={{ fontSize: 13.2 }}>
                                  {property.location || "Location unavailable"}
                                </Typography>
                              </Stack>

                              <Typography
                                sx={{
                                  fontSize: 13.2,
                                  fontWeight: 700,
                                  color: "#344054",
                                }}
                              >
                                ₹
                                {Number(property.price || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </Typography>
                            </Stack>
                          </Box>
                        </Stack>

                        <Chip
                          icon={status.icon}
                          label={status.label}
                          size="small"
                          sx={{
                            bgcolor: status.bgcolor,
                            color: status.color,
                            fontWeight: 700,
                            borderRadius: "15px",
                            flexShrink: 0,
                            "& .MuiChip-icon": {
                              color: status.color,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: "1px solid #eaecf0",
              borderRadius: "20px",
              bgcolor: "#ffffff",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2.3, md: 3 },
                "&:last-child": { pb: { xs: 2.3, md: 3 } },
              }}
            >
              <Typography
                sx={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: "#101828",
                }}
              >
                Quick Actions
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  color: "#667085",
                  fontSize: 13.5,
                }}
              >
                Common agent shortcuts
              </Typography>

              <Stack spacing={1.2} sx={{ mt: 2.4 }}>
                <ActionButton
                  to="/plans"
                  icon={<WorkspacePremiumOutlinedIcon />}
                  label={hasActivePlan ? "Change Plan" : "View Plans"}
                  primary
                />

                <ActionButton
                  to="/add-property"
                  icon={<AddCircleOutlineOutlinedIcon />}
                  label="Add New Property"
                  disabled={!hasActivePlan}
                />

                <ActionButton
                  to="/my-properties"
                  icon={<HomeWorkOutlinedIcon />}
                  label="Manage Properties"
                />

                <ActionButton
                  to="/my-inquiries"
                  icon={<MailOutlineOutlinedIcon />}
                  label="View Inquiries"
                />

                <ActionButton
                  to="/payment-history"
                  icon={<ReceiptLongOutlinedIcon />}
                  label="Payment History"
                />

                <Button
                  variant="outlined"
                  startIcon={<LogoutOutlinedIcon />}
                  onClick={handleLogout}
                  fullWidth
                  sx={{
                    py: 1.2,
                    borderRadius: "12px",
                    fontWeight: 700,
                    textTransform: "none",
                    color: "#b42318",
                    borderColor: "#fecdca",
                    bgcolor: "#ffffff",
                    display: { xs: "flex", md: "none" },
                    "&:hover": {
                      bgcolor: "#fef3f2",
                      borderColor: "#fda29b",
                    },
                  }}
                >
                  Logout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

function ActionButton({ to, icon, label, disabled = false, primary = false }) {
  return (
    <Button
      component={Link}
      to={to}
      disabled={disabled}
      fullWidth
      startIcon={icon}
      endIcon={<ArrowForwardRoundedIcon />}
      sx={{
        justifyContent: "flex-start",
        py: 1.25,
        px: 1.6,
        borderRadius: "12px",
        textTransform: "none",
        fontWeight: 700,
        color: primary ? "#ffffff" : "#344054",
        bgcolor: primary ? "#0f766e" : "#f9fafb",
        border: primary ? "1px solid #0f766e" : "1px solid #eaecf0",
        boxShadow: "none",
        "& .MuiButton-endIcon": { ml: "auto" },
        "&:hover": {
          bgcolor: primary ? "#0b625d" : "#f2f4f7",
          borderColor: primary ? "#0b625d" : "#d0d5dd",
          boxShadow: "none",
        },
        "&.Mui-disabled": {
          bgcolor: "#f2f4f7",
          color: "#98a2b3",
          borderColor: "#eaecf0",
        },
      }}
    >
      {label}
    </Button>
  );
}

const navButtonStyle = (active) => ({
  color: active ? "#0f766e" : "#475467",
  bgcolor: "transparent",
  borderRadius: 0,
  px: 0,
  py: 2.35,
  fontWeight: active ? 800 : 600,
  fontSize: 14,
  textTransform: "none",
  minWidth: "auto",
  position: "relative",
  transition: "0.2s ease",

  "& .MuiButton-startIcon": {
    mr: 0.65,
    color: active ? "#0f766e" : "#475467",
  },

  "& .MuiSvgIcon-root": {
    fontSize: 19,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: 8,
    width: active ? "30px" : "0px",
    height: "3px",
    borderRadius: "999px",
    bgcolor: "#0f766e",
    transform: "translateX(-50%)",
    transition: "0.2s ease",
  },

  "&:hover": {
    bgcolor: "transparent",
    color: "#0f766e",
  },

  "&:hover .MuiButton-startIcon": {
    color: "#0f766e",
  },

  "&:hover::after": {
    width: "30px",
  },
});

const mobileMenuStyle = {
  bgcolor: "#ffffff",
  border: "1px solid #eaecf0",
  borderRadius: "12px",
  color: "#344054",
  py: 1.15,
  px: 1.1,
  fontWeight: 700,
  fontSize: 13,
  textTransform: "none",
  "&:hover": {
    bgcolor: "#ecfdf5",
    color: "#0f766e",
    borderColor: "#b7d9d2",
  },
  "&.Mui-disabled": {
    bgcolor: "#f2f4f7",
    color: "#98a2b3",
  },
};

const EmptyBox = ({ hasActivePlan }) => (
  <Box
    sx={{
      py: { xs: 4.5, md: 5.5 },
      px: 2,
      textAlign: "center",
      bgcolor: "#f9fafb",
      borderRadius: "16px",
      border: "1px dashed #d0d5dd",
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        mx: "auto",
        borderRadius: "16px",
        bgcolor: "#ecfdf5",
        color: "#0f766e",
        display: "grid",
        placeItems: "center",
      }}
    >
      <HomeWorkOutlinedIcon sx={{ fontSize: 28 }} />
    </Box>

    <Typography
      sx={{
        mt: 1.7,
        fontWeight: 800,
        color: "#344054",
        fontSize: 16,
      }}
    >
      No properties yet
    </Typography>

    <Typography
      sx={{
        color: "#667085",
        fontSize: 13.5,
        mt: 0.6,
        maxWidth: 340,
        mx: "auto",
      }}
    >
      {hasActivePlan
        ? "Add your first property and start managing your listings."
        : "Choose a plan first, then add your first property listing."}
    </Typography>

    <Button
      component={Link}
      to={hasActivePlan ? "/add-property" : "/plans"}
      variant="contained"
      sx={{
        mt: 2,
        bgcolor: "#0f766e",
        borderRadius: "11px",
        px: 2.2,
        py: 1,
        fontWeight: 700,
        textTransform: "none",
        boxShadow: "none",
        "&:hover": {
          bgcolor: "#0b625d",
          boxShadow: "none",
        },
      }}
    >
      {hasActivePlan ? "Add Property" : "Choose Plan"}
    </Button>
  </Box>
);

export default Dashboard;
