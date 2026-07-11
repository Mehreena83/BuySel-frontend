// import { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Divider,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import AppSnackbar from "../../components/common/AppSnackbar";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import axiosInstance from "../../api/axiosInstance";

// const SectionTitle = ({ children }) => (
//   <Stack direction="row" alignItems="center" spacing={1.2} sx={{ mb: 2 }}>
//     <Box
//       sx={{
//         width: 5,
//         height: 20,
//         borderRadius: 2,
//         bgcolor: "#059669",
//       }}
//     />

//     <Typography
//       sx={{
//         fontSize: 16,
//         fontWeight: 800,
//         color: "#1f2937",
//       }}
//     >
//       {children}
//     </Typography>
//   </Stack>
// );

// function EditProperty() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     property_type: "",
//     listing_type: "",
//     price: "",
//     location: "",
//     address: "",
//     bedrooms: "",
//     bathrooms: "",
//     area_sqft: "",
//     main_image: null,
//   });

//   const [oldImage, setOldImage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [submitLoading, setSubmitLoading] = useState(false);
//   const [pageError, setPageError] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const response = await axiosInstance.get(
//           `/properties/my-properties/${id}/`,
//         );

//         setFormData({
//           title: response.data.title || "",
//           description: response.data.description || "",
//           property_type: response.data.property_type || "",
//           listing_type: response.data.listing_type || "",
//           price: response.data.price || "",
//           location: response.data.location || "",
//           address: response.data.address || "",
//           bedrooms: response.data.bedrooms || "",
//           bathrooms: response.data.bathrooms || "",
//           area_sqft: response.data.area_sqft || "",
//           main_image: null,
//         });

//         setOldImage(response.data.main_image || "");
//       } catch (err) {
//         setPageError("Failed to load property.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProperty();
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;

//     setFormData({
//       ...formData,
//       [name]: files ? files[0] : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setSubmitLoading(true);

//     const data = new FormData();

//     Object.keys(formData).forEach((key) => {
//       if (key === "main_image") {
//         if (formData.main_image) {
//           data.append("main_image", formData.main_image);
//         }
//       } else {
//         data.append(key, formData[key]);
//       }
//     });

//     try {
//       await axiosInstance.put(`/properties/my-properties/${id}/`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSnackbar({
//         open: true,
//         message: "Property updated successfully. Status changed to pending.",
//         severity: "success",
//       });
//       setTimeout(() => {
//         navigate("/my-properties");
//       }, 1000);
//     } catch (err) {
//       console.log("STATUS:", err.response?.status);
//       console.log("DATA:", err.response?.data);

//       const apiError = err.response?.data;

//       setSnackbar({
//         open: true,
//         message:
//           typeof apiError === "object" && apiError !== null
//             ? Object.values(apiError).flat().join(" ")
//             : apiError || "Failed to update property.",
//         severity: "error",
//       });
//     } finally {
//       setSubmitLoading(false);
//     }
//   };

//   const inputStyle = {
//     "& .MuiOutlinedInput-root": {
//       borderRadius: 2,
//       bgcolor: "#ffffff",
//       fontSize: 14,
//       "& fieldset": {
//         borderColor: "#d0d5dd",
//       },
//       "&:hover fieldset": {
//         borderColor: "#94a3b8",
//       },
//       "&.Mui-focused fieldset": {
//         borderColor: "#059669",
//       },
//     },
//     "& .MuiInputLabel-root": {
//       color: "#667085",
//       fontSize: 14,
//     },
//     "& .MuiInputLabel-root.Mui-focused": {
//       color: "#059669",
//     },
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           minHeight: "100vh",
//           bgcolor: "#f8fafc",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         <CircularProgress sx={{ color: "#065f46" }} />
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           bgcolor: "#f8fafc",
//           py: { xs: 3, md: 5 },
//         }}
//       >
//         <Container maxWidth="md">
//           <Button
//             component={Link}
//             to="/my-properties"
//             startIcon={<ArrowBackIcon />}
//             sx={{
//               color: "#475467",
//               fontWeight: 700,
//               textTransform: "none",
//               mb: 3,
//             }}
//           >
//             Back to My Properties
//           </Button>

