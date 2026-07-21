import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import axiosInstance from "../../api/axiosInstance";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSubmitLoading(true);

    try {
      const response = await axiosInstance.post("/accounts/login/", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const loggedUser = response.data.user;

      if (location.state?.from) {
        navigate(location.state.from);
      } else if (loggedUser.role === "agent") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid username or password");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        py: 4,
        px: 2,
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.16), transparent 30%), radial-gradient(circle at bottom right, rgba(16,185,129,0.14), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 3, md: 4 },
            borderRadius: "30px",
            border: "1px solid rgba(255,255,255,0.9)",
            bgcolor: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 30px 80px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(145deg, rgba(236,253,245,0.9) 0%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              width: 170,
              height: 170,
              borderRadius: "50%",
              right: -70,
              top: -70,
              bgcolor: "rgba(15, 118, 110, 0.09)",
              boxShadow: "0 0 70px rgba(15, 118, 110, 0.12)",
              pointerEvents: "none",
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box sx={{ textAlign: "center", mb: 3.2 }}>
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  mx: "auto",
                  mb: 2,
                  borderRadius: "26px",
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(15, 118, 110, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <LoginOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  fontSize: { xs: 29, md: 34 },
                  fontWeight: 900,
                  color: "#101828",
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                Buy
                <Box component="span" sx={{ color: "#0f766e" }}>
                  Sel
                </Box>
              </Typography>

              <Typography
                sx={{
                  mt: 1.3,
                  fontSize: { xs: 18, md: 20 },
                  fontWeight: 850,
                  color: "#101828",
                }}
              >
                Welcome Back
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: 14,
                  color: "#667085",
                }}
              >
                Login to continue to your BuySel account.
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  borderRadius: "16px",
                  border: "1px solid #fecdca",
                  bgcolor: "#fef3f2",
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutlineOutlinedIcon
                          sx={{ color: "#98a2b3", fontSize: 21 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={textFieldStyle}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon
                          sx={{ color: "#98a2b3", fontSize: 21 }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={submitLoading}
                  sx={{
                    mt: 0.5,
                    py: 1.35,
                    borderRadius: "18px",
                    bgcolor: "#0f766e",
                    fontWeight: 850,
                    textTransform: "none",
                    fontSize: 15,
                    boxShadow:
                      "0 14px 28px rgba(15, 118, 110, 0.24), inset 0 1px 0 rgba(255,255,255,0.32)",
                    transition: "0.22s ease",
                    "&:hover": {
                      bgcolor: "#0b625d",
                      boxShadow:
                        "0 18px 36px rgba(15, 118, 110, 0.28), inset 0 1px 0 rgba(255,255,255,0.32)",
                      transform: "translateY(-2px)",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "#98a2b3",
                      color: "#ffffff",
                    },
                  }}
                >
                  {submitLoading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Logging in...</span>
                    </Stack>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Stack>
            </Box>

            <Typography
              textAlign="center"
              sx={{
                mt: 3,
                color: "#667085",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Don&apos;t have an account?{" "}
              <Typography
                component={Link}
                to="/register"
                sx={{
                  color: "#0f766e",
                  fontWeight: 850,
                  textDecoration: "none",
                  "&:hover": {
                    color: "#0b625d",
                  },
                }}
              >
                Register
              </Typography>
            </Typography>

            <Typography
              sx={{
                mt: 2.4,
                textAlign: "center",
                color: "#98a2b3",
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              Secure account access • BuySel
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#f8fafc",

    "& fieldset": {
      borderColor: "#d0d5dd",
    },

    "&:hover fieldset": {
      borderColor: "#98a2b3",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#0f766e",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#667085",
    fontSize: 14,
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#0f766e",
  },
};

export default Login;
