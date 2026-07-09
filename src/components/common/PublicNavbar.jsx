import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

function PublicNavbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 72,
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
                fontSize: { xs: 26, md: 30 },
                fontWeight: 900,
                color: "#0f172a",
                letterSpacing: "-0.6px",
              }}
            >
              Buy<span style={{ color: "#059669" }}>Sel</span>
            </Typography>

            {/* Desktop Links */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                ml: 5,
                display: { xs: "none", md: "flex" },
              }}
            >
              <Typography component={Link} to="/" sx={navLinkStyle}>
                Home
              </Typography>

              <Typography component={Link} to="/buy" sx={navLinkStyle}>
                Buy
              </Typography>

              <Typography component={Link} to="/rent" sx={navLinkStyle}>
                Rent
              </Typography>
            </Stack>

            {/* Desktop Buttons */}
            <Box
              sx={{
                ml: "auto",
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1.5,
              }}
            >
              {user?.role === "agent" ? (
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  sx={primaryButtonStyle}
                >
                  Dashboard
                </Button>
              ) : user ? (
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  sx={logoutButtonStyle}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: "#475569",
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                  >
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
                color: "#0f172a",
                border: "1px solid #e5e7eb",
                borderRadius: 2,
              }}
            >
              <MenuIcon />
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
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,
            overflow: "hidden",
            bgcolor: "#ffffff",
          },
        }}
      >
        <Box
          sx={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              p: 2.5,
              bgcolor: "#064e3b",
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                component={Link}
                to="/"
                onClick={closeMobileMenu}
                sx={{
                  textDecoration: "none",
                  fontSize: 28,
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-0.6px",
                }}
              >
                Buy<span style={{ color: "#34d399" }}>Sel</span>
              </Typography>

              <IconButton
                onClick={closeMobileMenu}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.12)",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Typography
              sx={{
                mt: 1.5,
                color: "#d1fae5",
                fontSize: 13,
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              {user?.role === "agent"
                ? "Manage your listings and inquiries."
                : user
                  ? "Browse properties and send inquiries."
                  : "Find verified properties from trusted agents."}
            </Typography>
          </Box>

          {/* Menu Links */}
          <Box sx={{ p: 2.2, flex: 1 }}>
            <Typography
              sx={{
                mb: 1.5,
                color: "#94a3b8",
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Menu
            </Typography>

            <Stack spacing={1}>
              <Button
                component={Link}
                to="/"
                onClick={closeMobileMenu}
                sx={mobileNavButtonStyle}
              >
                Home
              </Button>

              <Button
                component={Link}
                to="/buy"
                onClick={closeMobileMenu}
                sx={mobileNavButtonStyle}
              >
                Buy Properties
              </Button>

              <Button
                component={Link}
                to="/rent"
                onClick={closeMobileMenu}
                sx={mobileNavButtonStyle}
              >
                Rent Properties
              </Button>
            </Stack>
          </Box>

          {/* Bottom Action */}
          <Box
            sx={{
              p: 2.2,
              borderTop: "1px solid #e5e7eb",
              bgcolor: "#f8fafc",
            }}
          >
            {user?.role === "agent" ? (
              <Button
                component={Link}
                to="/dashboard"
                onClick={closeMobileMenu}
                fullWidth
                variant="contained"
                sx={{
                  ...primaryButtonStyle,
                  borderRadius: 2.5,
                  py: 1.2,
                }}
              >
                Agent Dashboard
              </Button>
            ) : user ? (
              <Button
                onClick={handleLogout}
                fullWidth
                variant="outlined"
                sx={{
                  ...logoutButtonStyle,
                  borderRadius: 2.5,
                  py: 1.2,
                  bgcolor: "white",
                }}
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
                  sx={{
                    ...logoutButtonStyle,
                    borderRadius: 2.5,
                    py: 1.2,
                    bgcolor: "white",
                  }}
                >
                  Login
                </Button>

                <Button
                  component={Link}
                  to="/register"
                  onClick={closeMobileMenu}
                  fullWidth
                  variant="contained"
                  sx={{
                    ...primaryButtonStyle,
                    borderRadius: 2.5,
                    py: 1.2,
                  }}
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

const navLinkStyle = {
  textDecoration: "none",
  color: "#475569",
  fontWeight: 800,
  "&:hover": { color: "#059669" },
};

const primaryButtonStyle = {
  bgcolor: "#059669",
  px: 2.5,
  py: 0.9,
  borderRadius: "999px",
  fontSize: 14,
  fontWeight: 800,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#047857",
    boxShadow: "none",
  },
};

const logoutButtonStyle = {
  borderRadius: "999px",
  fontWeight: 800,
  textTransform: "none",
  color: "#475569",
  borderColor: "#d1d5db",
  "&:hover": {
    borderColor: "#059669",
    bgcolor: "#ecfdf5",
  },
};

const mobileNavButtonStyle = {
  justifyContent: "flex-start",
  color: "#0f172a",
  fontWeight: 800,
  textTransform: "none",
  borderRadius: 2.5,
  px: 2,
  py: 1.35,
  bgcolor: "#ffffff",
  border: "1px solid #eef2f7",
  "&:hover": {
    bgcolor: "#ecfdf5",
    color: "#047857",
    borderColor: "#bbf7d0",
  },
};

export default PublicNavbar;