//           <Card
//             elevation={0}
//             sx={{
//               border: "1px solid #e5e7eb",
//               borderRadius: 3,
//               bgcolor: "#ffffff",
//               overflow: "hidden",
//             }}
//           >
//             <Box
//               sx={{
//                 px: { xs: 2.5, md: 4 },
//                 py: { xs: 2.5, md: 3 },
//                 borderBottom: "1px solid #e5e7eb",
//                 bgcolor: "#ffffff",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: { xs: 28, md: 34 },
//                   fontWeight: 800,
//                   color: "#1f2937",
//                   letterSpacing: "-0.4px",
//                 }}
//               >
//                 Edit Property
//               </Typography>

//               <Typography color="#667085" sx={{ mt: 0.7 }}>
//                 Update your property details. After editing, admin approval is
//                 required again.
//               </Typography>
//             </Box>

//             <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
//               {pageError && (
//                 <Typography
//                   sx={{
//                     mb: 3,
//                     p: 2,
//                     borderRadius: 2,
//                     bgcolor: "#fef2f2",
//                     color: "#b91c1c",
//                     fontWeight: 700,
//                     border: "1px solid #fecaca",
//                   }}
//                 >
//                   {pageError}
//                 </Typography>
//               )}

//               <Box component="form" onSubmit={handleSubmit}>
//                 <Stack spacing={3.5}>
//                   <Box>
//                     <SectionTitle>Basic Information</SectionTitle>

//                     <Stack spacing={2}>
//                       <TextField
//                         label="Property Title"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleChange}
//                         fullWidth
//                         required
//                         sx={inputStyle}
//                       />

//                       <TextField
//                         label="Description"
//                         name="description"
//                         value={formData.description}
//                         onChange={handleChange}
//                         multiline
//                         rows={4}
//                         fullWidth
//                         required
//                         sx={inputStyle}
//                       />
//                     </Stack>
//                   </Box>

//                   <Divider />

//                   <Box>
//                     <SectionTitle>Listing Information</SectionTitle>

//                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                       <TextField
//                         select
//                         label="Property Type"
//                         name="property_type"
//                         value={formData.property_type}
//                         onChange={handleChange}
//                         fullWidth
//                         required
//                         sx={inputStyle}
//                       >
//                         <MenuItem value="house">House</MenuItem>
//                         <MenuItem value="villa">Villa</MenuItem>
//                         <MenuItem value="apartment">Apartment</MenuItem>
//                         <MenuItem value="land">Land</MenuItem>
//                         <MenuItem value="commercial">Commercial</MenuItem>
//                       </TextField>

//                       <TextField
//                         select
//                         label="Listing Type"
//                         name="listing_type"
//                         value={formData.listing_type}
//                         onChange={handleChange}
//                         fullWidth
//                         required
//                         sx={inputStyle}
//                       >
//                         <MenuItem value="sale">Sale</MenuItem>
//                         <MenuItem value="rent">Rent</MenuItem>
//                       </TextField>
//                     </Stack>
//                   </Box>

//                   <Divider />

//                   <Box>
//                     <SectionTitle>Price and Location</SectionTitle>

//                     <Stack spacing={2}>
//                       <Stack
//                         direction={{ xs: "column", sm: "row" }}
//                         spacing={2}
//                       >
//                         <TextField
//                           label="Price"
//                           name="price"
//                           type="number"
//                           value={formData.price}
//                           onChange={handleChange}
//                           fullWidth
//                           required
//                           sx={inputStyle}
//                         />

//                         <TextField
//                           label="Location"
//                           name="location"
//                           value={formData.location}
//                           onChange={handleChange}
//                           fullWidth
//                           required
//                           sx={inputStyle}
//                         />
//                       </Stack>

