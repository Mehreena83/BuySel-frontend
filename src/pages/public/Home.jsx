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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import axiosInstance from "../../api/axiosInstance";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_BASE_URL}${image}`;
};

function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    location: "",
    listing_type: "",
    property_type: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const isAgent = user?.role === "agent";
  const isBuyer = user?.role === "user";

  const fetchApprovedProperties = async (filterValues = filters) => {
    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.get("/properties/approved/", {
        params: filterValues,
      });

      setProperties(response.data);
    } catch (err) {
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedProperties();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    fetchApprovedProperties(filters);
  };

  const handleReset = () => {
    const emptyFilters = {
      location: "",
      listing_type: "",
      property_type: "",
    };

    setFilters(emptyFilters);
    fetchApprovedProperties(emptyFilters);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "#f8fafc",
          pt: { xs: 4, md: 6 },
          pb: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "#064e3b",
              color: "white",
              borderRadius: { xs: 4, md: 5 },
              px: { xs: 3, md: 7 },
              py: { xs: 5, md: 7 },
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.45fr 0.85fr" },
              gap: { xs: 4, md: 6 },
              alignItems: "center",
              boxShadow: "0 24px 70px rgba(6, 78, 59, 0.16)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 260,
                height: 260,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.06)",
                right: -90,
                top: -100,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                sx={{
                  color: "#a7f3d0",
                  fontSize: 13,
                  fontWeight: 900,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  mb: 2,
                }}
              >
                Real Estate Marketplace
              </Typography>

              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: 40, sm: 48, md: 58 },
                  lineHeight: 1.05,
                  letterSpacing: "-1px",
                  maxWidth: 720,
                }}
              >
                {isAgent
                  ? "Manage Your Property Listings"
                  : "Find Your Perfect Property"}
              </Typography>

              <Typography
                sx={{
                  mt: 2.5,
                  color: "#d1fae5",
                  fontSize: { xs: 16, md: 18 },
                  maxWidth: 600,
                  lineHeight: 1.7,
                }}
              >
                {isAgent
                  ? "Access your agent dashboard, manage properties, track plans and view customer inquiries from one place."
                  : "Explore approved homes, land, apartments and rentals. View details and send inquiries to trusted agents."}
              </Typography>

              {(isAgent || !user) && (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 4 }}
                >
                  {isAgent && (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      sx={heroPrimaryButton}
                    >
                      Go to Dashboard
                    </Button>
                  )}

                  {!user && (
                    <>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        sx={heroPrimaryButton}
                      >
                        Register as Agent
                      </Button>

                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        sx={heroOutlineButton}
                      >
                        Login
                      </Button>
                    </>
                  )}
                </Stack>
              )}
            </Box>

            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.96)",
                border: "1px solid rgba(255,255,255,0.45)",
                position: "relative",
                zIndex: 1,
              }}
            >
              <CardContent sx={{ p: { xs: 2.8, md: 3.5 } }}>
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    bgcolor: "#ecfdf5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2.2,
                  }}
                >
                  {isAgent ? (
                    <DashboardOutlinedIcon />
                  ) : (
                    <HomeWorkOutlinedIcon />
                  )}
                </Box>

                <Typography variant="h6" fontWeight={900} color="#0f172a">
                  {isAgent ? "Agent Control Panel" : "Buyer Access"}
                </Typography>

                <Typography color="#64748b" sx={{ mt: 1, lineHeight: 1.7 }}>
                  {isAgent
                    ? "Manage listings, plans and inquiries easily."
                    : "Search properties, view details and contact agents without a separate dashboard."}
                </Typography>

                {isAgent ? (
                  <Button
                    component={Link}
                    to="/dashboard"
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: "#059669",
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
                    Dashboard
                  </Button>
                ) : (
                  <Stack spacing={1.4} sx={{ mt: 3 }}>
                    {[
                      "Search approved properties",
                      "View complete property details",
                      "Send inquiries to agents",
                    ].map((item) => (
                      <Stack
                        key={item}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <CheckCircleIcon
                          sx={{ color: "#059669", fontSize: 20 }}
                        />
                        <Typography fontWeight={800} color="#0f172a">
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Search Filter */}
      <Container
        maxWidth="lg"
        sx={{ mt: -3, mb: 5, position: "relative", zIndex: 5 }}
      >
        <Card
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 4,
            bgcolor: "white",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "1.3fr 1fr 1fr auto auto",
                },
                gap: 2,
                alignItems: "center",
              }}
            >
              <TextField
                fullWidth
                size="small"
                label="Location"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="Search location"
              />

              <TextField
                select
                fullWidth
                size="small"
                label="Listing Type"
                name="listing_type"
                value={filters.listing_type}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </TextField>

              <TextField
                select
                fullWidth
                size="small"
                label="Property Type"
                name="property_type"
                value={filters.property_type}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </TextField>

              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  bgcolor: "#059669",
                  px: 3,
                  py: 1,
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
                Search
              </Button>

              <Button
                variant="outlined"
                onClick={handleReset}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 800,
                  textTransform: "none",
                  borderColor: "#d1d5db",
                  color: "#475569",
                }}
              >
                Reset
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Properties */}
      <Container id="properties" maxWidth="lg" sx={{ pb: { xs: 5, md: 8 } }}>
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
            Featured Listings
          </Typography>

          <Typography
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: { xs: 32, md: 42 },
              letterSpacing: "-0.8px",
            }}
          >
            Active Properties
          </Typography>

          <Typography color="#64748b" sx={{ mt: 1 }}>
            Approved and non-expired properties listed by agents.
          </Typography>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <CircularProgress sx={{ color: "#059669" }} />
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
            <Typography fontWeight={900} color="#0f172a">
              No properties available
            </Typography>

            <Typography color="#64748b" sx={{ mt: 1 }}>
              Approved properties will appear here.
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
                    image={getImageUrl(property.main_image)}
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
                      label={property.listing_type}
                      size="small"
                      sx={{
                        bgcolor: "#ecfdf5",
                        color: "#047857",
                        fontWeight: 900,
                        textTransform: "capitalize",
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

const heroPrimaryButton = {
  bgcolor: "white",
  color: "#047857",
  px: 3,
  py: 1.2,
  borderRadius: 2,
  fontWeight: 900,
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    bgcolor: "#ecfdf5",
    boxShadow: "none",
  },
};

const heroOutlineButton = {
  color: "white",
  borderColor: "rgba(255,255,255,0.35)",
  px: 3,
  py: 1.2,
  borderRadius: 2,
  fontWeight: 800,
  textTransform: "none",
  "&:hover": {
    borderColor: "white",
    bgcolor: "rgba(255,255,255,0.08)",
  },
};

export default Home;
