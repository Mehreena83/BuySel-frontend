import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import AppSnackbar from "../../components/common/AppSnackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import BathtubOutlinedIcon from "@mui/icons-material/BathtubOutlined";
import SquareFootOutlinedIcon from "@mui/icons-material/SquareFootOutlined";
import LocalParkingOutlinedIcon from "@mui/icons-material/LocalParkingOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import StairsOutlinedIcon from "@mui/icons-material/StairsOutlined";
import LandscapeOutlinedIcon from "@mui/icons-material/LandscapeOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import RouteOutlinedIcon from "@mui/icons-material/RouteOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import axiosInstance from "../../api/axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image}`;
};

function PropertyDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [inquiryData, setInquiryData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get(`/properties/approved/${id}/`);

        setProperty(response.data);
        setSelectedImage(response.data.main_image || "");
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Property not found or expired.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleInquiryChange = (e) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setSnackbar({
        open: true,
        message: "Please login to send an inquiry.",
        severity: "warning",
      });

      setTimeout(() => {
        navigate("/login", {
          state: {
            from: `/properties/${id}`,
          },
        });
      }, 800);

      return;
    }

    setInquiryLoading(true);

    try {
      await axiosInstance.post(
        `/properties/approved/${id}/inquiry/`,
        inquiryData,
      );

      setSnackbar({
        open: true,
        message: "Inquiry sent successfully.",
        severity: "success",
      });

      setInquiryData({
        name: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to send inquiry. Please try again.",
        severity: "error",
      });
    } finally {
      setInquiryLoading(false);
    }
  };

  const inquiryInputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      bgcolor: "rgba(255,255,255,0.96)",
      color: "#0f172a",
      fontWeight: 700,
      boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.35)",
      },
      "&:hover fieldset": {
        borderColor: "#a7f3d0",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#10b981",
        borderWidth: "2px",
      },
    },
    "& .MuiOutlinedInput-input": {
      fontSize: 14.5,
      py: 1.45,
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#059669" }} />
      </Box>
    );
  }

  if (!property) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 6 }}>
        <Container>
          <Typography color="error" fontWeight={800}>
            Property not found.
          </Typography>
        </Container>
      </Box>
    );
  }

  const allImages = [
    property.main_image,
    ...(property.images || []).map((item) => item.image),
  ].filter(Boolean);

const formatLabel = (key) => {
  return key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDetailValue = (key, value) => {
  if (!value && value !== 0) return "N/A";

  if (
    key.includes("price") ||
    key.includes("amount")
  ) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  }

  if (
    key.includes("area") ||
    key.includes("sqft") ||
    key === "builtup_area_sqft"
  ) {
    return `${value} sqft`;
  }

  if (key.includes("cent")) {
    return `${value} cent`;
  }

  return value;
};

const getDetailIcon = (key) => {
  if (key.includes("bedroom")) return <BedOutlinedIcon />;
  if (key.includes("bathroom")) return <BathtubOutlinedIcon />;
  if (key.includes("area") || key.includes("sqft")) return <SquareFootOutlinedIcon />;
  if (key.includes("parking")) return <LocalParkingOutlinedIcon />;
  if (key.includes("furnishing")) return <ChairOutlinedIcon />;
  if (key.includes("floor")) return <StairsOutlinedIcon />;
  if (key.includes("cent") || key.includes("plot")) return <LandscapeOutlinedIcon />;
  if (key.includes("commercial")) return <StorefrontOutlinedIcon />;
  if (key.includes("road")) return <RouteOutlinedIcon />;

  return <HomeWorkOutlinedIcon />;
};

const detailOrder = [
  "bedrooms",
  "bathrooms",
  "area_sqft",
  "builtup_area_sqft",
  "total_cent",
  "price_per_cent",
  "floor_number",
  "total_floors",
  "total_rooms",
  "floors",
  "parking",
  "furnishing",
  "road_access",
  "plot_type",
  "commercial_type",
];

