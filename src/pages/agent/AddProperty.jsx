import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import axiosInstance from "../../api/axiosInstance";
import AppSnackbar from "../../components/common/AppSnackbar";

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
    property_images: [null],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [submitLoading, setSubmitLoading] = useState(false);

  const selectedDetailFields =
    propertyDetailFields[formData.property_type] || [];

  const handleChange = (e, index = null) => {
    const { name, value, files } = e.target;

    if (name === "property_images") {
      const updatedImages = [...formData.property_images];
      updatedImages[index] = files[0];

      setFormData({
        ...formData,
        property_images: updatedImages,
      });

      return;
    }
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

  const addImageField = () => {
    setFormData({
      ...formData,
      property_images: [...formData.property_images, null],
    });
  };

  const removeImageField = (index) => {
    const updatedImages = formData.property_images.filter(
      (_, i) => i !== index,
    );

    setFormData({
      ...formData,
      property_images: updatedImages.length > 0 ? updatedImages : [null],
    });
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
          <Button
            component={Link}
            to="/dashboard"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#475467",
              fontWeight: 700,
              textTransform: "none",
              mb: 3,
            }}
          >
            Back to Dashboard
          </Button>

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
                        border: "1px solid #e5e7eb",
                        borderRadius: 3,
                        bgcolor: "#ffffff",
                        p: { xs: 1.8, sm: 2 },
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#667085",
                          fontSize: 13.5,
                          mb: 2,
                          lineHeight: 1.6,
                        }}
                      >
                        First image will be the main image. Add more images for
                        gallery.
                      </Typography>

                      <Stack spacing={1.2}>
                        {formData.property_images.map((image, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "stretch", sm: "center" },
                              justifyContent: "space-between",
                              gap: { xs: 1.2, sm: 1.5 },
                              p: { xs: 1.4, sm: 1.6 },
                              borderRadius: 2,
                              border: "1px solid #e5e7eb",
                              bgcolor: index === 0 ? "#f0fdf4" : "#f8fafc",
                            }}
                          >
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: "#1f2937",
                                }}
                              >
                                {index === 0
                                  ? "Main Image"
                                  : `Gallery Image ${index}`}
                              </Typography>

                              <Typography
                                sx={{
                                  color: image ? "#475467" : "#98a2b3",
                                  fontSize: 12.5,
                                  mt: 0.3,
                                  maxWidth: "100%",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {image ? image.name : "No image selected"}
                              </Typography>
                            </Box>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{
                                flexShrink: 0,
                                justifyContent: {
                                  xs: "flex-end",
                                  sm: "flex-start",
                                },
                                width: { xs: "100%", sm: "auto" },
                              }}
                            >
                              <Button
                                component="label"
                                size="small"
                                startIcon={<CloudUploadOutlinedIcon />}
                                sx={{
                                  minWidth: 92,
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 500,
                                  color: "#047857",
                                  bgcolor: "#ffffff",
                                  border: "1px solid #bbf7d0",
                                  px: 1.6,
                                  "& .MuiButton-startIcon": {
                                    mr: 0.6,
                                  },
                                  "& .MuiButton-startIcon svg": {
                                    fontSize: "17px",
                                  },
                                  "&:hover": {
                                    bgcolor: "#ecfdf5",
                                    borderColor: "#86efac",
                                  },
                                }}
                              >
                                Upload
                                <input
                                  type="file"
                                  name="property_images"
                                  hidden
                                  accept="image/*"
                                  onChange={(e) => handleChange(e, index)}
                                />
                              </Button>

                              {formData.property_images.length > 1 && (
                                <Button
                                  type="button"
                                  size="small"
                                  onClick={() => removeImageField(index)}
                                  sx={{
                                    minWidth: 36,
                                    borderRadius: 2,
                                    color: "#dc2626",
                                    bgcolor: "#ffffff",
                                    border: "1px solid #fecaca",
                                    fontWeight: 600,
                                    "&:hover": {
                                      bgcolor: "#fef2f2",
                                      borderColor: "#fca5a5",
                                    },
                                  }}
                                >
                                  ×
                                </Button>
                              )}
                            </Stack>
                          </Box>
                        ))}
                      </Stack>

                      <Button
                        type="button"
                        onClick={addImageField}
                        sx={{
                          mt: 1.8,
                          width: "100%",
                          py: 1.1,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 500,
                          color: "#047857",
                          bgcolor: "#f0fdf4",
                          border: "1px dashed #86efac",
                          "&:hover": {
                            bgcolor: "#dcfce7",
                          },
                        }}
                      >
                        + Add another image
                      </Button>
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
