import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { Link, useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminAxiosInstance.get(
          "/admin-panel/dashboard/",
        );

        setStats(response.data);
      } catch (err) {
        console.error(err.response?.data || err.message);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin-login");
          return;
        }

        setError("Unable to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.total_users ?? 0,
      subtitle: "Registered property buyers",
      icon: <PeopleAltOutlinedIcon />,
      iconBg: "#eff8ff",
      iconColor: "#175cd3",
    },
    {
      title: "Total Agents",
      value: stats?.total_agents ?? 0,
      subtitle: "Registered property agents",
      icon: <SupportAgentOutlinedIcon />,
      iconBg: "#f4f3ff",
      iconColor: "#6938ef",
    },
    {
      title: "Total Properties",
      value: stats?.total_properties ?? 0,
      subtitle: "All submitted listings",
      icon: <HomeWorkOutlinedIcon />,
      iconBg: "#ecfdf3",
      iconColor: "#067647",
    },
    {
      title: "Pending Properties",
      value: stats?.pending_properties ?? 0,
      subtitle: "Waiting for admin approval",
      icon: <PendingActionsOutlinedIcon />,
      iconBg: "#fffaeb",
      iconColor: "#b54708",
    },
    {
      title: "Approved Properties",
      value: stats?.approved_properties ?? 0,
      subtitle: "Visible public listings",
      icon: <CheckCircleOutlineOutlinedIcon />,
      iconBg: "#ecfdf3",
      iconColor: "#067647",
    },
    {
      title: "Rejected Properties",
      value: stats?.rejected_properties ?? 0,
      subtitle: "Rejected property listings",
      icon: <CancelOutlinedIcon />,
      iconBg: "#fef3f2",
      iconColor: "#b42318",
    },
    {
      title: "Active Subscriptions",
      value: stats?.active_subscriptions ?? 0,
      subtitle: "Currently active plans",
      icon: <SubscriptionsOutlinedIcon />,
      iconBg: "#fdf4ff",
      iconColor: "#9f2c91",
    },
    {
      title: "Successful Payments",
      value: stats?.success_payments ?? 0,
      subtitle: `Out of ${stats?.total_payments ?? 0} total payments`,
      icon: <PaymentsOutlinedIcon />,
      iconBg: "#eef4ff",
      iconColor: "#3538cd",
    },
  ];

  const propertyChartData = [
    {
      name: "Pending",
      value: stats?.pending_properties ?? 0,
    },
    {
      name: "Approved",
      value: stats?.approved_properties ?? 0,
    },
    {
      name: "Rejected",
      value: stats?.rejected_properties ?? 0,
    },
  ];

  const propertyChartColors = ["#f79009", "#12b76a", "#f04438"];

  const paymentChartData = [
    {
      name: "Successful",
      value: stats?.success_payments ?? 0,
    },
    {
      name: "Failed",
      value: stats?.failed_payments ?? 0,
    },
  ];
  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 35 },
                fontWeight: 850,
                color: "#101828",
                letterSpacing: "-1px",
                lineHeight: 1.12,
              }}
            >
              Admin Dashboard
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#667085",
                fontSize: { xs: 14, md: 15 },
              }}
            >
              Monitor users, agents, properties, plans and payments.
            </Typography>
          </Box>

          <Button
            component={Link}
            to="/admin-properties"
            variant="contained"
            startIcon={<HomeWorkOutlinedIcon />}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              ml: { sm: "auto" },
              bgcolor: "#0f766e",
              borderRadius: "16px",
              textTransform: "none",
              fontWeight: 750,
              px: 2.4,
              py: 1.15,
              minWidth: 210,
              boxShadow: "0 10px 24px rgba(15, 118, 110, 0.14)",
              "&:hover": {
                bgcolor: "#0b625d",
                boxShadow: "0 12px 28px rgba(15, 118, 110, 0.16)",
              },
            }}
          >
            Manage Properties
          </Button>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "16px",
              border: "1px solid #fecdca",
              bgcolor: "#fef3f2",
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              minHeight: 350,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#0f766e" }} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(4, minmax(0, 1fr))",
                },
                gap: { xs: 1.6, md: 2 },
              }}
            >
              {statCards.map((card) => (
                <Card
                  key={card.title}
                  elevation={0}
                  sx={{
                    height: "100%",
                    minHeight: 176,
                    border: "1px solid #e5e7eb",
                    borderRadius: "22px",
                    bgcolor: "#ffffff",
                    overflow: "hidden",
                    transition: "0.22s ease",
                    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.035)",
                    "&:hover": {
                      borderColor: "#bbf7d0",
                      boxShadow: "0 14px 34px rgba(16,24,40,0.065)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2.5,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      "&:last-child": { pb: 2.5 },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      gap={2}
                    >
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            color: "#344054",
                            fontSize: 14.5,
                            fontWeight: 800,
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {card.title}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1.5,
                            fontSize: { xs: 30, md: 34 },
                            fontWeight: 850,
                            color: "#101828",
                            lineHeight: 1,
                            letterSpacing: "-0.8px",
                          }}
                        >
                          {card.value}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          width: 54,
                          height: 54,
                          borderRadius: "18px",
                          bgcolor: card.iconBg,
                          color: card.iconColor,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          "& svg": {
                            fontSize: 26,
                          },
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Stack>

                    <Typography
                      sx={{
                        mt: 2.2,
                        color: "#667085",
                        fontSize: 13.5,
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
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
                mt: 2,
              }}
            >
              <InfoCard
                title="Property Status"
                subtitle="Current approval status of all property listings."
              >
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={propertyChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={100}
                        paddingAngle={4}
                      >
                        {propertyChartData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={propertyChartColors[index]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />

                      <Legend verticalAlign="bottom" height={30} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </InfoCard>

              <InfoCard
                title="Payment Status"
                subtitle="Successful and failed platform payments."
              >
                <Box sx={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={paymentChartData}
                      margin={{
                        top: 20,
                        right: 10,
                        left: -20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />

                      <XAxis dataKey="name" tickLine={false} axisLine={false} />

                      <YAxis
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                      />

                      <Tooltip />

                      <Bar
                        dataKey="value"
                        fill="#0f766e"
                        radius={[8, 8, 0, 0]}
                        barSize={55}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </InfoCard>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "repeat(2, minmax(0, 1fr))",
                },
                gap: 2,
                mt: 2,
              }}
            >
              <InfoCard
                title="Recent Properties"
                subtitle="Latest submitted property listings."
              >
                {stats?.recent_properties?.length ? (
                  <Stack spacing={0}>
                    {stats.recent_properties.map((property, index) => (
                      <Box key={property.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                          sx={{ py: 1.4 }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#101828",
                                fontSize: 14,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {property.title || "Untitled Property"}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.4,
                                color: "#667085",
                                fontSize: 12.5,
                              }}
                            >
                              {property.location || "Location unavailable"}
                            </Typography>
                          </Box>

                          <PropertyStatusChip status={property.status} />
                        </Stack>

                        {index !== stats.recent_properties.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <EmptyMessage text="No recent properties found." />
                )}
              </InfoCard>

              <InfoCard
                title="Recent Payments"
                subtitle="Latest payment transactions."
              >
                {stats?.recent_payments?.length ? (
                  <Stack spacing={0}>
                    {stats.recent_payments.map((payment, index) => (
                      <Box key={payment.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          spacing={2}
                          sx={{ py: 1.4 }}
                        >
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                color: "#101828",
                                fontSize: 14,
                              }}
                            >
                              ₹
                              {Number(payment.amount || 0).toLocaleString(
                                "en-IN",
                              )}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.4,
                                color: "#667085",
                                fontSize: 12.5,
                              }}
                            >
  {payment.username || "Unknown user"}
  {payment.plan_name ? ` • ${payment.plan_name}` : ""}  
                              </Typography>
                          </Box>

                          {/* <Chip
                            size="small"
                            label={payment.status || "Unknown"}
                            sx={{
                              textTransform: "capitalize",
                              fontWeight: 700,
                              bgcolor:
                                payment.status === "success"
                                  ? "#ecfdf3"
                                  : "#fef3f2",
                              color:
                                payment.status === "success"
                                  ? "#067647"
                                  : "#b42318",
                            }}
                          /> */}
                      <PaymentStatusChip status={payment.status} />
                        </Stack>

                        {index !== stats.recent_payments.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <EmptyMessage text="No recent payments found." />
                )}
              </InfoCard>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

function PropertyStatusChip({ status }) {
  const styles = {
    pending: {
      bgcolor: "#fffaeb",
      color: "#b54708",
    },
    approved: {
      bgcolor: "#ecfdf3",
      color: "#067647",
    },
    rejected: {
      bgcolor: "#fef3f2",
      color: "#b42318",
    },
  };

  const currentStyle = styles[status] || styles.pending;

  return (
    <Chip
      size="small"
      label={status || "Pending"}
      sx={{
        textTransform: "capitalize",
        fontWeight: 700,
        bgcolor: currentStyle.bgcolor,
        color: currentStyle.color,
      }}
    />
  );
}

function PaymentStatusChip({ status }) {
  const normalizedStatus = (status || "").toLowerCase();

  const styles = {
    success: {
      bgcolor: "#ecfdf3",
      color: "#067647",
    },
    failed: {
      bgcolor: "#fef3f2",
      color: "#b42318",
    },
    created: {
      bgcolor: "#fffaeb",
      color: "#b54708",
    },
    pending: {
      bgcolor: "#fffaeb",
      color: "#b54708",
    },
  };

  const currentStyle = styles[normalizedStatus] || {
    bgcolor: "#f2f4f7",
    color: "#475467",
  };

  return (
    <Chip
      size="small"
      label={status || "Unknown"}
      sx={{
        textTransform: "capitalize",
        fontWeight: 700,
        bgcolor: currentStyle.bgcolor,
        color: currentStyle.color,
      }}
    />
  );
}


function EmptyMessage({ text }) {
  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center",
      }}
    >
      <Typography
        sx={{
          color: "#98a2b3",
          fontSize: 13.5,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
function InfoCard({ title, subtitle, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e5e7eb",
        borderRadius: "22px",
        bgcolor: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.035)",
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2.4, md: 3 },
          "&:last-child": {
            pb: { xs: 2.4, md: 3 },
          },
        }}
      >
        <Typography
          sx={{
            fontSize: 19,
            fontWeight: 800,
            color: "#101828",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            color: "#667085",
            fontSize: 13.5,
          }}
        >
          {subtitle}
        </Typography>

        <Stack spacing={1.3} sx={{ mt: 2.4 }}>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

function OverviewRow({ label, value, bgcolor, color }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        p: 1.45,
        bgcolor: "#f9fafb",
        border: "1px solid #eaecf0",
        borderRadius: "14px",
      }}
    >
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#344054",
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          minWidth: 44,
          px: 1.25,
          py: 0.6,
          borderRadius: "999px",
          textAlign: "center",
          bgcolor,
          color,
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {value}
      </Box>
    </Stack>
  );
}

export default AdminDashboard;
