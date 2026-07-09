import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import axiosInstance from "../../api/axiosInstance";

function MyInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axiosInstance.get("/properties/my-inquiries/");
        setInquiries(response.data);
      } catch (err) {
        setError("Failed to load inquiries.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f8fafc",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#475467",
              fontWeight: 600,
              textTransform: "none",
              mb: 3,
            }}
          >
            Back to Dashboard
          </Button>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1f2937",
              fontSize: { xs: 28, md: 36 },
            }}
          >
            Property Inquiries
          </Typography>

          <Typography color="#667085" sx={{ mt: 1 }}>
            View inquiries received for your approved property listings.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#065f46" }} />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && inquiries.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#fff",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <MessageOutlinedIcon />
              </Box>

              <Typography variant="h6" fontWeight={700} color="#1f2937">
                No inquiries yet
              </Typography>

              <Typography color="#667085" sx={{ mt: 1 }}>
                Customer inquiries will appear here once they contact you.
              </Typography>
            </CardContent>
          </Card>
        )}

        {!loading && !error && inquiries.length > 0 && (
          <Stack spacing={2}>
            {inquiries.map((item) => (
              <Card
                key={item.id}
                elevation={0}
                sx={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 3,
                  bgcolor: "#fff",
                  transition: "0.2s ease",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", md: "flex-start" }}
                    spacing={2.5}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ mb: 2 }}
                      >
                        <Chip
                          label="New Inquiry"
                          size="small"
                          sx={{
                            bgcolor: "#ecfdf5",
                            color: "#047857",
                            fontWeight: 700,
                            borderRadius: "8px",
                          }}
                        />

                        <Typography variant="body2" color="#667085">
                          {formatDate(item.created_at)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 2,
                            bgcolor: "#f0fdf4",
                            color: "#059669",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <PersonOutlineOutlinedIcon fontSize="small" />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#1f2937"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography variant="body2" color="#667085">
                            Customer Inquiry
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                          },
                          gap: 1.5,
                          mt: 2.5,
                        }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #eef2f7",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PhoneOutlinedIcon
                              sx={{ fontSize: 18, color: "#64748b" }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="caption" color="#667085">
                                Phone
                              </Typography>
                              <Typography
                                color="#344054"
                                fontWeight={700}
                                fontSize={14}
                              >
                                {item.phone}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>

                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: "#f8fafc",
                            border: "1px solid #eef2f7",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <HomeWorkOutlinedIcon
                              sx={{ fontSize: 18, color: "#64748b" }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="caption" color="#667085">
                                Property
                              </Typography>
                              <Typography
                                color="#344054"
                                fontWeight={700}
                                fontSize={14}
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.property_title}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>

                      {item.message && (
                        <>
                          <Divider sx={{ my: 2.5 }} />

                          <Typography
                            color="#475467"
                            fontSize={14}
                            fontWeight={700}
                          >
                            Message
                          </Typography>

                          <Typography
                            color="#344054"
                            sx={{
                              mt: 0.8,
                              lineHeight: 1.7,
                              fontSize: 14.5,
                            }}
                          >
                            {item.message}
                          </Typography>
                        </>
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      component="a"
                      href={`tel:${item.phone}`}
                      startIcon={<PhoneOutlinedIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 700,
                        textTransform: "none",
                        borderColor: "#bbf7d0",
                        color: "#047857",
                        bgcolor: "#ecfdf5",
                        px: 2.5,
                        py: 1,
                        minWidth: 130,
                        height: 42,
                        alignSelf: { xs: "stretch", md: "flex-start" },
                        "&:hover": {
                          borderColor: "#86efac",
                          bgcolor: "#d1fae5",
                        },
                      }}
                    >
                      Call Now
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}

export default MyInquiries;
