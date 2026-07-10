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
property_images: [],
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (name === "property_images") {
    setFormData({
      ...formData,
      property_images: Array.from(files),
    });
    return;
  }

  setFormData({
    ...formData,
    [name]: value,
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

if (formData.property_images.length > 0) {
  data.append("main_image", formData.property_images[0]);

  formData.property_images.slice(1).forEach((image) => {
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
                    <SectionTitle>Property Image</SectionTitle>

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
                        Upload Main Image
                        <input
                          type="file"
                          name="main_image"
                          hidden
                          accept="image/*"
                          onChange={handleChange}
                        />
                      </Button>

                      <Typography
                        color="#667085"
                        fontSize={13}
                        sx={{ mt: 1.2 }}
                      >
                        PNG, JPG or JPEG image supported
                      </Typography>

                      {formData.main_image && (
                        <Typography
                          color="#344054"
                          fontSize={14}
                          fontWeight={700}
                          sx={{
                            mt: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          Selected: {formData.main_image.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      border: "1px dashed #bfdbfe",
                      borderRadius: 3,
                      bgcolor: "#eff6ff",
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
                        color: "#1d4ed8",
                        borderColor: "#bfdbfe",
                        bgcolor: "#ffffff",
                        "&:hover": {
                          bgcolor: "#dbeafe",
                          borderColor: "#93c5fd",
                        },
                      }}
                    >
                      Upload Gallery Images
                      <input
                        type="file"
                        name="gallery_images"
                        hidden
                        multiple
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </Button>

                    <Typography color="#667085" fontSize={13} sx={{ mt: 1.2 }}>
                      You can select multiple property images
                    </Typography>

                    {formData.gallery_images.length > 0 && (
                      <Stack spacing={0.7} sx={{ mt: 1.5 }}>
                        {formData.gallery_images.map((file, index) => (
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
                          </Typography>
                        ))}
                      </Stack>
                    )}
                  </Box> */}
<Box>
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

    <Typography color="#667085" fontSize={13} sx={{ mt: 1.2 }}>
      Select multiple images. First selected image will be the main image.
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
            {index === 0 ? "  - Main Image" : "  - Gallery Image"}
          </Typography>
        ))}
      </Stack>
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
