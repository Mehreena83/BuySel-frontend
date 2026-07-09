import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import axiosInstance from "../../api/axiosInstance";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "user",
    password: "",
    confirm_password: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const isUser = formData.role === "user";
  const isAgent = formData.role === "agent";

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setSubmitLoading(true);

    try {
      const response = await axiosInstance.post(
        "/accounts/register/",
        formData,
      );

      setSuccess(response.data.message || "Registration successful.");

      setFormData({
        username: "",
        email: "",
        phone: "",
        role: "user",
        password: "",
        confirm_password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const apiError = err.response?.data;

      setError(
        typeof apiError === "object" && apiError !== null
          ? Object.values(apiError).flat().join(" ")
          : apiError || "Registration failed. Please check your details.",
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#ffffff",
      fontSize: 14,
      "& fieldset": {
        borderColor: "#d0d5dd",
      },
      "&:hover fieldset": {
        borderColor: "#98a2b3",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#059669",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 14,
      color: "#667085",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#059669",
    },
  };

  const roleButtonStyle = (active) => ({
    py: 1.1,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    fontSize: 14,
    color: active ? "#ffffff" : "#475467",
    bgcolor: active ? "#059669" : "#ffffff",
    border: active ? "1px solid #059669" : "1px solid #e5e7eb",
    boxShadow: "none",
    "&:hover": {
      bgcolor: active ? "#047857" : "#f8fafc",
      boxShadow: "none",
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              sx={{
                fontSize: { xs: 27, md: 31 },
                fontWeight: 700,
                color: "#1f2937",
                letterSpacing: "-0.3px",
              }}
            >
              Create Account
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#667085",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              Register to continue with BuySel
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
            <Button
              fullWidth
              type="button"
              onClick={() => handleRoleChange("user")}
              startIcon={<PersonOutlineOutlinedIcon />}
              sx={roleButtonStyle(isUser)}
            >
              User
            </Button>

            <Button
              fullWidth
              type="button"
              onClick={() => handleRoleChange("agent")}
              startIcon={<BusinessCenterOutlinedIcon />}
              sx={roleButtonStyle(isAgent)}
            >
              Agent
            </Button>
          </Stack>

          {success && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={inputStyle}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirm_password"
                type="password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                sx={inputStyle}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitLoading}
                sx={{
                  mt: 1,
                  py: 1.3,
                  borderRadius: 2,
                  bgcolor: "#065f46",
                  fontWeight: 600,
                  fontSize: 15,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#047857",
                    boxShadow: "none",
                  },
                }}
              >
                {submitLoading
                  ? "Creating..."
                  : isAgent
                    ? "Register as Agent"
                    : "Register as User"}
              </Button>
            </Stack>
          </Box>

          <Typography
            textAlign="center"
            sx={{
              mt: 3,
              color: "#667085",
              fontSize: 14,
              fontWeight: 400,
            }}
          >
            Already have an account?{" "}
            <Typography
              component={Link}
              to="/login"
              sx={{
                color: "#059669",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  color: "#047857",
                },
              }}
            >
              Login
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
