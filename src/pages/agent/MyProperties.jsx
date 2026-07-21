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
  Dialog,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

import axiosInstance from "../../api/axiosInstance";

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get("/properties/my-properties/");
        setProperties(response.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("Failed to load properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getStatusChip = (property) => {
    if (property.is_expired) return { label: "Expired", color: "error" };
    if (property.status === "approved")
      return { label: "Approved", color: "success" };
    if (property.status === "rejected")
      return { label: "Rejected", color: "error" };
    return { label: "Pending", color: "warning" };
  };

  const getStatusChipStyle = (property) => {
    if (property.is_expired) {
      return {
        bgcolor: "#fef3f2",
        color: "#b42318",
        border: "#fecdca",
      };
    }

    if (property.status === "approved") {
      return {
        bgcolor: "#ecfdf3",
        color: "#067647",
        border: "#abefc6",
      };
    }

    if (property.status === "rejected") {
      return {
        bgcolor: "#fef3f2",
        color: "#b42318",
        border: "#fecdca",
      };
    }

    return {
      bgcolor: "#fffaeb",
      color: "#b54708",
      border: "#fedf89",
    };
  };

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "object") {
      image = image.image || image.main_image || image.url || "";
    }

    if (!image) return "";

    if (image.startsWith("http")) return image;

    const baseURL = axiosInstance.defaults.baseURL || "";
    const origin = baseURL.replace("/api", "").replace(/\/$/, "");

    return `${origin}${image}`;
  };

  const getPropertyImages = (property) => {
    const imageList = [
      property.main_image,
      property.image,
      property.property_image,
      ...(property.gallery_images || []).map((item) => item.image || item),
      ...(property.images || []).map((item) => item.image || item),
    ].filter(Boolean);

    return [...new Set(imageList)];
  };

  const handleImageClick = (property) => {
    const images = getPropertyImages(property);

    if (images.length === 0) return;

    setSelectedImages(images);
    setSelectedImageIndex(0);
    setSelectedImage(getImageUrl(images[0]));
    setImagePopupOpen(true);
  };

  const handleDeleteProperty = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/properties/my-properties/${propertyId}/`);

      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.id !== propertyId),
      );
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to delete property.");
    }
  };

  return (
    <>
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
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 4,
              width: "100%",
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h4"
                fontWeight={850}
                color="#101828"
                sx={{
                  fontSize: { xs: 28, md: 34 },
                  letterSpacing: "-0.8px",
                }}
              >
                My Properties
              </Typography>

              <Typography color="#667085" sx={{ mt: 1, fontSize: 15 }}>
                View and manage your submitted property listings.
              </Typography>
            </Box>

            <Button
              component={Link}
              to="/add-property"
              variant="contained"
              startIcon={<AddHomeWorkIcon />}
              sx={{
                ml: { sm: "auto" },
                flexShrink: 0,
                bgcolor: "#065f46",
                px: 2.5,
                py: 1.05,
                borderRadius: "14px",
                fontWeight: 800,
                textTransform: "none",
                alignSelf: { xs: "flex-start", sm: "center" },
                boxShadow:
                  "0 14px 28px rgba(6,95,70,0.22), inset 0 1px 0 rgba(255,255,255,0.24)",
                "&:hover": {
                  bgcolor: "#047857",
                  boxShadow:
                    "0 18px 36px rgba(6,95,70,0.26), inset 0 1px 0 rgba(255,255,255,0.24)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Add Property
            </Button>
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

          {!loading && !error && properties.length === 0 && (
            <Card
              elevation={0}
              sx={{
                border: "1px dashed #d0d5dd",
                borderRadius: "28px",
                bgcolor: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(12px)",
                boxShadow:
                  "0 24px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <CardContent sx={{ py: 8, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    mx: "auto",
                    borderRadius: "24px",
                    bgcolor: "#ecfdf5",
                    color: "#0f766e",
                    display: "grid",
                    placeItems: "center",
                    boxShadow:
                      "0 18px 34px rgba(15,118,110,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <HomeWorkOutlinedIcon sx={{ fontSize: 36 }} />
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={850}
                  color="#1f2937"
                  sx={{ mt: 2 }}
                >
                  No properties added yet
                </Typography>

                <Typography color="#667085" sx={{ mt: 1, mb: 3 }}>
                  Your submitted properties will appear here.
                </Typography>

                <Button
                  component={Link}
                  to="/add-property"
                  variant="contained"
                  sx={{
                    bgcolor: "#065f46",
                    textTransform: "none",
                    fontWeight: 800,
                    borderRadius: "14px",
                    px: 3,
                    py: 1.05,
                    boxShadow: "0 12px 24px rgba(6,95,70,0.18)",
                    "&:hover": {
                      bgcolor: "#047857",
                      boxShadow: "0 14px 28px rgba(6,95,70,0.22)",
                    },
                  }}
                >
                  Add Your First Property
                </Button>
              </CardContent>
            </Card>
          )}

          {!loading && !error && properties.length > 0 && (
            <Stack spacing={2}>
              {properties.map((property) => {
                const status = getStatusChip(property);
                const statusStyle = getStatusChipStyle(property);
                const propertyImages = getPropertyImages(property);
                const imageUrl = getImageUrl(propertyImages[0]);

                return (
                  <Card
                    key={property.id}
                    elevation={0}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.9)",
                      borderRadius: "26px",
                      bgcolor: "rgba(255,255,255,0.94)",
                      backdropFilter: "blur(14px)",
                      boxShadow:
                        "0 18px 42px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
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
                        bgcolor: "rgba(15, 118, 110, 0.07)",
                        boxShadow: "0 0 55px rgba(15,118,110,0.1)",
                        pointerEvents: "none",
                      },
                      "&:hover": {
                        borderColor: "#bbf7d0",
                        boxShadow:
                          "0 26px 58px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
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
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems={{ xs: "stretch", sm: "flex-start" }}
                      >
                        <Box
                          onClick={() => handleImageClick(property)}
                          sx={{
                            width: { xs: "100%", sm: 150 },
                            height: { xs: 180, sm: 120 },
                            borderRadius: "20px",
                            overflow: "hidden",
                            bgcolor: "#f1f5f9",
                            border: "1px solid #e5e7eb",
                            flexShrink: 0,
                            cursor: imageUrl ? "pointer" : "default",
                            position: "relative",
                            boxShadow:
                              "0 14px 28px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                            "&:hover img": {
                              transform: "scale(1.04)",
                            },
                          }}
                        >
                          {imageUrl ? (
                            <>
                              <Box
                                component="img"
                                src={imageUrl}
                                alt={property.title}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                  transition: "0.25s ease",
                                }}
                              />

                              <Box
                                sx={{
                                  position: "absolute",
                                  left: 9,
                                  bottom: 9,
                                  px: 1.1,
                                  py: 0.45,
                                  borderRadius: "999px",
                                  bgcolor: "rgba(15, 23, 42, 0.68)",
                                  color: "#ffffff",
                                  fontSize: 11.5,
                                  fontWeight: 700,
                                  backdropFilter: "blur(8px)",
                                  boxShadow: "0 8px 18px rgba(15,23,42,0.22)",
                                }}
                              >
                                Click to view
                              </Box>
                            </>
                          ) : (
                            <Stack
                              alignItems="center"
                              justifyContent="center"
                              spacing={0.8}
                              sx={{ height: "100%" }}
                            >
                              <HomeWorkOutlinedIcon
                                sx={{ color: "#98a2b3", fontSize: 36 }}
                              />

                              <Typography
                                sx={{ color: "#98a2b3", fontSize: 13 }}
                              >
                                No image
                              </Typography>
                            </Stack>
                          )}
                        </Box>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          justifyContent="space-between"
                          alignItems={{ xs: "flex-start", sm: "flex-start" }}
                          spacing={2}
                          sx={{ flex: 1, minWidth: 0 }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
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
                              {property.title}
                            </Typography>

                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={0.7}
                              sx={{ mt: 1, color: "#667085" }}
                            >
                              <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />

                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {property.location}
                              </Typography>
                            </Stack>

                            <Box
                              sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                  xs: "1fr",
                                  sm: "repeat(2, max-content)",
                                  md: "repeat(4, max-content)",
                                },
                                columnGap: 4,
                                rowGap: 1,
                                mt: 2.5,
                              }}
                            >
                              <InfoText
                                label="Price"
                                value={`₹${Number(
                                  property.price || 0,
                                ).toLocaleString("en-IN")}`}
                              />

                              <InfoText
                                label="Type"
                                value={property.property_type}
                              />

                              <InfoText
                                label="Listing"
                                value={property.listing_type}
                              />

                              <InfoText
                                label="Expires"
                                value={formatDate(property.expires_at)}
                              />
                            </Box>
                          </Box>

                          <Stack
                            spacing={1}
                            alignItems={{ xs: "flex-start", sm: "flex-end" }}
                            sx={{ flexShrink: 0 }}
                          >
                            <Chip
                              label={status.label}
                              size="small"
                              sx={{
                                bgcolor: statusStyle.bgcolor,
                                color: statusStyle.color,
                                border: `1px solid ${statusStyle.border}`,
                                fontWeight: 850,
                                textTransform: "capitalize",
                                borderRadius: "999px",
                                px: 0.6,
                                minWidth: 86,
                              }}
                            />

                            <Stack direction="row" spacing={1}>
                              {!property.edit_locked &&
                                !property.is_expired && (
                                  <Button
                                    component={Link}
                                    to={`/edit-property/${property.id}`}
                                    variant="outlined"
                                    size="small"
                                    startIcon={<EditOutlinedIcon />}
                                    sx={{
                                      height: 38,
                                      borderRadius: "13px",
                                      textTransform: "none",
                                      fontWeight: 800,
                                      color: "#047857",
                                      bgcolor: "#ffffff",
                                      borderColor: "#bbf7d0",
                                      boxShadow:
                                        "0 8px 18px rgba(15,118,110,0.08)",
                                      "&:hover": {
                                        borderColor: "#059669",
                                        bgcolor: "#ecfdf5",
                                        transform: "translateY(-1px)",
                                      },
                                    }}
                                  >
                                    Edit
                                  </Button>
                                )}

                              <Button
                                variant="outlined"
                                size="small"
                                color="error"
                                startIcon={<DeleteOutlinedIcon />}
                                onClick={() =>
                                  handleDeleteProperty(property.id)
                                }
                                sx={{
                                  height: 38,
                                  borderRadius: "13px",
                                  textTransform: "none",
                                  fontWeight: 800,
                                  bgcolor: "#ffffff",
                                  boxShadow: "0 8px 18px rgba(180,35,24,0.06)",
                                  "&:hover": {
                                    bgcolor: "#fef3f2",
                                    transform: "translateY(-1px)",
                                  },
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Container>
      </Box>

      <Dialog
        open={imagePopupOpen}
        onClose={() => setImagePopupOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "26px",
            overflow: "hidden",
            bgcolor: "#ffffff",
            boxShadow: "0 28px 80px rgba(15,23,42,0.22)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 1.4,
            borderBottom: "1px solid #e5e7eb",
            background: "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)",
          }}
        >
          <Typography sx={{ fontWeight: 850, color: "#1f2937", fontSize: 15 }}>
            Property Images
          </Typography>

          <IconButton
            onClick={() => setImagePopupOpen(false)}
            size="small"
            sx={{
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
              "&:hover": {
                bgcolor: "#ecfdf5",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            bgcolor: "#f8fafc",
          }}
        >
          <Box
            component="img"
            src={selectedImage}
            alt="Property"
            sx={{
              width: "100%",
              height: { xs: 300, md: 480 },
              objectFit: "contain",
              display: "block",
              borderRadius: "20px",
              bgcolor: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 14px 32px rgba(15,23,42,0.08)",
            }}
          />

          {selectedImages.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 1.5,
                overflowX: "auto",
                pb: 0.5,
              }}
            >
              {selectedImages.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setSelectedImageIndex(index);
                    setSelectedImage(getImageUrl(image));
                  }}
                  sx={{
                    width: 78,
                    height: 58,
                    flexShrink: 0,
                    borderRadius: "14px",
                    overflow: "hidden",
                    cursor: "pointer",
                    border:
                      selectedImageIndex === index
                        ? "2px solid #059669"
                        : "1px solid #d0d5dd",
                    bgcolor: "#ffffff",
                    position: "relative",
                    boxShadow:
                      selectedImageIndex === index
                        ? "0 10px 24px rgba(5,150,105,0.16)"
                        : "none",
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(image)}
                    alt={`Property ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {index === 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        left: 4,
                        bottom: 4,
                        px: 0.6,
                        py: 0.15,
                        borderRadius: "999px",
                        bgcolor: "rgba(6, 95, 70, 0.9)",
                        color: "#ffffff",
                        fontSize: 9.5,
                        fontWeight: 700,
                      }}
                    >
                      Main
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Dialog>
    </>
  );
}

function InfoText({ label, value }) {
  return (
    <Typography variant="body2" color="#344054">
      <Box component="span" sx={{ fontWeight: 800 }}>
        {label}:
      </Box>{" "}
      <Box
        component="span"
        sx={{
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {value || "N/A"}
      </Box>
    </Typography>
  );
}

export default MyProperties;
