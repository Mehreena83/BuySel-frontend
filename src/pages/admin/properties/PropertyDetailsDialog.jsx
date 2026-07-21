import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import dayjs from "dayjs";
import { formatIndianCurrency } from "./propertyFormUtils";

function DetailsRow({ label, value }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={2}
      sx={{
        p: 1.25,
        borderRadius: "14px",
        bgcolor: "#f8fafc",
        border: "1px solid #eaecf0",
      }}
    >
      <Typography
        sx={{
          color: "#667085",
          fontSize: 13.5,
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "#101828",
          fontSize: 13.5,
          fontWeight: 800,
          textTransform: "capitalize",
          textAlign: "right",
        }}
      >
        {value || "N/A"}
      </Typography>
    </Stack>
  );
}

function PropertyDetailsDialog({ open, onClose, property }) {
  const hasValue = (value) =>
    value !== null && value !== undefined && value !== "";

  const typeDetails = [];

  if (["house", "villa", "apartment"].includes(property?.property_type)) {
    typeDetails.push(
      { label: "Bedrooms", value: property?.bedrooms },
      { label: "Bathrooms", value: property?.bathrooms },
      {
        label: "Area",
        value: property?.area_sqft ? `${property.area_sqft} sq.ft` : "",
      },
    );
  }

  if (["house", "villa"].includes(property?.property_type)) {
    typeDetails.push(
      { label: "Total Floors", value: property?.total_floors },
      { label: "Property Floor", value: property?.floors },
      { label: "Parking", value: property?.parking },
      { label: "Furnishing", value: property?.furnishing },
    );
  }

  if (property?.property_type === "apartment") {
    typeDetails.push(
      { label: "Floor Number", value: property?.floor_number },
      { label: "Total Floors", value: property?.total_floors },
      { label: "Furnishing", value: property?.furnishing },
    );
  }

  if (property?.property_type === "land") {
    typeDetails.push(
      { label: "Total Cent", value: property?.total_cent },
      {
        label: "Price Per Cent",
        value: property?.price_per_cent
          ? formatIndianCurrency(property.price_per_cent)
          : "",
      },
      { label: "Road Access", value: property?.road_access },
      { label: "Plot Type", value: property?.plot_type },
    );
  }

  if (property?.property_type === "commercial") {
    typeDetails.push(
      { label: "Commercial Type", value: property?.commercial_type },
      {
        label: "Built-up Area",
        value: property?.builtup_area_sqft
          ? `${property.builtup_area_sqft} sq.ft`
          : "",
      },
      { label: "Floor Number", value: property?.floor_number },
      { label: "Parking", value: property?.parking },
      { label: "Road Access", value: property?.road_access },
    );
  }

  const visibleTypeDetails = typeDetails.filter((item) =>
    hasValue(item.value),
  );

  const allImages = [
    ...(property?.main_image
      ? [
          {
            id: "main",
            image: property.main_image,
            label: "Main Image",
          },
        ]
      : []),
    ...(property?.images || []).map((image, index) => ({
      id: image.id,
      image: image.image,
      label: `Gallery Image ${index + 1}`,
    })),
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
        },
      }}
    >
      <DialogTitle sx={{ pr: 7 }}>
        <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#101828" }}>
          Property Details
        </Typography>
        <Typography sx={{ mt: 0.4, color: "#667085", fontSize: 13.5 }}>
          Complete information about this listing.
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 14,
            top: 14,
            bgcolor: "#f8fafc",
            "&:hover": { bgcolor: "#ecfdf5" },
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Stack spacing={3}>
          {allImages.length > 0 && (
            <Box>
              <Typography sx={{ mb: 1.5, fontWeight: 850, color: "#101828" }}>
                Property Images
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 1.5,
                }}
              >
                {allImages.map((image) => (
                  <Box
                    key={image.id}
                    sx={{
                      overflow: "hidden",
                      borderRadius: "18px",
                      border: "1px solid #eaecf0",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <Box
                      component="img"
                      src={image.image}
                      alt={image.label}
                      sx={{
                        width: "100%",
                        height: 220,
                        display: "block",
                        objectFit: "cover",
                      }}
                    />
                    <Typography
                      sx={{ p: 1, color: "#667085", fontSize: 12.5, fontWeight: 700 }}
                    >
                      {image.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={1}
          >
            <Box>
              <Typography sx={{ fontSize: 22, fontWeight: 900, color: "#101828" }}>
                {property?.title}
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#667085" }}>
                {property?.location}
              </Typography>
            </Box>

            <Chip
              label={property?.status || "Unknown"}
              sx={{
                textTransform: "capitalize",
                fontWeight: 800,
                bgcolor:
                  property?.status === "approved"
                    ? "#ecfdf3"
                    : property?.status === "rejected"
                      ? "#fef3f2"
                      : "#fffaeb",
                color:
                  property?.status === "approved"
                    ? "#067647"
                    : property?.status === "rejected"
                      ? "#b42318"
                      : "#b54708",
              }}
            />
          </Stack>

          <Divider />

          <Box>
            <Typography sx={{ mb: 1.3, fontWeight: 850, color: "#101828" }}>
              Basic Information
            </Typography>
            <Stack spacing={1}>
              <DetailsRow label="Price" value={formatIndianCurrency(property?.price)} />
              <DetailsRow label="Property Type" value={property?.property_type} />
              <DetailsRow label="Listing Type" value={property?.listing_type} />
              <DetailsRow label="Address" value={property?.address} />
              <DetailsRow label="Agent" value={property?.agent_name} />
              <DetailsRow label="Agent Email" value={property?.agent_email} />
              <DetailsRow
                label="Expiry Date"
                value={
                  property?.expires_at
                    ? dayjs(property.expires_at).format("DD MMM YYYY")
                    : "N/A"
                }
              />
              <DetailsRow
                label="Created Date"
                value={
                  property?.created_at
                    ? dayjs(property.created_at).format("DD MMM YYYY")
                    : "N/A"
                }
              />
            </Stack>
          </Box>

          {visibleTypeDetails.length > 0 && (
            <Box>
              <Typography
                sx={{
                  mb: 1.3,
                  fontWeight: 850,
                  color: "#101828",
                  textTransform: "capitalize",
                }}
              >
                {property?.property_type} Details
              </Typography>
              <Stack spacing={1}>
                {visibleTypeDetails.map((item) => (
                  <DetailsRow key={item.label} label={item.label} value={item.value} />
                ))}
              </Stack>
            </Box>
          )}

          {property?.description && (
            <Box>
              <Typography sx={{ mb: 0.8, fontWeight: 850, color: "#101828" }}>
                Description
              </Typography>
              <Typography
                sx={{
                  p: 2,
                  borderRadius: "16px",
                  bgcolor: "#f8fafc",
                  border: "1px solid #eaecf0",
                  color: "#344054",
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                }}
              >
                {property.description}
              </Typography>
            </Box>
          )}

          {property?.rejection_reason && (
            <Alert severity="error" sx={{ borderRadius: "14px" }}>
              Rejection reason: {property.rejection_reason}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 800, color: "#475467" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PropertyDetailsDialog;
