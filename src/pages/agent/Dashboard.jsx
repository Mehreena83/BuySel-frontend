import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

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

  const sidebarButtonStyle = {
    justifyContent: "flex-start",
    color: "#475467",
    py: 1.15,
    px: 1.4,
    borderRadius: 2,
    fontWeight: 500,
    fontSize: 14,
    textTransform: "none",
    "&:hover": {
      bgcolor: "#f8fafc",
      color: "#065f46",
    },
  };

  const menuOutlineStyle = {
    textTransform: "none",
    fontWeight: 500,
    borderRadius: 2,
    color: "#047857",
    borderColor: "#bbf7d0",
    bgcolor: "#ffffff",
    "&:hover": {
      bgcolor: "#ecfdf5",
      borderColor: "#86efac",
    },
  };

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", display: "flex" }}>
      <Box
        sx={{
          width: 252,
          bgcolor: "#ffffff",
          borderRight: "1px solid #e5e7eb",
          minHeight: "100vh",
          p: 3,
          display: { xs: "none", md: "block" },
          position: "sticky",
          top: 0,
        }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            fontSize: 25,
            fontWeight: 700,
            color: "#1f2937",
            letterSpacing: "-0.4px",
          }}
        >
          Buy<span style={{ color: "#059669" }}>Sel</span>
        </Typography>

        <Typography sx={{ mt: 0.8, color: "#98a2b3", fontSize: 13 }}>
          Agent Panel
        </Typography>

        <Stack spacing={0.8} sx={{ mt: 4 }}>
          <Button
            component={Link}
            to="/"
            variant="outlined"
            sx={menuOutlineStyle}
          >
            Home
          </Button>

          <Button
            startIcon={<DashboardOutlinedIcon />}
            sx={{
              ...sidebarButtonStyle,
              bgcolor: "#ecfdf5",
              color: "#047857",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#d1fae5",
                color: "#047857",
              },
            }}
          >
            Dashboard
          </Button>

          <Button component={Link} to="/my-properties" sx={sidebarButtonStyle}>
            My Properties
          </Button>

          <Button
            component={Link}
            to="/add-property"
            disabled={!hasActivePlan}
            sx={sidebarButtonStyle}
          >
            Add Property
          </Button>

          <Button component={Link} to="/plans" sx={sidebarButtonStyle}>
            Plans
          </Button>

          <Button component={Link} to="/my-inquiries" sx={sidebarButtonStyle}>
            Inquiries
          </Button>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            minHeight: 74,
            bgcolor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            px: { xs: 2, sm: 3, md: 5 },
            py: { xs: 1.5, sm: 0 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 22, md: 25 },
                fontWeight: 700,
                color: "#1f2937",
                letterSpacing: "-0.3px",
              }}
            >
              Dashboard
            </Typography>

            <Typography sx={{ color: "#667085", fontSize: 14, mt: 0.2 }}>
              Welcome back, {user?.username || "Agent"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#065f46",
                width: 40,
                height: 40,
                fontWeight: 600,
                fontSize: 16,
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

        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 } }}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid #bbf7d0",
              borderRadius: 3,
              mb: 3,
              bgcolor: "#ecfdf5",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: { xs: "flex-start", md: "center" },
                  justifyContent: "space-between",
                  gap: 2.5,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: 24, md: 30 },
                      fontWeight: 700,
                      color: "#14532d",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    Manage Your Listings
                  </Typography>

                  <Typography sx={{ mt: 1, color: "#047857", fontSize: 14.5 }}>
                    Track your plan, property listings and remaining limits.
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to="/plans"
                  variant="contained"
                  sx={{
                    bgcolor: "#065f46",
                    color: "#fff",
                    fontWeight: 600,
                    px: 2.8,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#047857",
                      boxShadow: "none",
                    },
                  }}
                >
                  {hasActivePlan ? "Change Plan" : "Choose Plan"}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              display: { xs: "block", md: "none" },
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              mb: 3,
              bgcolor: "#ffffff",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Typography sx={{ fontWeight: 600, color: "#1f2937", mb: 1.5 }}>
                Agent Menu
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.2,
                }}
              >
                <Button
                  component={Link}
                  to="/my-properties"
                  variant="outlined"
                  sx={menuOutlineStyle}
                >
                  My Properties
                </Button>

                <Button
                  component={Link}
                  to="/add-property"
                  variant="outlined"
                  disabled={!hasActivePlan}
                  sx={menuOutlineStyle}
                >
                  Add Property
                </Button>

                <Button
                  component={Link}
                  to="/plans"
                  variant="outlined"
                  sx={menuOutlineStyle}
                >
                  Plans
                </Button>

                <Button
                  component={Link}
                  to="/my-inquiries"
                  variant="outlined"
                  sx={menuOutlineStyle}
                >
                  Inquiries
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "repeat(3, 1fr)",
              },
              gap: 2.5,
            }}
          >
            {statCards.map((card) => (
              <Card
                key={card.title}
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: "#d0d5dd",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.7 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: 2,
                      bgcolor: "#f0fdf4",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography
                    sx={{ color: "#667085", fontSize: 14, fontWeight: 500 }}
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.8,
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#1f2937",
                    }}
                  >
                    {card.value}
                  </Typography>

                  <Typography sx={{ mt: 1, color: "#667085", fontSize: 13 }}>
                    {card.subtitle}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
              gap: 2.5,
              mt: 2.5,
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
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}
                  >
                    Recent Properties
                  </Typography>

                  <Button
                    component={Link}
                    to="/my-properties"
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: "none",
                      fontWeight: 500,
                      color: "#047857",
                      bgcolor: "#ecfdf5",
                      borderColor: "#bbf7d0",
                      borderRadius: 2,
                      px: 1.8,
                      py: 0.7,
                      "&:hover": {
                        bgcolor: "#d1fae5",
                        borderColor: "#86efac",
                      },
                    }}
                  >
                    View All
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {propertiesLoading ? (
                  <EmptyBox title="Loading properties..." />
                ) : recentProperties.length === 0 ? (
                  <EmptyBox
                    title="No properties found"
                    subtitle="Your added properties will appear here."
                  />
                ) : (
                  <Stack spacing={1.5}>
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
                          }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{ fontWeight: 600, color: "#1f2937" }}
                            >
                              {property.title}
                            </Typography>

                            <Typography
                              sx={{ color: "#667085", fontSize: 14, mt: 0.4 }}
                            >
                              {property.location} • ₹
                              {Number(property.price).toLocaleString("en-IN")}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              px: 1.4,
                              py: 0.5,
                              borderRadius: 999,
                              bgcolor: status.bgcolor,
                              color: status.color,
                              fontSize: 12,
                              fontWeight: 600,
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
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography
                  sx={{ fontSize: 18, fontWeight: 700, color: "#1f2937" }}
                >
                  Quick Actions
                </Typography>

                <Stack spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    component={Link}
                    to="/plans"
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.2,
                      bgcolor: "#065f46",
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#047857",
                        boxShadow: "none",
                      },
                    }}
                  >
                    View Plans
                  </Button>

                  <Button
                    component={Link}
                    to="/add-property"
                    variant="outlined"
                    disabled={!hasActivePlan}
                    fullWidth
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      fontWeight: 500,
                      textTransform: "none",
                      borderColor: "#cbd5e1",
                      color: "#344054",
                      "&:hover": {
                        borderColor: "#059669",
                        bgcolor: "#ecfdf5",
                      },
                    }}
                  >
                    Add Property
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<LogoutOutlinedIcon />}
                    onClick={handleLogout}
                    fullWidth
                    sx={{
                      py: 1.2,
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
    </Box>
  );
}

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
