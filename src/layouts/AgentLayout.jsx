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
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const SIDEBAR_WIDTH = 260;

function AgentLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const navItems = [
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
      label: "Add Property",
      path: "/add-property",
      icon: <AddHomeOutlinedIcon />,
    },
    {
      label: "Plans",
      path: "/plans",
      icon: <WorkspacePremiumOutlinedIcon />,
    },
    {
      label: "Payments",
      path: "/payment-history",
      icon: <ReceiptLongOutlinedIcon />,
    },
    {
      label: "Inquiries",
      path: "/my-inquiries",
      icon: <MailOutlineOutlinedIcon />,
    },
  ];

  const isActive = (path) => {
    if (path === "/my-properties") {
      return (
        location.pathname === "/my-properties" || 
        location.pathname.startsWith("/edit-property/")
      );
    }

    return location.pathname === path;
  };

  const getPageTitle = () => {
    if (location.pathname === "/dashboard") return "Agent Dashboard";
    if (location.pathname === "/my-properties") return "My Properties";
    if (location.pathname === "/add-property") return "Add Property";
    if (location.pathname.startsWith("/edit-property/")) return "Edit Property";
    if (location.pathname === "/plans") return "Plans";
    if (location.pathname === "/payment-history") return "Payment History";
    if (location.pathname === "/my-inquiries") return "Inquiries";

    return "Agent Panel";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
          to="/dashboard"
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
            AGENT
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
          const active = isActive(item.path);

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
                  bgcolor: active ? "#ecfdf5" : "#f2f4f7",
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
            {user?.username?.charAt(0)?.toUpperCase() || "A"}
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
              {user?.username || "Agent"}
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
              Property Agent
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
            {getPageTitle()}
          </Typography>

          <Typography
            sx={{
              fontSize: 12.5,
              color: "#667085",
            }}
          >
            Manage your properties, plans and customer inquiries.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ ml: "auto" }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#0f766e",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || "A"}
          </Avatar>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Typography
              sx={{
                fontSize: 13.5,
                fontWeight: 700,
                color: "#101828",
              }}
            >
              {user?.username || "Agent"}
            </Typography>

            <Typography sx={{ fontSize: 11.5, color: "#667085" }}>
              Property Agent
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

export default AgentLayout;