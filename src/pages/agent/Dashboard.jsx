import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
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
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [recentProperties, setRecentProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await axiosInstance.get("/plans/my-subscription/");
        setSubscription(response.data);
      } catch (err) {
        console.log(err.response?.data);
      } finally {
        setSubscriptionLoading(false);
      }
    };

    const fetchRecentProperties = async () => {
      try {
        const response = await axiosInstance.get("/properties/my-properties/");
        setRecentProperties(response.data.slice(0, 3));
      } catch (err) {
        console.log(err.response?.data);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchSubscription();
    fetchRecentProperties();
  }, []);

  const currentPlan =
    subscription?.plan_name || subscription?.current_plan || "No Active Plan";

  const propertyUsed = subscription?.property_used ?? 0;
  const remainingLimit = subscription?.remaining_limit ?? 0;
  const hasActivePlan = currentPlan !== "No Active Plan";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const statCards = [
    {
      title: "Current Plan",
      value: subscriptionLoading ? "Loading..." : currentPlan,
      subtitle: hasActivePlan
        ? `Valid until ${subscription?.end_date || "N/A"}`
        : "Choose a plan to start listing",
      icon: <WorkspacePremiumOutlinedIcon />,
    },
    {
      title: "Properties Added",
      value: subscriptionLoading ? "Loading..." : propertyUsed,
      subtitle: "Total submitted properties",
      icon: <HomeWorkOutlinedIcon />,
    },
    {
      title: "Remaining Limit",
      value: subscriptionLoading ? "Loading..." : remainingLimit,
      subtitle: hasActivePlan
        ? "Available listing limit"
        : "Available after plan activation",
      icon: <AddHomeOutlinedIcon />,
    },
  ];

  const getStatusStyle = (property) => {
    if (property.is_expired) {
      return { label: "Expired", bgcolor: "#fee2e2", color: "#991b1b" };
    }

    if (property.status === "approved") {
      return { label: "Approved", bgcolor: "#dcfce7", color: "#166534" };
    }

    if (property.status === "rejected") {
      return { label: "Rejected", bgcolor: "#fee2e2", color: "#991b1b" };
    }

    return { label: "Pending", bgcolor: "#fef3c7", color: "#92400e" };
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 20,
          boxShadow: "0 4px 16px rgba(15, 23, 42, 0.04)",
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
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.6px",
              }}
            >
              Buy<span style={{ color: "#059669" }}>Sel</span>
            </Typography>

            <Stack
              direction="row"
              spacing={1.2}
              sx={{
                ml: { md: 4 },
                display: { xs: "none", md: "flex" },
                alignItems: "center",
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
              <Avatar
                sx={{
                  bgcolor: "#065f46",
                  width: 38,
                  height: 38,
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                {user?.username?.charAt(0).toUpperCase() || "A"}
              </Avatar>

              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: { xs: 26, md: 34 },
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.6px",
            }}
          >
            Dashboard
          </Typography>

          <Typography sx={{ mt: 0.6, color: "#667085", fontSize: 15 }}>
            Welcome back, {user?.username || "Agent"}. Manage your listings,
            plans and inquiries from one place.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            mb: 3,
            overflow: "hidden",
            border: "1px solid #d1fae5",
            bgcolor: "#ffffff",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: { xs: 2.5, md: 3.5 },
                background:
                  "linear-gradient(135deg, #064e3b 0%, #065f46 55%, #047857 100%)",
                color: "#ffffff",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                gap: 2.5,
              }}
            >
              <Box>
                <Chip
                  label="Agent Workspace"
                  size="small"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.13)",
                    color: "#d1fae5",
                    border: "1px solid rgba(255,255,255,0.18)",
                    fontWeight: 600,
                    mb: 1.6,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: { xs: 28, md: 36 },
                    fontWeight: 800,
                    letterSpacing: "-0.7px",
                  }}
                >
                  Manage Your Property Listings
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                    color: "#d1fae5",
                    fontSize: 15,
                    maxWidth: 620,
                    lineHeight: 1.7,
                  }}
                >
                  Track your current plan, submitted properties, remaining
                  limits and recent listing activity.
                </Typography>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                <Button
                  component={Link}
                  to="/plans"
                  variant="contained"
                  sx={{
                    bgcolor: "#ffffff",
                    color: "#065f46",
                    px: 2.8,
                    py: 1.1,
                    borderRadius: 2,
                    fontWeight: 700,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#ecfdf5",
                      boxShadow: "none",
                    },
                  }}
                >
                  {hasActivePlan ? "Change Plan" : "Choose Plan"}
                </Button>

                <Button
                  component={Link}
                  to="/add-property"
                  disabled={!hasActivePlan}
                  variant="outlined"
                  startIcon={<AddCircleOutlineOutlinedIcon />}
                  sx={{
                    color: "#ffffff",
                    borderColor: "rgba(255,255,255,0.45)",
                    px: 2.5,
                    py: 1.1,
                    borderRadius: 2,
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#ffffff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(255,255,255,0.45)",
                      borderColor: "rgba(255,255,255,0.25)",
                    },
                  }}
                >
                  Add Property
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: { xs: "grid", md: "none" },
            gridTemplateColumns: "1fr 1fr",
            gap: 1.2,
            mb: 3,
          }}
        >
          <Button component={Link} to="/my-properties" sx={mobileMenuStyle}>
            My Properties
          </Button>

          <Button
            component={Link}
            to="/add-property"
            disabled={!hasActivePlan}
            sx={mobileMenuStyle}
          >
            Add Property
          </Button>

          <Button component={Link} to="/plans" sx={mobileMenuStyle}>
            Plans
          </Button>
          <Button component={Link} to="/payment-history" sx={mobileMenuStyle}>
            Order History
          </Button>

          <Button component={Link} to="/my-inquiries" sx={mobileMenuStyle}>
            Inquiries
          </Button>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              lg: "repeat(3, 1fr)",
            },
            gap: 2.8,
          }}
        >
          {statCards.map((card) => (
            <Card
              key={card.title}
              elevation={0}
              sx={{
                border: "1px solid #e5e7eb",
                borderRadius: 4,
                bgcolor: "#ffffff",
                minHeight: 195,
                transition: "0.2s ease",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 2.8, md: 3.2 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    bgcolor: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.4,
                    "& svg": {
                      fontSize: 23,
                    },
                  }}
                >
                  {card.icon}
                </Box>

                <Typography
                  sx={{
                    color: "#475467",
                    fontSize: 15,
                    fontWeight: 500,
                  }}
                >
                  {card.title}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.1,
                    fontSize: { xs: 25, md: 28 },
                    fontWeight: 800,
                    color: "#111827",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.15,
                  }}
                >
                  {card.value}
                </Typography>

                <Typography
                  sx={{
                    mt: 1.4,
                    color: "#475467",
                    fontSize: 14,
                    lineHeight: 1.5,
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
            gridTemplateColumns: { xs: "1fr", lg: "2fr 0.9fr" },
            gap: 2.2,
            mt: 2.2,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: { xs: 2.4, md: 3 } }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                sx={{ width: "100%" }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{ fontSize: 19, fontWeight: 700, color: "#111827" }}
                  >
                    Recent Properties
                  </Typography>

                  <Typography sx={{ mt: 0.3, color: "#667085", fontSize: 13 }}>
                    Latest submitted property listings
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

              <Divider sx={{ my: 2.2 }} />

              {propertiesLoading ? (
                <EmptyBox title="Loading properties..." />
              ) : recentProperties.length === 0 ? (
                <EmptyBox
                  title="No properties found"
                  subtitle="Your added properties will appear here."
                />
              ) : (
                <Stack spacing={1.4}>
                  {recentProperties.map((property) => {
                    const status = getStatusStyle(property);

                    return (
                      <Box
                        key={property.id}
                        sx={{
                          p: 2,
                          border: "1px solid #e5e7eb",
                          borderRadius: 2.5,
                          bgcolor: "#f8fafc",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: { xs: "flex-start", sm: "center" },
                          gap: 2,
                          flexDirection: { xs: "column", sm: "row" },
                          "&:hover": {
                            bgcolor: "#f8fafc",
                            borderColor: "#d0d5dd",
                          },
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: "#111827",
                              fontSize: 15,
                            }}
                          >
                            {property.title}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={0.6}
                            alignItems="center"
                            sx={{ mt: 0.6, color: "#667085" }}
                          >
                            <LocationOnOutlinedIcon sx={{ fontSize: 17 }} />
                            <Typography sx={{ fontSize: 13.5 }}>
                              {property.location} • ₹
                              {Number(property.price).toLocaleString("en-IN")}
                            </Typography>
                          </Stack>
                        </Box>

                        <Box
                          sx={{
                            px: 1.4,
                            py: 0.55,
                            borderRadius: 999,
                            bgcolor: status.bgcolor,
                            color: status.color,
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: "capitalize",
                            flexShrink: 0,
                          }}
                        >
                          {status.label}
                        </Box>
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
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: { xs: 2.4, md: 3 } }}>
              <Typography
                sx={{ fontSize: 19, fontWeight: 700, color: "#111827" }}
              >
                Quick Actions
              </Typography>

              <Typography sx={{ mt: 0.4, color: "#667085", fontSize: 13 }}>
                Shortcuts for agent activity
              </Typography>

              <Stack spacing={1.4} sx={{ mt: 2.5 }}>
                <Button
                  component={Link}
                  to="/plans"
                  variant="contained"
                  fullWidth
                  sx={actionPrimaryStyle}
                >
                  View Plans
                </Button>
                <Button
                  component={Link}
                  to="/payment-history"
                  variant="outlined"
                  fullWidth
                  sx={actionOutlineStyle}
                >
                  Plan Order History
                </Button>

                <Button
                  component={Link}
                  to="/add-property"
                  variant="outlined"
                  disabled={!hasActivePlan}
                  fullWidth
                  sx={actionOutlineStyle}
                >
                  Add Property
                </Button>

                <Button
                  component={Link}
                  to="/my-properties"
                  variant="outlined"
                  fullWidth
                  sx={actionOutlineStyle}
                >
                  Manage Properties
                </Button>

                <Button
                  component={Link}
                  to="/my-inquiries"
                  variant="outlined"
                  fullWidth
                  sx={actionOutlineStyle}
                >
                  View Inquiries
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<LogoutOutlinedIcon />}
                  onClick={handleLogout}
                  fullWidth
                  sx={{
                    py: 1.15,
                    borderRadius: 2,
                    fontWeight: 500,
                    textTransform: "none",
                    display: { xs: "flex", sm: "none" },
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

const navButtonStyle = (active) => ({
  color: active ? "#065f46" : "#475467",
  border: "1px solid transparent",
  borderRadius: 0,
  px: 0.4,
  py: 2.6,
  mx: 0.7,
  fontWeight: active ? 700 : 500,
  fontSize: 14,
  textTransform: "none",
  position: "relative",
  bgcolor: "transparent",
  minWidth: "auto",
  "& .MuiButton-startIcon": {
    mr: 0.6,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 18,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    left: "50%",
    bottom: 12,
    width: active ? "24px" : "0px",
    height: "2.5px",
    borderRadius: "999px",
    bgcolor: "#059669",
    transform: "translateX(-50%)",
    transition: "0.2s ease",
  },
  "&:hover": {
    bgcolor: "transparent",
    color: "#065f46",
  },
  "&:hover::after": {
    width: "24px",
  },
});

const mobileMenuStyle = {
  bgcolor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 2,
  color: "#344054",
  py: 1.1,
  fontWeight: 500,
  textTransform: "none",
  "&:hover": {
    bgcolor: "#ecfdf5",
    color: "#047857",
    borderColor: "#bbf7d0",
  },
};

const actionPrimaryStyle = {
  py: 1.15,
  bgcolor: "#065f46",
  borderRadius: 2,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#047857",
    boxShadow: "none",
  },
};

const actionOutlineStyle = {
  py: 1.15,
  borderRadius: 2,
  fontWeight: 500,
  textTransform: "none",
  borderColor: "#d0d5dd",
  color: "#344054",
  "&:hover": {
    borderColor: "#059669",
    bgcolor: "#ecfdf5",
    color: "#047857",
  },
};

const EmptyBox = ({ title, subtitle }) => (
  <Box
    sx={{
      py: { xs: 4.5, md: 5.5 },
      px: 2,
      textAlign: "center",
      bgcolor: "#f8fafc",
      borderRadius: 3,
      border: "1px dashed #cbd5e1",
    }}
  >
    <Typography sx={{ fontWeight: 600, color: "#475467" }}>{title}</Typography>

    {subtitle && (
      <Typography sx={{ color: "#667085", fontSize: 14, mt: 0.5 }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default Dashboard;
