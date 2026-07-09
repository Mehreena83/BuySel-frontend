import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import axiosInstance from "../../api/axiosInstance";

function Rent() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentProperties = async () => {
      try {
        const response = await axiosInstance.get("/properties/approved/", {
          params: {
            listing_type: "rent",
          },
        });

        setProperties(response.data);
      } catch (err) {
        setError("Failed to load rent properties.");
      } finally {
        setLoading(false);
      }
    };

    fetchRentProperties();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          component={Link}
          to="/"
          sx={{
            mb: 3,
            color: "#475569",
            textTransform: "none",
            fontWeight: 800,
          }}
        >
          ← Back to Home
        </Button>

        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: "#059669",
              fontSize: 13,
              fontWeight: 900,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              mb: 1,
            }}
          >
            Rent Properties
          </Typography>

          <Typography
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: { xs: 32, md: 42 },
              letterSpacing: "-0.8px",
            }}
          >
            Properties for Rent
          </Typography>

          <Typography color="#64748b" sx={{ mt: 1 }}>
            Explore approved rental properties listed by trusted agents.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && properties.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              p: 4,
              textAlign: "center",
              bgcolor: "white",
            }}
          >
            <Typography fontWeight={900}>
              No rental properties available
            </Typography>
            <Typography color="#64748b" sx={{ mt: 1 }}>
              Approved rental properties will appear here.
            </Typography>
          </Card>
        )}

        {!loading && !error && properties.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {properties.map((property) => (
              <Card
                key={property.id}
                elevation={0}
                sx={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: "white",
                  transition: "0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 18px 44px rgba(15, 23, 42, 0.10)",
                  },
                }}
              >
                {property.main_image ? (
                  <CardMedia
                    component="img"
                    image={property.main_image}
                    alt={property.title}
                    sx={{
                      height: 220,
                      objectFit: "cover",
                      bgcolor: "#e5e7eb",
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      bgcolor: "#ecfdf5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#059669",
                    }}
                  >
                    <HomeWorkOutlinedIcon sx={{ fontSize: 52 }} />
                  </Box>
                )}

                <CardContent sx={{ p: 2.5 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label="Rent"
                      size="small"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#047857",
                        fontWeight: 900,
                      }}
                    />

                    <Typography fontWeight={900} color="#059669">
                      ₹{Number(property.price).toLocaleString("en-IN")}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{
                      mt: 2,
                      fontWeight: 900,
                      color: "#0f172a",
                      lineHeight: 1.25,
                    }}
                  >
                    {property.title}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.7}
                    sx={{ mt: 1 }}
                  >
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 18, color: "#64748b" }}
                    />
                    <Typography variant="body2" color="#64748b">
                      {property.location}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    sx={{ mt: 2, gap: 1, flexWrap: "wrap" }}
                  >
                    <Chip label={property.property_type} size="small" />
                    <Chip label={`${property.area_sqft} sqft`} size="small" />
                  </Stack>

                  <Button
                    component={Link}
                    to={`/properties/${property.id}`}
                    fullWidth
                    variant="outlined"
                    sx={{
                      mt: 2.5,
                      borderRadius: 2,
                      py: 1,
                      textTransform: "none",
                      fontWeight: 900,
                      borderColor: "#d1d5db",
                      color: "#0f172a",
                      "&:hover": {
                        borderColor: "#059669",
                        bgcolor: "#ecfdf5",
                      },
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Rent;