//                       <TextField
//                         label="Address"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleChange}
//                         multiline
//                         rows={2}
//                         fullWidth
//                         sx={inputStyle}
//                       />
//                     </Stack>
//                   </Box>

//                   <Divider />

//                   <Box>
//                     <SectionTitle>Property Details</SectionTitle>

//                     <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                       <TextField
//                         label="Bedrooms"
//                         name="bedrooms"
//                         type="number"
//                         value={formData.bedrooms}
//                         onChange={handleChange}
//                         fullWidth
//                         sx={inputStyle}
//                       />

//                       <TextField
//                         label="Bathrooms"
//                         name="bathrooms"
//                         type="number"
//                         value={formData.bathrooms}
//                         onChange={handleChange}
//                         fullWidth
//                         sx={inputStyle}
//                       />

//                       <TextField
//                         label="Area Sqft"
//                         name="area_sqft"
//                         type="number"
//                         value={formData.area_sqft}
//                         onChange={handleChange}
//                         fullWidth
//                         sx={inputStyle}
//                       />
//                     </Stack>
//                   </Box>

//                   <Divider />

//                   <Box>
//                     <SectionTitle>Property Image</SectionTitle>

//                     {oldImage && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography
//                           color="#475467"
//                           fontSize={14}
//                           fontWeight={700}
//                           sx={{ mb: 1 }}
//                         >
//                           Current Image
//                         </Typography>

//                         <Box
//                           component="img"
//                           src={oldImage}
//                           alt="Current property"
//                           sx={{
//                             width: "100%",
//                             maxHeight: 260,
//                             objectFit: "cover",
//                             borderRadius: 3,
//                             border: "1px solid #e5e7eb",
//                           }}
//                         />
//                       </Box>
//                     )}

//                     <Box
//                       sx={{
//                         border: "1px dashed #bbf7d0",
//                         borderRadius: 3,
//                         bgcolor: "#f0fdf4",
//                         p: 2.5,
//                         textAlign: "center",
//                       }}
//                     >
//                       <Button
//                         variant="outlined"
//                         component="label"
//                         startIcon={<CloudUploadOutlinedIcon />}
//                         sx={{
//                           py: 1.1,
//                           px: 3,
//                           borderRadius: 2,
//                           textTransform: "none",
//                           fontWeight: 700,
//                           color: "#047857",
//                           borderColor: "#bbf7d0",
//                           bgcolor: "#ffffff",
//                           "&:hover": {
//                             bgcolor: "#ecfdf5",
//                             borderColor: "#86efac",
//                           },
//                         }}
//                       >
//                         Upload New Image
//                         <input
//                           type="file"
//                           name="main_image"
//                           hidden
//                           accept="image/*"
//                           onChange={handleChange}
//                         />
//                       </Button>

//                       <Typography
//                         color="#667085"
//                         fontSize={13}
//                         sx={{ mt: 1.2 }}
//                       >
//                         Leave empty to keep current image. PNG, JPG or JPEG
//                         image supported.
//                       </Typography>

//                       {formData.main_image && (
//                         <Typography
//                           color="#344054"
//                           fontSize={14}
//                           fontWeight={700}
//                           sx={{
//                             mt: 1,
//                             overflow: "hidden",
//                             textOverflow: "ellipsis",
//                             whiteSpace: "nowrap",
//                           }}
//                         >
//                           Selected: {formData.main_image.name}
//                         </Typography>
//                       )}
//                     </Box>
//                   </Box>

