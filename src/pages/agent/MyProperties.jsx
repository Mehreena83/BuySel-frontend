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
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import axiosInstance from "../../api/axiosInstance";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

function MyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get("/properties/my-properties/");
        setProperties(response.data);
      } catch (err) {
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

  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
      setError("Failed to delete property.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
            mb: 4,
          }}
        >
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#475467",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Back to Dashboard
          </Button>

          <Button
            component={Link}
            to="/add-property"
            variant="contained"
            startIcon={<AddHomeWorkIcon />}
            sx={{
              bgcolor: "#065f46",
              px: 2.5,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              alignSelf: { xs: "flex-start", sm: "center" },
              "&:hover": {
                bgcolor: "#047857",
                boxShadow: "none",
              },
            }}
          >
            Add Property
          </Button>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            color="#1f2937"
            sx={{ fontSize: { xs: 28, md: 34 } }}
          >
            My Properties
          </Typography>

          <Typography color="#667085" sx={{ mt: 1 }}>
            View and manage your submitted property listings.
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

        {!loading && !error && properties.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#fff",
            }}
          >
            <CardContent sx={{ py: 8, textAlign: "center" }}>
              <Typography variant="h6" fontWeight={700} color="#1f2937">
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
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 3,
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#047857", boxShadow: "none" },
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

              return (
                <Card
                  key={property.id}
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
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "flex-start" }}
                      spacing={2}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#1f2937"
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
                          <Typography variant="body2">
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
                          <Typography variant="body2" color="#344054">
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              Price:
                            </Box>{" "}
                            ₹{Number(property.price).toLocaleString("en-IN")}
                          </Typography>

                          <Typography variant="body2" color="#344054">
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              Type:
                            </Box>{" "}
                            {property.property_type}
                          </Typography>

                          <Typography variant="body2" color="#344054">
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              Listing:
                            </Box>{" "}
                            {property.listing_type}
                          </Typography>

                          <Typography variant="body2" color="#344054">
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              Expires:
                            </Box>{" "}
                            {formatDate(property.expires_at)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          textTransform: "capitalize",
                          borderRadius: "8px",
                          flexShrink: 0,
                        }}
                      /> */}
                      <Stack
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "flex-end" }}
                        sx={{ flexShrink: 0 }}
                      >
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            textTransform: "capitalize",
                            borderRadius: "8px",
                          }}
                        />

                        <Stack direction="row" spacing={1}>
                          {!property.edit_locked && !property.is_expired && (
                            <Button
                              component={Link}
                              to={`/edit-property/${property.id}`}
                              variant="outlined"
                              size="small"
                              startIcon={<EditOutlinedIcon />}
                              sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 700,
                                color: "#047857",
                                borderColor: "#bbf7d0",
                                "&:hover": {
                                  borderColor: "#059669",
                                  bgcolor: "#ecfdf5",
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
                            onClick={() => handleDeleteProperty(property.id)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 700,
                            }}
                          >
                            Delete
                          </Button>
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
  );
}

export default MyProperties;
