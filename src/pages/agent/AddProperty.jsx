import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axiosInstance from "../../api/axiosInstance";
import AppSnackbar from "../../components/common/AppSnackbar";

const MAX_PROPERTY_IMAGES = 8;

function SelectedImagePreview({ image, index, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        border: index === 0 ? "1.5px solid #34d399" : "1px solid #e4e7ec",
        bgcolor: "#ffffff",
        boxShadow:
          index === 0
            ? "0 8px 22px rgba(5, 150, 105, 0.10)"
            : "0 6px 18px rgba(15, 23, 42, 0.05)",
      }}
    >
      <Box
        component="img"
        src={previewUrl}
        alt={index === 0 ? "Main property" : `Property ${index + 1}`}
        sx={{
          display: "block",
          width: "100%",
          height: { xs: 125, sm: 135 },
          objectFit: "cover",
        }}
      />

      <Box
        sx={{
          px: 1.2,
          py: 1,
          borderTop: "1px solid #eef2f6",
          bgcolor: "#ffffff",
        }}
      >
        <Typography
          noWrap
          sx={{
            pr: 3.5,
            color: "#344054",
            fontSize: 12.2,
            fontWeight: 750,
          }}
        >
          {index === 0 ? "Main Image" : `Gallery Image ${index}`}
        </Typography>

        <Typography
          noWrap
          sx={{
            mt: 0.25,
            color: "#98a2b3",
            fontSize: 10.8,
          }}
        >
          {image.name}
        </Typography>
      </Box>

      {index === 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 9,
            left: 9,
            px: 1,
            py: 0.4,
            borderRadius: "999px",
            bgcolor: "#047857",
            color: "#ffffff",
            fontSize: 10,
            fontWeight: 850,
            letterSpacing: "0.35px",
            boxShadow: "0 4px 12px rgba(4,120,87,0.25)",
          }}
        >
          MAIN
        </Box>
      )}

      <IconButton
        type="button"
        aria-label={`Remove image ${index + 1}`}
        onClick={() => onRemove(index)}
        sx={{
          position: "absolute",
          top: 7,
          right: 7,
          width: 29,
          height: 29,
          color: "#ffffff",
          bgcolor: "rgba(15, 23, 42, 0.72)",
          backdropFilter: "blur(4px)",
          "&:hover": {
            bgcolor: "#b42318",
          },
        }}
      >
        <CloseRoundedIcon sx={{ fontSize: 17 }} />
      </IconButton>
    </Box>
  );
}

const SectionTitle = ({ children }) => (
  <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
    <Box
      sx={{
        width: 5,
        height: 20,
        borderRadius: 2,
        bgcolor: "#059669",
      }}
    />

    <Typography
      sx={{
        fontSize: 16,
        fontWeight: 800,
        color: "#1f2937",
      }}
    >
      {children}
    </Typography>
  </Stack>
);

const propertyDetailFields = {
  land: [
    { name: "total_cent", label: "Total Cent", type: "number" },
    { name: "price_per_cent", label: "Price Per Cent", type: "number" },
    {
      name: "road_access",
      label: "Road Access",
      type: "select",
      options: ["Main Road", "Pocket Road", "No Road Access"],
    },
    {
      name: "plot_type",
      label: "Plot Type",
      type: "select",
      options: ["Residential", "Commercial", "Agricultural", "Mixed"],
    },
  ],

  house: [
    { name: "bedrooms", label: "Bedrooms", type: "number" },
    { name: "bathrooms", label: "Bathrooms", type: "number" },
    { name: "total_rooms", label: "Total Rooms", type: "number" },
    { name: "floors", label: "Floors", type: "number" },
    { name: "area_sqft", label: "Area Sqft", type: "number" },
  ],

  villa: [
    { name: "bedrooms", label: "Bedrooms", type: "number" },
    { name: "bathrooms", label: "Bathrooms", type: "number" },
    { name: "total_rooms", label: "Total Rooms", type: "number" },
    { name: "area_sqft", label: "Area Sqft", type: "number" },
    {
      name: "parking",
      label: "Parking",
      type: "select",
      options: ["Yes", "No", "Covered", "Open"],
    },
    {
      name: "furnishing",
      label: "Furnishing",
      type: "select",
      options: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
    },
  ],

  apartment: [
    { name: "bedrooms", label: "Bedrooms", type: "number" },
    { name: "bathrooms", label: "Bathrooms", type: "number" },
    { name: "floor_number", label: "Floor Number", type: "number" },
    { name: "total_floors", label: "Total Floors", type: "number" },
    { name: "area_sqft", label: "Apartment Area Sqft", type: "number" },
    {
      name: "furnishing",
      label: "Furnishing",
      type: "select",
      options: ["Unfurnished", "Semi Furnished", "Fully Furnished"],
    },
  ],

  commercial: [
    {
      name: "commercial_type",
      label: "Commercial Type",
      type: "select",
      options: ["Shop", "Office", "Showroom", "Warehouse", "Building"],
    },
    { name: "builtup_area_sqft", label: "Built-up Area Sqft", type: "number" },
    { name: "floor_number", label: "Floor Number", type: "number" },
    {
      name: "parking",
      label: "Parking",
      type: "select",
      options: ["Yes", "No", "Covered", "Open"],
    },
    {
      name: "road_access",
      label: "Road Access",
      type: "select",
      options: ["Main Road", "Pocket Road", "No Road Access"],
    },
  ],
};

