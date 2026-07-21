import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import AdminNotificationBell from "../components/admin/AdminNotificationBell";
const SIDEBAR_WIDTH = 260;

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminUser")) || {};
    } catch {
      return {};
    }
  }, []);

  const navItems = [
    {
      label: "Dashboard",
      path: "/admin-dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      label: "Properties",
      path: "/admin-properties",
      icon: <HomeWorkOutlinedIcon />,
    },
    {
      label: "Users",
      path: "/admin-users",
      icon: <PeopleAltOutlinedIcon />,
    },
    {
      label: "Plans",
      path: "/admin-plans",
      icon: <WorkspacePremiumOutlinedIcon />,
    },
    {
      label: "Payments",
      path: "/admin-payments",
      icon: <ReceiptLongOutlinedIcon />,
    },
    {
      label: "Subscriptions",
      path: "/admin-subscriptions",
      icon: <SubscriptionsOutlinedIcon />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#ffffff",
        borderRight: "1px solid #eaecf0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          minHeight: 78,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #eaecf0",
        }}
      >
        <Typography
          component={Link}
          to="/admin-dashboard"
          onClick={() => setMobileOpen(false)}
          sx={{
            textDecoration: "none",
            fontSize: 27,
            fontWeight: 900,
            color: "#101828",
            letterSpacing: "-1px",
          }}
        >
          Buy
          <Box component="span" sx={{ color: "#0f766e" }}>
            Sel
          </Box>

          <Box
            component="span"
            sx={{
              ml: 0.8,
              fontSize: 11,
              fontWeight: 800,
              color: "#667085",
              letterSpacing: 0,
            }}
          >
            ADMIN
          </Box>
        </Typography>

        <IconButton
          onClick={() => setMobileOpen(false)}
          sx={{ display: { xs: "inline-flex", md: "none" } }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </Box>

      <Stack spacing={0.7} sx={{ p: 2, flex: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              startIcon={item.icon}
              sx={{
                justifyContent: "flex-start",
                py: 1.2,
                px: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: active ? 800 : 600,
                fontSize: 14,
                color: active ? "#0f766e" : "#475467",
                bgcolor: active ? "#ecfdf5" : "transparent",
                "& .MuiButton-startIcon": {
                  color: active ? "#0f766e" : "#667085",
                },
                "&:hover": {
                  bgcolor: "#f2f4f7",
                  color: "#0f766e",
                },
              }}
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>

      <Box sx={{ p: 2, borderTop: "1px solid #eaecf0" }}>
        <Stack
          direction="row"
          spacing={1.2}
          alignItems="center"
          sx={{
            p: 1.2,
            mb: 1.2,
            borderRadius: "12px",
            bgcolor: "#f9fafb",
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#0f766e",
              fontWeight: 800,
            }}
          >
            {adminUser?.username?.charAt(0)?.toUpperCase() || "A"}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 800,
                color: "#101828",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {adminUser?.username || "Master Admin"}
            </Typography>

            <Typography
              sx={{
                mt: 0.2,
                fontSize: 12,
                color: "#667085",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {adminUser?.admin_title || "Master Administrator"}
            </Typography>
          </Box>
        </Stack>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutOutlinedIcon />}
          onClick={handleLogout}
          sx={{
            py: 1.1,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            color: "#b42318",
            borderColor: "#fecdca",
            "&:hover": {
              bgcolor: "#fef3f2",
              borderColor: "#fda29b",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fb" }}>
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          position: "fixed",
          inset: "0 auto 0 0",
          display: { xs: "none", md: "block" },
          zIndex: 1200,
        }}
      >
        {sidebarContent}
      </Box>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      <Box
        component="header"
        sx={{
          minHeight: 70,
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          px: { xs: 2, md: 3 },
          bgcolor: "#ffffff",
          borderBottom: "1px solid #eaecf0",
          display: "flex",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 1100,
        }}
      >
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            mr: 1,
          }}
        >
          <MenuOutlinedIcon />
        </IconButton>

        <Box>
          <Typography
            sx={{
              fontSize: 18,
              fontWeight: 800,
              color: "#101828",
            }}
          >
            Master Admin Panel
          </Typography>

          <Typography
            sx={{
              fontSize: 12.5,
              color: "#667085",
            }}
          >
            Manage the BuySel platform
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ ml: "auto" }}
        >
            <AdminNotificationBell />

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#0f766e",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {adminUser?.username?.charAt(0)?.toUpperCase() || "A"}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              {adminUser?.username || "Admin"}
            </Typography>

            <Typography sx={{ fontSize: 11.5, color: "#667085" }}>
              Master Administrator
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          ml: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;