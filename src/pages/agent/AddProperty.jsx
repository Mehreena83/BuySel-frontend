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
property_images: [null],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

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
  const updatedImages = formData.property_images.filter((_, i) => i !== index);

  setFormData({
    ...formData,
    property_images: updatedImages.length > 0 ? updatedImages : [null],
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "property_images" && formData[key] !== "") {
        data.append(key, formData[key]);
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
                    <SectionTitle>Property Details</SectionTitle>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <TextField
                        label="Bedrooms"
                        name="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        fullWidth
                        sx={inputStyle}
                      />

                      <TextField
                        label="Bathrooms"
                        name="bathrooms"
                        type="number"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        fullWidth
                        sx={inputStyle}
                      />

                      <TextField
                        label="Area Sqft"
                        name="area_sqft"
                        type="number"
                        value={formData.area_sqft}
                        onChange={handleChange}
                        fullWidth
                        sx={inputStyle}
                      />
                    </Stack>
                  </Box>

                  <Divider />


                  {/* <Box>
                    <SectionTitle>Property Images</SectionTitle>

                    <Box
                      sx={{
                        border: "1px dashed #bbf7d0",
                        borderRadius: 3,
                        bgcolor: "#f0fdf4",
                        p: 2.5,
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadOutlinedIcon />}
                        sx={{
                          py: 1.1,
                          px: 3,
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          color: "#047857",
                          borderColor: "#bbf7d0",
                          bgcolor: "#ffffff",
                          "&:hover": {
                            bgcolor: "#ecfdf5",
                            borderColor: "#86efac",
                          },
                        }}
                      >
                        Upload Property Images
                        <input
                          type="file"
                          name="property_images"
                          hidden
                          multiple
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </Button>

                      <Typography
                        color="#667085"
                        fontSize={13}
                        sx={{ mt: 1.2 }}
                      >
                        Select multiple images. First selected image will be the
                        main image.
                      </Typography>

                      {formData.property_images.length > 0 && (
                        <Stack spacing={0.7} sx={{ mt: 1.5 }}>
                          {formData.property_images.map((file, index) => (
                            <Typography
                              key={index}
                              color="#344054"
                              fontSize={14}
                              fontWeight={700}
                              sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {index + 1}. {file.name}
                              {index === 0
                                ? "  - Main Image"
                                : "  - Gallery Image"}
                            </Typography>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Box> */}

                  <Box>
  <SectionTitle>Property Images</SectionTitle>

  <Box
    sx={{
      border: "1px dashed #bbf7d0",
      borderRadius: 3,
      bgcolor: "#f0fdf4",
      p: 2.5,
    }}
  >
    <Typography color="#667085" fontSize={13} sx={{ mb: 2 }}>
      Add images one by one. Image 1 will be used as the main image.
    </Typography>

    <Stack spacing={2}>
      {formData.property_images.map((image, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "#ffffff",
            border: "1px solid #d1fae5",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography fontWeight={900} color="#064e3b">
                Image {index + 1}
                {index === 0 ? " - Main Image" : " - Gallery Image"}
              </Typography>

              <Typography color="#667085" fontSize={12.5} sx={{ mt: 0.3 }}>
                {index === 0
                  ? "This image will show first in property cards."
                  : "This image will show in property gallery."}
              </Typography>

              {image && (
                <Typography
                  color="#344054"
                  fontSize={13}
                  fontWeight={700}
                  sx={{
                    mt: 0.7,
                    maxWidth: 340,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Selected: {image.name}
                </Typography>
              )}
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadOutlinedIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 800,
                  color: "#047857",
                  borderColor: "#bbf7d0",
                  bgcolor: "#ffffff",
                  "&:hover": {
                    bgcolor: "#ecfdf5",
                    borderColor: "#86efac",
                  },
                }}
              >
                Choose File
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
                  onClick={() => removeImageField(index)}
                  sx={{
                    minWidth: 42,
                    borderRadius: 2,
                    color: "#dc2626",
                    fontWeight: 900,
                    bgcolor: "#fef2f2",
                    "&:hover": {
                      bgcolor: "#fee2e2",
                    },
                  }}
                >
                  ×
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      ))}
    </Stack>

    <Button
      type="button"
      onClick={addImageField}
      sx={{
        mt: 2,
        textTransform: "none",
        fontWeight: 900,
        color: "#047857",
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