function AddProperty() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    listing_type: "",
    price: "",
    location: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    total_rooms: "",
    floors: "",
    floor_number: "",
    total_floors: "",
    furnishing: "",
    parking: "",
    total_cent: "",
    price_per_cent: "",
    road_access: "",
    plot_type: "",
    commercial_type: "",
    builtup_area_sqft: "",
    property_images: [],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const selectedDetailFields =
    propertyDetailFields[formData.property_type] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "property_type") {
      setFormData({
        ...formData,
        property_type: value,

        bedrooms: "",
        bathrooms: "",
        area_sqft: "",
        total_rooms: "",
        floors: "",
        floor_number: "",
        total_floors: "",
        furnishing: "",
        parking: "",
        total_cent: "",
        price_per_cent: "",
        road_access: "",
        plot_type: "",
        commercial_type: "",
        builtup_area_sqft: "",
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageSelection = (event) => {
    const pickedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (pickedFiles.length === 0) return;

    const imageFiles = pickedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length !== pickedFiles.length) {
      setSnackbar({
        open: true,
        message: "Only image files are allowed.",
        severity: "warning",
      });
    }

    const uniqueImages = imageFiles.filter(
      (newImage) =>
        !formData.property_images.some(
          (currentImage) =>
            currentImage.name === newImage.name &&
            currentImage.size === newImage.size &&
            currentImage.lastModified === newImage.lastModified,
        ),
    );

    const availableSlots =
      MAX_PROPERTY_IMAGES - formData.property_images.length;

    if (availableSlots <= 0) {
      setSnackbar({
        open: true,
        message: `Maximum ${MAX_PROPERTY_IMAGES} images are allowed.`,
        severity: "warning",
      });
      return;
    }

    const acceptedImages = uniqueImages.slice(0, availableSlots);

    setFormData((previous) => ({
      ...previous,
      property_images: [...previous.property_images, ...acceptedImages],
    }));

    if (uniqueImages.length > availableSlots) {
      setSnackbar({
        open: true,
        message: `Only ${availableSlots} more image${
          availableSlots === 1 ? "" : "s"
        } can be added. Maximum limit is ${MAX_PROPERTY_IMAGES}.`,
        severity: "warning",
      });
    }
  };

  const removeImage = (index) => {
    setFormData((previous) => ({
      ...previous,
      property_images: previous.property_images.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));
  };

  const validateDetails = () => {
    for (const field of selectedDetailFields) {
      const value = formData[field.name];
      if (field.type === "number" && value !== "" && value !== undefined) {
        if (Number(value) < 0) {
          return `${field.label} cannot be negative.`;
        }
      }
    }

    if (Number(formData.price) < 0) {
      return "Price cannot be negative.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateDetails();

    if (formData.property_images.length === 0) {
      setSnackbar({
        open: true,
        message: "Please select at least one property image.",
        severity: "warning",
      });
      return;
    }

    if (formData.property_images.length > MAX_PROPERTY_IMAGES) {
      setSnackbar({
        open: true,
        message: `Maximum ${MAX_PROPERTY_IMAGES} images are allowed.`,
        severity: "warning",
      });
      return;
    }

    if (validationError) {
      setSnackbar({
        open: true,
        message: validationError,
        severity: "error",
      });
      return;
    }

    setSubmitLoading(true);

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("property_type", formData.property_type);
    data.append("listing_type", formData.listing_type);
    data.append("price", formData.price);
    data.append("location", formData.location);

    if (formData.address) {
      data.append("address", formData.address);
    }

    selectedDetailFields.forEach((field) => {
      const value = formData[field.name];

      if (value !== "" && value !== null && value !== undefined) {
        data.append(field.name, value);
      }
    });
    const selectedImages = formData.property_images.filter((image) => image);

    if (selectedImages.length > 0) {
      data.append("main_image", selectedImages[0]);

      selectedImages.slice(1).forEach((image) => {
        data.append("gallery_images", image);
      });
    }

    try {
      const response = await axiosInstance.post(
        "/properties/my-properties/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setSnackbar({
        open: true,
        message: response.data.message || "Property submitted successfully.",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);

      const apiError = err.response?.data;

      setSnackbar({
        open: true,
        message:
          typeof apiError === "object" && apiError !== null
            ? Object.values(apiError).flat().join(" ")
            : apiError || "Failed to add property.",
        severity: "error",
      });
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
        borderColor: "#94a3b8",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#059669",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#667085",
      fontSize: 14,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#059669",
    },
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          <Card
            elevation={0}
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: 3,
              bgcolor: "#ffffff",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: { xs: 2.5, md: 4 },
                py: { xs: 2.5, md: 3 },
                borderBottom: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 34 },
                  fontWeight: 800,
                  color: "#1f2937",
                  letterSpacing: "-0.4px",
                }}
              >
                Add Property
              </Typography>

              <Typography color="#667085" sx={{ mt: 0.7 }}>
                Fill in the property information and submit it for admin
                approval.
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={3.5}>
                  <Box>
                    <SectionTitle>Basic Information</SectionTitle>

                    <Stack spacing={2}>
                      <TextField
                        label="Property Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputStyle}
                      />

                      <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        sx={inputStyle}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <SectionTitle>Listing Information</SectionTitle>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        select
                        label="Property Type"
                        name="property_type"
                        value={formData.property_type}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputStyle}
                      >
                        <MenuItem value="house">House</MenuItem>
                        <MenuItem value="villa">Villa</MenuItem>
                        <MenuItem value="apartment">Apartment</MenuItem>
                        <MenuItem value="land">Land</MenuItem>
                        <MenuItem value="commercial">Commercial</MenuItem>
                      </TextField>

                      <TextField
                        select
                        label="Listing Type"
                        name="listing_type"
                        value={formData.listing_type}
                        onChange={handleChange}
                        fullWidth
                        required
                        sx={inputStyle}
                      >
                        <MenuItem value="sale">Sale</MenuItem>
                        <MenuItem value="rent">Rent</MenuItem>
                      </TextField>
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <SectionTitle>Price and Location</SectionTitle>

                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="Price"
                          name="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          fullWidth
                          required
                          inputProps={{ min: 0 }}
                          sx={inputStyle}
                        />

                        <TextField
                          label="Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          fullWidth
                          required
                          sx={inputStyle}
                        />
                      </Stack>

                      <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        sx={inputStyle}
                      />
                    </Stack>
                  </Box>

                  <Divider />

                  <Box>
                    <SectionTitle>
                      {formData.property_type
                        ? `${formData.property_type} Details`
                        : "Property Details"}
                    </SectionTitle>

                    {!formData.property_type ? (
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                        }}
                      >
                        <Typography color="#667085" fontSize={14}>
                          Please select a property type to show related details.
                        </Typography>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                          },
                          gap: 2,
                        }}
                      >
                        {selectedDetailFields.map((field) => (
                          <TextField
                            key={field.name}
                            select={field.type === "select"}
                            label={field.label}
                            name={field.name}
                            type={
                              field.type === "select" ? undefined : field.type
                            }
                            value={formData[field.name] || ""}
                            onChange={handleDetailsChange}
                            fullWidth
                            inputProps={
                              field.type === "number" ? { min: 0 } : undefined
                            }
                            sx={inputStyle}
                          >
                            {field.type === "select" &&
                              field.options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                          </TextField>
                        ))}
                      </Box>
                    )}
                  </Box>

                  <Divider />

                  <Box>
                    <SectionTitle>Property Images</SectionTitle>

                    <Box
                      sx={{
                        border: "1px solid #e4e7ec",
                        borderRadius: "18px",
                        bgcolor: "#ffffff",
                        p: { xs: 2, sm: 2.4 },
                        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.035)",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        gap={1.2}
                        sx={{
                          mb: 1.8,
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            minWidth: 0,
                            flex: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#101828",
                              fontSize: 14.5,
                              fontWeight: 800,
                              lineHeight: 1.35,
                            }}
                          >
                            Upload property photos
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.4,
                              color: "#667085",
                              fontSize: 12.7,
                              lineHeight: 1.55,
                            }}
                          >
                            Select up to {MAX_PROPERTY_IMAGES} images together.
                            The first image becomes the main image.
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            ml: { xs: 0, sm: "auto" },
                            flexShrink: 0,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.55,
                            px: 1.15,
                            py: 0.65,
                            borderRadius: "10px",
                            bgcolor:
                              formData.property_images.length ===
                              MAX_PROPERTY_IMAGES
                                ? "#fef3f2"
                                : "#ecfdf3",
                            border:
                              formData.property_images.length ===
                              MAX_PROPERTY_IMAGES
                                ? "1px solid #fecdca"
                                : "1px solid #abefc6",
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                formData.property_images.length ===
                                MAX_PROPERTY_IMAGES
                                  ? "#b42318"
                                  : "#067647",
                              fontSize: 12.5,
                              fontWeight: 850,
                              lineHeight: 1,
                            }}
                          >
                            {formData.property_images.length}/
                            {MAX_PROPERTY_IMAGES}
                          </Typography>

                          <Typography
                            sx={{
                              color:
                                formData.property_images.length ===
                                MAX_PROPERTY_IMAGES
                                  ? "#b42318"
                                  : "#067647",
                              fontSize: 11.8,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            selected
                          </Typography>
                        </Box>
                      </Stack>

                      <Box
                        component="label"
                        sx={{
                          minHeight: { xs: 116, sm: 92 },
                          borderRadius: "14px",
                          border: "1.5px dashed",
                          borderColor:
                            formData.property_images.length >=
                            MAX_PROPERTY_IMAGES
                              ? "#d0d5dd"
                              : "#86d7b4",
                          bgcolor:
                            formData.property_images.length >=
                            MAX_PROPERTY_IMAGES
                              ? "#f8fafc"
                              : "#f7fcfa",
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: { xs: 1.5, sm: 2 },
                          px: { xs: 2, sm: 2.2 },
                          py: { xs: 2, sm: 1.7 },
                          cursor:
                            formData.property_images.length >=
                            MAX_PROPERTY_IMAGES
                              ? "not-allowed"
                              : "pointer",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor:
                              formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "#f8fafc"
                                : "#effaf5",
                            borderColor:
                              formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "#d0d5dd"
                                : "#34b27b",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.4}
                          sx={{
                            width: { xs: "100%", sm: "auto" },
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: 45,
                              height: 45,
                              flexShrink: 0,
                              borderRadius: "13px",
                              bgcolor:
                                formData.property_images.length >=
                                MAX_PROPERTY_IMAGES
                                  ? "#f2f4f7"
                                  : "#dcfce7",
                              color:
                                formData.property_images.length >=
                                MAX_PROPERTY_IMAGES
                                  ? "#98a2b3"
                                  : "#047857",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            <CloudUploadOutlinedIcon sx={{ fontSize: 25 }} />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                color:
                                  formData.property_images.length >=
                                  MAX_PROPERTY_IMAGES
                                    ? "#98a2b3"
                                    : "#344054",
                                fontSize: 13.8,
                                fontWeight: 800,
                              }}
                            >
                              {formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "Maximum image limit reached"
                                : formData.property_images.length > 0
                                  ? "Add more images"
                                  : "Choose property images"}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.3,
                                color: "#98a2b3",
                                fontSize: 11.8,
                              }}
                            >
                              JPG, PNG or WEBP · Select multiple files
                            </Typography>
                          </Box>
                        </Stack>

                        <Box
                          sx={{
                            flexShrink: 0,
                            width: { xs: "100%", sm: "auto" },
                            px: 1.8,
                            py: 0.9,
                            borderRadius: "10px",
                            bgcolor:
                              formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "#f2f4f7"
                                : "#047857",
                            color:
                              formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "#98a2b3"
                                : "#ffffff",
                            textAlign: "center",
                            fontSize: 12.5,
                            fontWeight: 800,
                            boxShadow:
                              formData.property_images.length >=
                              MAX_PROPERTY_IMAGES
                                ? "none"
                                : "0 5px 14px rgba(4,120,87,0.18)",
                          }}
                        >
                          Browse Images
                        </Box>

                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*"
                          disabled={
                            formData.property_images.length >=
                            MAX_PROPERTY_IMAGES
                          }
                          onChange={handleImageSelection}
                        />
                      </Box>

                      {formData.property_images.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ mb: 1.2 }}
                          >
                            <Typography
                              sx={{
                                color: "#344054",
                                fontSize: 13,
                                fontWeight: 800,
                              }}
                            >
                              Selected images
                            </Typography>

                            <Typography
                              sx={{
                                color: "#98a2b3",
                                fontSize: 11.5,
                              }}
                            >
                              Click × to remove
                            </Typography>
                          </Stack>

                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: {
                                xs: "repeat(2, minmax(0, 1fr))",
                                sm: "repeat(3, minmax(0, 1fr))",
                              },
                              gap: 1.4,
                            }}
                          >
                            {formData.property_images.map((image, index) => (
                              <SelectedImagePreview
                                key={`${image.name}-${image.size}-${image.lastModified}`}
                                image={image}
                                index={index}
                                onRemove={removeImage}
                              />
                            ))}
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      pt: 1,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitLoading}
                      sx={{
                        minWidth: { xs: "100%" },
                        py: 1.35,
                        borderRadius: 2,
                        bgcolor: "#065f46",
                        fontWeight: 800,
                        textTransform: "none",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#047857",
                          boxShadow: "none",
                        },
                      }}
                    >
                      {submitLoading ? "Submitting..." : "Submit Property"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
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

export default AddProperty;