const detailEntries = Object.entries(property.details || {})
  .filter(([, value]) => value !== "" && value !== null && value !== undefined)
  .sort(([keyA], [keyB]) => {
    const indexA = detailOrder.indexOf(keyA);
    const indexB = detailOrder.indexOf(keyB);

    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });


const overviewItems = detailEntries.slice(0, 3);

const agentFact = {
  label: "Agent:",
  value: property.agent_name,
  icon: <PersonOutlineOutlinedIcon />,
};

  return (
    <>
      <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBackIcon />}
            sx={{
              mb: 3,
              color: "#475569",
              textTransform: "none",
              fontWeight: 800,
            }}
          >
            Back to Properties
          </Button>

          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              bgcolor: "white",
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                <Chip
                  label={property.listing_type}
                  sx={{
                    bgcolor: "#ecfdf5",
                    color: "#047857",
                    fontWeight: 900,
                    textTransform: "capitalize",
                  }}
                />

                <Chip
                  label={property.property_type}
                  sx={{
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                    textTransform: "capitalize",
                    fontWeight: 800,
                  }}
                />

                <Chip
                  icon={<VerifiedOutlinedIcon />}
                  label="Approved"
                  sx={{
                    bgcolor: "#eff6ff",
                    color: "#1d4ed8",
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <Typography
                sx={{
                  fontSize: { xs: 34, md: 50 },
                  lineHeight: 1.05,
                  fontWeight: 900,
                  color: "#0f172a",
                  letterSpacing: "-1.2px",
                  maxWidth: 850,
                }}
              >
                {property.title}
              </Typography>

              <Stack
                direction="row"
                alignItems="center"
                spacing={0.8}
                sx={{ mt: 2 }}
              >
                <LocationOnOutlinedIcon
                  sx={{ color: "#64748b", fontSize: 21 }}
                />
                <Typography color="#64748b" fontWeight={700}>
                  {property.location}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.45fr 0.75fr" },
              gap: 3,
              alignItems: "start",
            }}
          >
            <Stack spacing={3}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 4,
                  bgcolor: "white",
                  p: { xs: 1.5, md: 2 },
                }}
              >
                <Stack spacing={1.5}>
                  <Box>
                    {selectedImage ? (
                      <CardMedia
                        component="img"
                        image={getImageUrl(selectedImage)}
                        alt={property.title}
                        sx={{
                          width: "100%",
                          height: { xs: 300, sm: 390, md: 500 },
                          objectFit: "cover",
                          borderRadius: 3,
                          bgcolor: "#e5e7eb",
                          display: "block",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          height: { xs: 300, sm: 390, md: 500 },
                          bgcolor: "#ecfdf5",
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#059669",
                        }}
                      >
                        <HomeWorkOutlinedIcon sx={{ fontSize: 80 }} />
                      </Box>
                    )}
                  </Box>

                  {allImages.length > 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.2,
                        overflowX: "auto",
                        pb: 0.5,
                        pt: 0.5,
                        "&::-webkit-scrollbar": {
                          height: 6,
                        },
                        "&::-webkit-scrollbar-thumb": {
                          bgcolor: "#cbd5e1",
                          borderRadius: 10,
                        },
                      }}
                    >
                      {allImages.map((image, index) => (
                        <Box
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          sx={{
                            width: { xs: 82, md: 95 },
                            height: { xs: 64, md: 72 },
                            flexShrink: 0,
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                            border:
                              selectedImage === image
                                ? "2px solid #059669"
                                : "1px solid #e5e7eb",
                            bgcolor: "#f8fafc",
                            p: selectedImage === image ? 0.35 : 0,
                            transition: "0.2s ease",
                            position: "relative",
                            "&:hover": {
                              borderColor: "#059669",
                            },
                          }}
                        >
                          <Box
                            component="img"
                            src={getImageUrl(image)}
                            alt={`${property.title} ${index + 1}`}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              borderRadius: selectedImage === image ? 1.5 : 2,
                            }}
                          />

                          {index === 0 && (
                            <Box
                              sx={{
                                position: "absolute",
                                left: 5,
                                bottom: 5,
                                px: 0.7,
                                py: 0.2,
                                borderRadius: 1,
                                bgcolor: "rgba(6, 95, 70, 0.9)",
                                color: "#ffffff",
                                fontSize: 10,
                                fontWeight: 600,
                                lineHeight: 1.2,
                              }}
                            >
                              Main
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Stack>
              </Card>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  bgcolor: "white",
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h6"
                    component="strong"
                    sx={{
                      display: "block",
                      fontWeight: 900,
                      color: "#0f172a",
                    }}
                  >
                    Property Overview
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                      gap: 2,
                      mt: 3,
                    }}
                  >
                    {overviewItems.length > 0 ? (
  overviewItems.map(([key, value]) => (
    <Box
      key={key}
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
      }}
    >
      {/* <Box sx={{ color: "#059669", mb: 1 }}>
        <HomeWorkOutlinedIcon />
      </Box> */}
      <Box sx={{ color: "#059669", mb: 1 }}>
  {getDetailIcon(key)}
</Box>

      <Typography
        color="#64748b"
        fontSize={13}
        fontWeight={700}
      >
        {formatLabel(key)}
      </Typography>

      <Typography color="#0f172a" fontWeight={900}>
        {formatDetailValue(key, value)}
      </Typography>
    </Box>
  ))
) : (
  <Box
    sx={{
      p: 2,
      borderRadius: 3,
      bgcolor: "#f8fafc",
      border: "1px solid #e2e8f0",
    }}
  >
    <Box sx={{ color: "#059669", mb: 1 }}>
      <HomeWorkOutlinedIcon />
    </Box>

    <Typography color="#64748b" fontSize={13} fontWeight={700}>
      Property Type
    </Typography>

    <Typography color="#0f172a" fontWeight={900} sx={{ textTransform: "capitalize" }}>
      {property.property_type}
    </Typography>
  </Box>
)}
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight={900} color="#0f172a">
                    Description
                  </Typography>

                  <Typography
                    color="#475569"
                    sx={{
                      mt: 1.5,
                      lineHeight: 1.9,
                      fontSize: 16,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {property.description}
                  </Typography>

                  {property.address && (
                    <>
                      <Divider sx={{ my: 3 }} />

                      <Typography variant="h6" fontWeight={900} color="#0f172a">
                        Address
                      </Typography>

                      <Typography
                        color="#475569"
                        sx={{ mt: 1.5, lineHeight: 1.8 }}
                      >
                        {property.address}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Stack>

            <Stack
              spacing={3}
              sx={{ position: { md: "sticky" }, top: { md: 94 } }}
            >
              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  bgcolor: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography color="#64748b" fontWeight={800}>
                    Property Price
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: { xs: 34, md: 38 },
                      fontWeight: 900,
                      color: "#059669",
                      letterSpacing: "-0.8px",
                    }}
                  >
                    ₹{Number(property.price).toLocaleString("en-IN")}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Stack spacing={2.2}>
                   {detailEntries.map(([key, value]) => (
  <Stack
    key={key}
    direction="row"
    justifyContent="space-between"
    alignItems="center"
    spacing={2}
  >
    <Stack direction="row" spacing={1.2} alignItems="center">
      {/* <Box sx={{ color: "#059669", display: "flex" }}>
        <HomeWorkOutlinedIcon fontSize="small" />
      </Box> */}
      <Box sx={{ color: "#059669", display: "flex" }}>
  {getDetailIcon(key)}
</Box>

      <Typography color="#64748b">
        {formatLabel(key)}:
      </Typography>
    </Stack>

    <Typography
      fontWeight={900}
      color="#0f172a"
      textAlign="right"
      sx={{ textTransform: "capitalize" }}
    >
      {formatDetailValue(key, value)}
    </Typography>
  </Stack>
))}

<Stack
  direction="row"
  justifyContent="space-between"
  alignItems="center"
  spacing={2}
>
  <Stack direction="row" spacing={1.2} alignItems="center">
    <Box sx={{ color: "#059669", display: "flex" }}>
      {agentFact.icon}
    </Box>

    <Typography color="#64748b">{agentFact.label}</Typography>
  </Stack>

  <Typography fontWeight={900} color="#0f172a" textAlign="right">
    {agentFact.value}
  </Typography>
</Stack>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "#064e3b",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 22px 45px rgba(6, 78, 59, 0.22)",
                  position: "relative",
                }}
              >
                <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: "rgba(255,255,255,0.13)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <PersonOutlineOutlinedIcon sx={{ color: "#a7f3d0" }} />
                  </Box>

                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: "white",
                    }}
                  >
                    Contact Agent
                  </Typography>

                  <Typography
                    sx={{
                      color: "#d1fae5",
                      mt: 1,
                      lineHeight: 1.7,
                      fontSize: 14.5,
                    }}
                  >
                    {token
                      ? "Share your details with the agent. They will review your inquiry and contact you soon."
                      : "Login is required to send an inquiry. You can still view property details without login."}
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={handleInquirySubmit}
                    autoComplete="off"
                    sx={{ mt: 3 }}
                  >
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        name="name"
                        value={inquiryData.name}
                        onChange={handleInquiryChange}
                        required
                        placeholder="Full name"
                        autoComplete="off"
                        sx={inquiryInputStyle}
                      />

                      <TextField
                        fullWidth
                        type="tel"
                        name="phone"
                        value={inquiryData.phone}
                        onChange={handleInquiryChange}
                        required
                        placeholder="Phone number"
                        autoComplete="off"
                        inputProps={{
                          maxLength: 15,
                          autoComplete: "off",
                        }}
                        sx={inquiryInputStyle}
                      />

                      <TextField
                        fullWidth
                        name="message"
                        value={inquiryData.message}
                        onChange={handleInquiryChange}
                        multiline
                        rows={3}
                        placeholder="Message"
                        autoComplete="off"
                        sx={{
                          ...inquiryInputStyle,
                          "& .MuiOutlinedInput-root": {
                            ...inquiryInputStyle["& .MuiOutlinedInput-root"],
                            alignItems: "flex-start",
                          },
                        }}
                      />

                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={inquiryLoading}
                        sx={{
                          bgcolor: "#059669",
                          color: "white",
                          py: 1.2,
                          borderRadius: 2,
                          fontWeight: 900,
                          textTransform: "none",
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#047857",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {inquiryLoading
                          ? "Sending..."
                          : token
                            ? "Send Inquiry"
                            : "Login to Send Inquiry"}
                      </Button>
                    </Stack>
                  </Box>
                </CardContent>
              </Card>

              <Card
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  bgcolor: "white",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    component="strong"
                    sx={{
                      display: "block",
                      fontWeight: 900,
                      color: "#0f172a",
                      fontSize: 16,
                    }}
                  >
                    Listing Information
                  </Typography>

                  <Stack spacing={1.7} sx={{ mt: 2 }}>
                    <InfoRow label="Status:" value={property.status} />
                    <InfoRow
                      label="Expires On:"
                      value={property.expires_at || "Not set"}
                    />
                    <InfoRow
                      label="Listing Type:"
                      value={property.listing_type}
                    />
                    <InfoRow
                      label="Property Type:"
                      value={property.property_type}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </Container>
      </Box>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="#64748b">{label}</Typography>
      <Typography
        fontWeight={800}
        color="#0f172a"
        sx={{ textTransform: "capitalize", textAlign: "right" }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

export default PropertyDetails;