//                   <Box
//                     sx={{
//                       pt: 1,
//                       display: "flex",
//                       justifyContent: "flex-end",
//                     }}
//                   >
//                     <Button
//                       type="submit"
//                       variant="contained"
//                       disabled={submitLoading}
//                       sx={{
//                         minWidth: { xs: "100%" },
//                         py: 1.35,
//                         borderRadius: 2,
//                         bgcolor: "#065f46",
//                         fontWeight: 800,
//                         textTransform: "none",
//                         boxShadow: "none",
//                         "&:hover": {
//                           bgcolor: "#047857",
//                           boxShadow: "none",
//                         },
//                       }}
//                     >
//                       {submitLoading ? "Updating..." : "Update Property"}
//                     </Button>
//                   </Box>
//                 </Stack>
//               </Box>
//             </CardContent>
//           </Card>
//         </Container>
//       </Box>
//       <AppSnackbar
//         open={snackbar.open}
//         message={snackbar.message}
//         severity={snackbar.severity}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       />
//     </>
//   );
// }

// export default EditProperty;


import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppSnackbar from "../../components/common/AppSnackbar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import axiosInstance from "../../api/axiosInstance";

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
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

const getImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image}`;
};

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "",
    listing_type: "",
    price: "",
    location: "",
    address: "",
    details: {},
    main_image: null,
  });

  const [oldImage, setOldImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const selectedDetailFields =
    propertyDetailFields[formData.property_type] || [];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get(
          `/properties/my-properties/${id}/`,
        );

        setFormData({
          title: response.data.title || "",
          description: response.data.description || "",
          property_type: response.data.property_type || "",
          listing_type: response.data.listing_type || "",
          price: response.data.price || "",
          location: response.data.location || "",
          address: response.data.address || "",
          details: response.data.details || {},
          main_image: null,
        });

        setOldImage(response.data.main_image || "");
      } catch (err) {
        setPageError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "property_type") {
      setFormData({
        ...formData,
        property_type: value,
        details: {},
      });

      return;
    }

    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      details: {
        ...formData.details,
        [name]: value,
      },
    });
  };

  const validateDetails = () => {
    if (Number(formData.price) < 0) {
      return "Price cannot be negative.";
    }

    for (const field of selectedDetailFields) {
      const value = formData.details[field.name];

      if (field.type === "number" && value !== "" && value !== undefined) {
        if (Number(value) < 0) {
          return `${field.label} cannot be negative.`;
        }
      }
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
    data.append("address", formData.address || "");
    data.append("details", JSON.stringify(formData.details));

    if (formData.main_image) {
      data.append("main_image", formData.main_image);
    }

    try {
      await axiosInstance.put(`/properties/my-properties/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSnackbar({
        open: true,
        message: "Property updated successfully. Status changed to pending.",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/my-properties");
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
            : apiError || "Failed to update property.",
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

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#065f46" }} />
      </Box>
    );
  }

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
            to="/my-properties"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#475467",
              fontWeight: 700,
              textTransform: "none",
              mb: 3,
            }}
          >
            Back to My Properties
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
                Edit Property
              </Typography>

              <Typography color="#667085" sx={{ mt: 0.7 }}>
                Update your property details. After editing, admin approval is
                required again.
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
              {pageError && (
                <Typography
                  sx={{
                    mb: 3,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "#fef2f2",
                    color: "#b91c1c",
                    fontWeight: 700,
                    border: "1px solid #fecaca",
                  }}
                >
                  {pageError}
                </Typography>
              )}

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
    type={field.type === "select" ? undefined : field.type}
    value={formData.details[field.name] || ""}
    onChange={handleDetailsChange}
    fullWidth
    inputProps={field.type === "number" ? { min: 0 } : undefined}
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
                    <SectionTitle>Property Image</SectionTitle>

                    {oldImage && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          color="#475467"
                          fontSize={14}
                          fontWeight={700}
                          sx={{ mb: 1 }}
                        >
                          Current Image
                        </Typography>

                        <Box
                          component="img"
                          src={getImageUrl(oldImage)}
                          alt="Current property"
                          sx={{
                            width: "100%",
                            maxHeight: 260,
                            objectFit: "cover",
                            borderRadius: 3,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                      </Box>
                    )}

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
                        Upload New Image
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
                        Leave empty to keep current image. PNG, JPG or JPEG
                        image supported.
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
                      {submitLoading ? "Updating..." : "Update Property"}
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

export default EditProperty;