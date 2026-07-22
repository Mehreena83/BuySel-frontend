import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../../api/adminAxiosInstance";
import AddPropertyDialog from "./AddPropertyDialog";
import DeletePropertyDialog from "./DeletePropertyDialog";
import EditPropertyDialog from "./EditPropertyDialog";
import PropertyCard from "./PropertyCard";
import PropertyDetailsDialog from "./PropertyDetailsDialog";
import RejectPropertyDialog from "./RejectPropertyDialog";
import { filterFieldStyle } from "./propertyFormUtils";

function AdminProperties() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("");
  const [search, setSearch] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailsProperty, setDetailsProperty] = useState(null);
  const [editProperty, setEditProperty] = useState(null);
  const [rejectProperty, setRejectProperty] = useState(null);
  const [deleteProperty, setDeleteProperty] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleAuthFailure = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminAxiosInstance.get(
        "/admin-panel/properties/",
        {
          params: {
            status: statusFilter || undefined,
            property_type: propertyTypeFilter || undefined,
            listing_type: listingTypeFilter || undefined,
          },
        },
      );

      setProperties(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      console.error(requestError.response?.data || requestError.message);

      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        handleAuthFailure();
        return;
      }

      setError("Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, propertyTypeFilter, listingTypeFilter]);

  const filteredProperties = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return properties;

    return properties.filter((property) => {
      return (
        property.title?.toLowerCase().includes(value) ||
        property.location?.toLowerCase().includes(value) ||
        property.agent_name?.toLowerCase().includes(value) ||
        property.agent_email?.toLowerCase().includes(value)
      );
    });
  }, [properties, search]);

  const handleApprove = async (propertyId) => {
    try {
      setActionLoading(`approve-${propertyId}`);

      const response = await adminAxiosInstance.patch(
        `/admin-panel/properties/${propertyId}/approve/`,
      );

      setProperties((previous) =>
        previous.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                ...(response.data?.property || {}),
                status: "approved",
              }
            : property,
        ),
      );

      showSnackbar(
        response.data?.message || "Property approved successfully.",
        "success",
      );
    } catch (requestError) {
      console.error(requestError.response?.data || requestError.message);

      if (
        requestError.response?.status === 401 ||
        requestError.response?.status === 403
      ) {
        handleAuthFailure();
        return;
      }

      showSnackbar(
        requestError.response?.data?.message ||
          requestError.response?.data?.detail ||
          "Unable to approve property.",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setPropertyTypeFilter("");
    setListingTypeFilter("");
    setSearch("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.13), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 35 },
                fontWeight: 850,
                color: "#101828",
                letterSpacing: "-1px",
                lineHeight: 1.12,
              }}
            >
              Manage Properties
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#667085",
                fontSize: { xs: 14, md: 15 },
              }}
            >
              View, add, edit, approve, reject and delete property listings.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            sx={{
              ml: { md: "auto" },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 800,
                bgcolor: "#0f766e",
                px: 2.3,
                py: 1.05,
                boxShadow: "0 12px 25px rgba(15,118,110,0.18)",
                "&:hover": {
                  bgcolor: "#0b625d",
                  transform: "translateY(-1px)",
                  boxShadow: "0 14px 28px rgba(15,118,110,0.22)",
                },
              }}
            >
              Add Property
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={fetchProperties}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 800,
                color: "#344054",
                borderColor: "#d0d5dd",
                bgcolor: "#ffffff",
                px: 2.2,
                py: 1.05,
                boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
                "&:hover": {
                  bgcolor: "#ecfdf5",
                  borderColor: "#bbf7d0",
                  color: "#0f766e",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        <Card
          elevation={0}
          sx={{
            mb: 2.5,
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: "26px",
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(14px)",
            boxShadow:
              "0 20px 45px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <CardContent
            sx={{
              p: { xs: 2.2, md: 2.7 },
              "&:last-child": { pb: { xs: 2.2, md: 2.7 } },
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "2fr repeat(3, minmax(150px, 1fr)) auto",
                },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <TextField
                size="small"
                label="Search properties"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Title, location or agent"
                InputProps={{
                  startAdornment: (
                    <SearchOutlinedIcon
                      sx={{ mr: 1, color: "#98a2b3", fontSize: 20 }}
                    />
                  ),
                }}
                sx={filterFieldStyle}
              />

              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                sx={filterFieldStyle}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Property Type"
                value={propertyTypeFilter}
                onChange={(event) => setPropertyTypeFilter(event.target.value)}
                sx={filterFieldStyle}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="house">House</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="land">Land</MenuItem>
                <MenuItem value="commercial">Commercial</MenuItem>
              </TextField>

              <TextField
                select
                size="small"
                label="Listing Type"
                value={listingTypeFilter}
                onChange={(event) => setListingTypeFilter(event.target.value)}
                sx={filterFieldStyle}
              >
                <MenuItem value="">All Listings</MenuItem>
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
              </TextField>

              <Button
                onClick={resetFilters}
                sx={{
                  minHeight: 40,
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 800,
                  color: "#475467",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  px: 2,
                  "&:hover": {
                    bgcolor: "#ecfdf5",
                    color: "#0f766e",
                    borderColor: "#bbf7d0",
                  },
                }}
              >
                Clear
              </Button>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: "16px", border: "1px solid #fecdca" }}
          >
            {error}
          </Alert>
        )}

        <Typography
          sx={{
            mb: 1.8,
            color: "#475467",
            fontSize: 14,
            fontWeight: 750,
          }}
        >
          {filteredProperties.length} properties found
        </Typography>

        {loading ? (
          <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}>
            <CircularProgress sx={{ color: "#0f766e" }} />
          </Box>
        ) : filteredProperties.length === 0 ? (
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
            <CardContent sx={{ textAlign: "center", py: 7 }}>
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  mx: "auto",
                  borderRadius: "26px",
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(15, 118, 110, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <HomeWorkOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.8,
                  fontWeight: 850,
                  color: "#344054",
                  fontSize: 18,
                }}
              >
                No properties found
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
                Try changing or clearing the selected filters.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={1.7}>
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                actionLoading={actionLoading}
                onView={setDetailsProperty}
                onEdit={setEditProperty}
                onApprove={handleApprove}
                onReject={setRejectProperty}
                onDelete={setDeleteProperty}
              />
            ))}
          </Stack>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        onClose={() =>
          setSnackbar((previous) => ({ ...previous, open: false }))
        }
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((previous) => ({ ...previous, open: false }))
          }
          sx={{ borderRadius: "14px", fontWeight: 700 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <AddPropertyDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={(newProperty) =>
          setProperties((previous) => [newProperty, ...previous])
        }
        showSnackbar={showSnackbar}
      />

      <EditPropertyDialog
        open={Boolean(editProperty)}
        property={editProperty}
        onClose={() => setEditProperty(null)}
        onUpdated={(updatedProperty) =>
          setProperties((previous) =>
            previous.map((property) =>
              property.id === updatedProperty.id ? updatedProperty : property,
            ),
          )
        }
        showSnackbar={showSnackbar}
      />

      <PropertyDetailsDialog
        open={Boolean(detailsProperty)}
        property={detailsProperty}
        onClose={() => setDetailsProperty(null)}
      />

      <RejectPropertyDialog
        open={Boolean(rejectProperty)}
        property={rejectProperty}
        onClose={() => setRejectProperty(null)}
        onRejected={(updatedProperty) =>
          setProperties((previous) =>
            previous.map((property) =>
              property.id === updatedProperty.id ? updatedProperty : property,
            ),
          )
        }
        showSnackbar={showSnackbar}
      />

      <DeletePropertyDialog
        open={Boolean(deleteProperty)}
        property={deleteProperty}
        onClose={() => setDeleteProperty(null)}
        onDeleted={(propertyId) =>
          setProperties((previous) =>
            previous.filter((property) => property.id !== propertyId),
          )
        }
        showSnackbar={showSnackbar}
      />
    </Box>
  );
}

export default AdminProperties;
