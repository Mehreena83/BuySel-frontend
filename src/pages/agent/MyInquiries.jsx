import { useEffect, useState } from "react";
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
        console.error(err.response?.data || err.message);
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
        bgcolor: "#f6f8fb",
        py: { xs: 3, md: 5 },
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.12), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.10), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 50%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 850,
              color: "#101828",
              fontSize: { xs: 28, md: 36 },
              letterSpacing: "-0.8px",
            }}
          >
            Property Inquiries
          </Typography>

          <Typography color="#667085" sx={{ mt: 1, fontSize: 15 }}>
            View inquiries received for your approved property listings.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#065f46" }} />
          </Box>
        )}

        {error && (
          <Alert
            severity="error"
            sx={{
              borderRadius: "16px",
              mb: 3,
              border: "1px solid #fecdca",
            }}
          >
            {error}
          </Alert>
        )}

        {!loading && !error && inquiries.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed #d0d5dd",
              borderRadius: "28px",
              bgcolor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 24px 54px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: "24px",
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  boxShadow:
                    "0 18px 34px rgba(15,118,110,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <MessageOutlinedIcon sx={{ fontSize: 36 }} />
              </Box>

              <Typography variant="h6" fontWeight={850} color="#101828">
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
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: "26px",
                  bgcolor: "rgba(255,255,255,0.94)",
                  backdropFilter: "blur(14px)",
                  boxShadow:
                    "0 18px 42px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
                  transition: "0.24s ease",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(145deg, rgba(236,253,245,0.82) 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 140,
                    height: 140,
                    borderRadius: "50%",
                    right: -55,
                    top: -55,
                    bgcolor: "rgba(15,118,110,0.07)",
                    boxShadow: "0 0 55px rgba(15,118,110,0.1)",
                    pointerEvents: "none",
                  },
                  "&:hover": {
                    borderColor: "#bbf7d0",
                    boxShadow:
                      "0 26px 58px rgba(15,23,42,0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    p: { xs: 2.5, md: 3 },
                  }}
                >
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
                            border: "1px solid #bbf7d0",
                            fontWeight: 850,
                            borderRadius: "999px",
                            px: 0.7,
                            boxShadow: "0 8px 18px rgba(15,118,110,0.06)",
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#667085",
                            fontWeight: 650,
                            flexShrink: 0,
                          }}
                        >
                          {formatDate(item.created_at)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" alignItems="center" spacing={1.2}>
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: "16px",
                            bgcolor: "#ecfdf5",
                            color: "#0f766e",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow:
                              "0 14px 28px rgba(15,118,110,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                          }}
                        >
                          <PersonOutlineOutlinedIcon fontSize="small" />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            fontWeight={850}
                            color="#101828"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              letterSpacing: "-0.3px",
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
                        <InfoBox
                          icon={<PhoneOutlinedIcon />}
                          label="Phone"
                          value={item.phone}
                        />

                        <InfoBox
                          icon={<HomeWorkOutlinedIcon />}
                          label="Property"
                          value={item.property_title}
                        />
                      </Box>

                      {item.message && (
                        <>
                          <Divider sx={{ my: 2.5 }} />

                          <Typography
                            color="#475467"
                            fontSize={14}
                            fontWeight={800}
                          >
                            Message
                          </Typography>

                          <Box
                            sx={{
                              mt: 1,
                              p: 1.6,
                              borderRadius: "16px",
                              bgcolor: "rgba(248,250,252,0.82)",
                              border: "1px solid #eef2f7",
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 18px rgba(15,23,42,0.035)",
                            }}
                          >
                            <Typography
                              color="#344054"
                              sx={{
                                lineHeight: 1.7,
                                fontSize: 14.5,
                                fontWeight: 600,
                              }}
                            >
                              {item.message}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>

                    <Button
                      variant="outlined"
                      component="a"
                      href={`tel:${item.phone}`}
                      startIcon={<PhoneOutlinedIcon />}
                      sx={{
                        borderRadius: "15px",
                        fontWeight: 850,
                        textTransform: "none",
                        borderColor: "#bbf7d0",
                        color: "#047857",
                        bgcolor: "#ffffff",
                        px: 2.5,
                        py: 1,
                        minWidth: 130,
                        height: 42,
                        alignSelf: { xs: "stretch", md: "flex-start" },
                        boxShadow: "0 10px 22px rgba(15,118,110,0.08)",
                        "&:hover": {
                          borderColor: "#86efac",
                          bgcolor: "#ecfdf5",
                          transform: "translateY(-1px)",
                          boxShadow: "0 12px 26px rgba(15,118,110,0.12)",
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

function InfoBox({ icon, label, value }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: "16px",
        bgcolor: "rgba(248,250,252,0.85)",
        border: "1px solid #eef2f7",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 18px rgba(15,23,42,0.035)",
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            color: "#64748b",
            display: "flex",
            flexShrink: 0,
            "& svg": {
              fontSize: 19,
            },
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{ color: "#667085", fontWeight: 700 }}
          >
            {label}
          </Typography>

          <Typography
            color="#344054"
            fontWeight={800}
            fontSize={14}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {value || "N/A"}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default MyInquiries;
