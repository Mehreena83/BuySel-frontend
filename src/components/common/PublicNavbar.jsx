import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

function PublicNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const profileOpen = Boolean(anchorEl);

  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  const isActive = (path) => location.pathname === path;

  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Buy", path: "/buy" },
    { label: "Rent", path: "/rent" },
  ];

  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          bgcolor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 76,
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                fontSize: { xs: 27, md: 31 },
                fontWeight: 850,
                color: "#0f172a",
                letterSpacing: "-0.8px",
              }}
            >
              Buy<span style={{ color: "#059669" }}>Sel</span>
            </Typography>

            <Stack
              direction="row"
              spacing={3.2}
              sx={{
                ml: 6,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {navItems.map((item) => (
                <Typography
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    textDecoration: "none",
                    color: isActive(item.path) ? "#065f46" : "#475467",
                    fontSize: 14.5,
                    fontWeight: isActive(item.path) ? 700 : 500,
                    position: "relative",
                    py: 2.7,
                    transition: "0.2s ease",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 14,
                      height: 2.5,
                      borderRadius: 10,
                      bgcolor: isActive(item.path) ? "#059669" : "transparent",
                      transition: "0.2s ease",
                    },
                    "&:hover": {
                      color: "#065f46",
                    },
                    "&:hover::after": {
                      bgcolor: "#059669",
                    },
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>

            <Box
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.3,
              }}
            >
              {user ? (
                <>
                  {user.role === "agent" && (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      startIcon={<DashboardOutlinedIcon />}
                      sx={dashboardButtonStyle}
                    >
                      Dashboard
                    </Button>
                  )}

                  <Button onClick={handleProfileOpen} sx={profileButtonStyle}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: "#065f46",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      {userInitial}
                    </Avatar>

                    <Box
                      sx={{
                        textAlign: "left",
                        display: { xs: "none", lg: "block" },
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#111827",
                          fontSize: 13.5,
                          fontWeight: 600,
                          lineHeight: 1.2,
                          maxWidth: 115,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {user.username}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#667085",
                          fontSize: 11.5,
                          fontWeight: 500,
                          textTransform: "capitalize",
                          lineHeight: 1.2,
                        }}
                      >
                        {user.role}
                      </Typography>
                    </Box>

                    <KeyboardArrowDownRoundedIcon
                      sx={{
                        fontSize: 20,
                        color: "#667085",
                        transform: profileOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                        transition: "0.2s ease",
                      }}
                    />
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={profileOpen}
                    onClose={handleProfileClose}
                    PaperProps={{
                      sx: {
                        mt: 1.2,
                        width: 285,
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 22px 55px rgba(15, 23, 42, 0.16)",
                        overflow: "hidden",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#ffffff",
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      <Stack spacing={1.7}>
                        <Stack
                          direction="row"
                          spacing={1.4}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 52,
                              height: 52,
                              bgcolor: "#065f46",
                              color: "#ffffff",
                              fontWeight: 700,
                              fontSize: 20,
                              boxShadow: "0 8px 18px rgba(6, 95, 70, 0.22)",
                            }}
                          >
                            {userInitial}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: 16,
                                color: "#111827",
                                maxWidth: 170,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                lineHeight: 1.25,
                              }}
                            >
                              {user?.username || "User"}
                            </Typography>

                            <Box
                              sx={{
                                mt: 0.6,
                                px: 1,
                                py: 0.25,
                                width: "fit-content",
                                borderRadius: "999px",
                                bgcolor: "#ecfdf5",
                                color: "#047857",
                                fontSize: 11.5,
                                fontWeight: 600,
                                textTransform: "capitalize",
                              }}
                            >
                              {user?.role || "user"}
                            </Box>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                          }}
                        >
                          <ProfileDetail
                            label="Email"
                            value={user?.email || "Not provided"}
                          />
                          <ProfileDetail
                            label="Phone"
                            value={user?.phone || "Not provided"}
                          />
                        </Box>
                      </Stack>
                    </Box>

                    <MenuItem
                      component={Link}
                      to="/"
                      onClick={handleProfileClose}
                      sx={profileMenuItemStyle}
                    >
                      <HomeOutlinedIcon
                        sx={{ fontSize: 20, color: "#059669" }}
                      />
                      Home
                    </MenuItem>

                    {user.role === "agent" && (
                      <MenuItem
                        component={Link}
                        to="/dashboard"
                        onClick={handleProfileClose}
                        sx={profileMenuItemStyle}
                      >
                        <DashboardOutlinedIcon
                          sx={{ fontSize: 20, color: "#059669" }}
                        />
                        Dashboard
                      </MenuItem>
                    )}

                    <MenuItem onClick={handleLogout} sx={profileMenuItemStyle}>
                      <LogoutOutlinedIcon
                        sx={{ fontSize: 20, color: "#dc2626" }}
                      />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" sx={loginButtonStyle}>
                    Login
                  </Button>

                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={primaryButtonStyle}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>

            <IconButton
              onClick={() => setMobileOpen(true)}
              sx={{
                ml: "auto",
                display: { xs: "flex", md: "none" },
                color: "#064e3b",
                border: "1px solid #d0d5dd",
                borderRadius: 2,
                bgcolor: "#ffffff",
                "&:hover": {
                  bgcolor: "#ecfdf5",
                  borderColor: "#bbf7d0",
                },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: 310,
            bgcolor: "#ffffff",
            borderTopLeftRadius: 22,
            borderBottomLeftRadius: 22,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{ minHeight: "100%", display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              p: 2.4,
              bgcolor: "#f8fafc",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                component={Link}
                to="/"
                onClick={closeMobileMenu}
                sx={{
                  textDecoration: "none",
                  fontSize: 28,
                  fontWeight: 850,
                  color: "#0f172a",
                  letterSpacing: "-0.6px",
                }}
              >
                Buy<span style={{ color: "#059669" }}>Sel</span>
              </Typography>

              <IconButton
                onClick={closeMobileMenu}
                sx={{
                  color: "#064e3b",
                  bgcolor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  "&:hover": { bgcolor: "#ecfdf5" },
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Stack>

            {user && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: "#ffffff",
                  border: "1px solid #dbe7e0",
                }}
              >
                <Stack direction="row" spacing={1.3} alignItems="center">
                  <Avatar
                    sx={{
                      bgcolor: "#065f46",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {userInitial}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "#111827",
                        maxWidth: 190,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user?.username || "User"}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "#667085",
                        fontWeight: 500,
                        textTransform: "capitalize",
                      }}
                    >
                      {user?.role || "user"}
                    </Typography>
                  </Box>
                </Stack>

                <Box sx={{ mt: 1.4, pt: 1.3, borderTop: "1px solid #eef2f7" }}>
                  <ProfileDetail
                    label="Email"
                    value={user?.email || "Not provided"}
                  />
                  <ProfileDetail
                    label="Phone"
                    value={user?.phone || "Not provided"}
                  />
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2.2, flex: 1 }}>
            <Stack spacing={0.8}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  onClick={closeMobileMenu}
                  sx={{
                    ...mobileNavButtonStyle,
                    bgcolor: isActive(item.path) ? "#ecfdf5" : "#ffffff",
                    color: isActive(item.path) ? "#047857" : "#1f2937",
                    borderColor: isActive(item.path) ? "#bbf7d0" : "#eef2f7",
                  }}
                >
                  {item.label === "Buy"
                    ? "Buy Properties"
                    : item.label === "Rent"
                      ? "Rent Properties"
                      : item.label}
                </Button>
              ))}

              {user?.role === "agent" && (
                <Button
                  component={Link}
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  sx={mobileNavButtonStyle}
                >
                  Agent Dashboard
                </Button>
              )}
            </Stack>
          </Box>

          <Box
            sx={{ p: 2.2, borderTop: "1px solid #e5e7eb", bgcolor: "#f8fafc" }}
          >
            {user ? (
              <Button
                onClick={handleLogout}
                fullWidth
                variant="outlined"
                startIcon={<LogoutOutlinedIcon />}
                sx={{ ...outlineButtonStyle, py: 1.15, bgcolor: "#ffffff" }}
              >
                Logout
              </Button>
            ) : (
              <Stack spacing={1.2}>
                <Button
                  component={Link}
                  to="/login"
                  onClick={closeMobileMenu}
                  fullWidth
                  variant="outlined"
                  sx={{ ...outlineButtonStyle, py: 1.15, bgcolor: "#ffffff" }}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  onClick={closeMobileMenu}
                  fullWidth
                  variant="contained"
                  sx={{ ...primaryButtonStyle, py: 1.15 }}
                >
                  Register
                </Button>
              </Stack>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

const primaryButtonStyle = {
  bgcolor: "#065f46",
  color: "#ffffff",
  px: 2.5,
  py: 0.9,
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#047857",
    boxShadow: "none",
  },
};

const loginButtonStyle = {
  color: "#344054",
  fontWeight: 500,
  textTransform: "none",
  borderRadius: 2,
  px: 2,
  py: 0.9,
  "&:hover": {
    bgcolor: "#f8fafc",
    color: "#047857",
  },
};

const outlineButtonStyle = {
  borderRadius: 2,
  fontWeight: 500,
  textTransform: "none",
  color: "#344054",
  borderColor: "#d0d5dd",
  px: 2.1,
  py: 0.9,
  "&:hover": {
    borderColor: "#059669",
    bgcolor: "#ecfdf5",
    color: "#047857",
  },
};

const profileButtonStyle = {
  minHeight: 50,
  px: 0.7,
  pr: 1.2,
  borderRadius: 2.5,
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: 1,
  bgcolor: "#ffffff",
  border: "1px solid #d0d5dd",
  boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
  "&:hover": {
    bgcolor: "#f8fafc",
    borderColor: "#a7f3d0",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
  },
};

const profileMenuItemStyle = {
  gap: 1.3,
  py: 1.35,
  px: 2,
  fontWeight: 500,
  color: "#1f2937",
  fontSize: 14.5,
  minHeight: 48,
  "&:hover": {
    bgcolor: "#f8fafc",
    color: "#047857",
  },
};

const ProfileDetail = ({ label, value }) => (
  <Box sx={{ mb: label === "Email" ? 1.2 : 0 }}>
    <Typography
      sx={{
        fontSize: 11.5,
        color: "#98a2b3",
        fontWeight: 500,
        mb: 0.35,
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontSize: 13.5,
        color: "#1f2937",
        fontWeight: 600,
        lineHeight: 1.35,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </Typography>
  </Box>
);

const mobileNavButtonStyle = {
  justifyContent: "flex-start",
  fontWeight: 500,
  textTransform: "none",
  borderRadius: 2,
  px: 2,
  py: 1.25,
  border: "1px solid #eef2f7",
  "&:hover": {
    bgcolor: "#ecfdf5",
    color: "#047857",
    borderColor: "#bbf7d0",
  },
};

const dashboardButtonStyle = {
  bgcolor: "#065f46",
  color: "#ffffff",
  px: 2.4,
  py: 1,
  borderRadius: 2.5,
  fontSize: 14,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "none",
  "& .MuiButton-startIcon": {
    mr: 0.7,
  },
  "& .MuiSvgIcon-root": {
    fontSize: 19,
  },
  "&:hover": {
    bgcolor: "#047857",
    boxShadow: "none",
  },
};

export default PublicNavbar;
