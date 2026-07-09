import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
      setError("Invalid username or password");
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
              Login
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: "#667085",
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              Welcome back to BuySel
            </Typography>
          </Box>

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
                label="Password"
                name="password"
                type="password"
                value={formData.password}
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
                {submitLoading ? "Logging in..." : "Login"}
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
            Don&apos;t have an account?{" "}
            <Typography
              component={Link}
              to="/register"
              sx={{
                color: "#059669",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  color: "#047857",
                },
              }}
            >
              Register
            </Typography>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;
