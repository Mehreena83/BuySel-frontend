// import { useEffect, useMemo, useState } from "react";
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CircularProgress,
//   Container,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   IconButton,
//   MenuItem,
//   Snackbar,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
// import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
// import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
// import dayjs from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { useNavigate } from "react-router-dom";
// import adminAxiosInstance from "../../api/adminAxiosInstance";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

// function AdminProperties() {
//   const navigate = useNavigate();

//   const [properties, setProperties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState(null);
//   const [error, setError] = useState("");

//   const [statusFilter, setStatusFilter] = useState("");
//   const [propertyTypeFilter, setPropertyTypeFilter] = useState("");
//   const [listingTypeFilter, setListingTypeFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedProperty, setSelectedProperty] = useState(null);

//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
//   const [rejectReason, setRejectReason] = useState("");
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [createLoading, setCreateLoading] = useState(false);
//   const [editingPropertyId, setEditingPropertyId] = useState(null);

//   const [existingMainImage, setExistingMainImage] = useState("");

//   const [existingGalleryImages, setExistingGalleryImages] = useState([]);

//   const [removeImageIds, setRemoveImageIds] = useState([]);

//   const isEditing = Boolean(editingPropertyId);
//   const initialPropertyForm = {
//     title: "",
//     description: "",
//     property_type: "",
//     listing_type: "",
//     price: "",
//     location: "",
//     address: "",
//     expires_at: "",
//     property_images: [null],
//     // House / Villa / Apartment
//     bedrooms: "",
//     bathrooms: "",
//     area_sqft: "",

//     // House / Villa
//     total_floors: "",
//     floors: "",
//     parking: "",
//     furnishing: "",

//     // Apartment
//     floor_number: "",

//     // Land
//     total_cent: "",
//     price_per_cent: "",
//     road_access: "",
//     plot_type: "",

//     // Commercial
//     commercial_type: "",
//     builtup_area_sqft: "",
//   };

//   const getMinimumExpiryDate = () => {
//     const now = new Date();
//     now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
//     return now.toISOString().slice(0, 16);
//   };

//   const [propertyForm, setPropertyForm] = useState(initialPropertyForm);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   const showSnackbar = (message, severity = "success") => {
//     setSnackbar({
//       open: true,
//       message,
//       severity,
//     });
//   };

//   const fetchProperties = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await adminAxiosInstance.get(
//         "/admin-panel/properties/",
//         {
//           params: {
//             status: statusFilter || undefined,
//             property_type: propertyTypeFilter || undefined,
//             listing_type: listingTypeFilter || undefined,
//           },
//         },
//       );

//       setProperties(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       console.error(err.response?.data || err.message);

//       if (err.response?.status === 401 || err.response?.status === 403) {
//         localStorage.removeItem("adminToken");
//         localStorage.removeItem("adminUser");
//         navigate("/admin-login");
//         return;
//       }

//       setError("Unable to load properties.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProperties();
//   }, [statusFilter, propertyTypeFilter, listingTypeFilter]);

//   const filteredProperties = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) return properties;

//     return properties.filter((property) => {
//       return (
//         property.title?.toLowerCase().includes(value) ||
//         property.location?.toLowerCase().includes(value) ||
//         property.agent_name?.toLowerCase().includes(value) ||
//         property.agent_email?.toLowerCase().includes(value)
//       );
//     });
//   }, [properties, search]);

//   const handleApprove = async (propertyId) => {
//     try {
//       setActionLoading(`approve-${propertyId}`);

//       const response = await adminAxiosInstance.patch(
//         `/admin-panel/properties/${propertyId}/approve/`,
//       );

//       setProperties((previous) =>
//         previous.map((property) =>
//           property.id === propertyId
//             ? {
//                 ...property,
//                 ...(response.data?.property || {}),
//                 status: "approved",
//               }
//             : property,
//         ),
//       );

//       showSnackbar(
//         response.data?.message || "Property approved successfully.",
//         "success",
//       );
//     } catch (err) {
//       console.error(err.response?.data || err.message);

//       showSnackbar(
//         err.response?.data?.message ||
//           err.response?.data?.detail ||
//           "Unable to approve property.",
//         "error",
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openRejectDialog = (property) => {
//     setSelectedProperty(property);
//     setRejectReason("");
//     setRejectDialogOpen(true);
//   };

//   const closeRejectDialog = () => {
//     if (actionLoading) return;

//     setRejectDialogOpen(false);
//     setSelectedProperty(null);
//     setRejectReason("");
//   };

//   const handleReject = async () => {
//     if (!selectedProperty) return;

//     if (!rejectReason.trim()) {
//       showSnackbar("Please enter a rejection reason.", "warning");
//       return;
//     }

//     try {
//       setActionLoading(`reject-${selectedProperty.id}`);

//       const response = await adminAxiosInstance.patch(
//         `/admin-panel/properties/${selectedProperty.id}/reject/`,
//         {
//           rejection_reason: rejectReason.trim(),
//         },
//       );

//       setProperties((previous) =>
//         previous.map((property) =>
//           property.id === selectedProperty.id
//             ? {
//                 ...property,
//                 ...(response.data?.property || {}),
//                 status: "rejected",
//                 rejection_reason: rejectReason.trim(),
//               }
//             : property,
//         ),
//       );

//       showSnackbar(
//         response.data?.message || "Property rejected successfully.",
//         "success",
//       );

//       setRejectDialogOpen(false);
//       setSelectedProperty(null);
//       setRejectReason("");
//     } catch (err) {
//       console.error(err.response?.data || err.message);

//       showSnackbar(
//         err.response?.data?.message ||
//           err.response?.data?.detail ||
//           "Unable to reject property.",
//         "error",
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openPropertyDetails = (property) => {
//     setSelectedProperty(property);
//     setDetailsOpen(true);
//   };

//   const closePropertyDetails = () => {
//     setDetailsOpen(false);
//     setSelectedProperty(null);
//   };

//   const openDeleteDialog = (property) => {
//     setSelectedProperty(property);
//     setDeleteDialogOpen(true);
//   };

//   const closeDeleteDialog = () => {
//     if (actionLoading) return;

//     setDeleteDialogOpen(false);
//     setSelectedProperty(null);
//   };

//   const handleDelete = async () => {
//     if (!selectedProperty) return;

//     try {
//       setActionLoading(`delete-${selectedProperty.id}`);

//       await adminAxiosInstance.delete(
//         `/admin-panel/properties/${selectedProperty.id}/`,
//       );

//       setProperties((previous) =>
//         previous.filter((property) => property.id !== selectedProperty.id),
//       );

//       showSnackbar("Property deleted successfully.", "success");

//       setDeleteDialogOpen(false);
//       setSelectedProperty(null);
//     } catch (err) {
//       console.error(err.response?.data || err.message);

//       if (err.response?.status === 401 || err.response?.status === 403) {
//         localStorage.removeItem("adminToken");
//         localStorage.removeItem("adminUser");
//         navigate("/admin-login");
//         return;
//       }

//       showSnackbar(
//         err.response?.data?.message ||
//           err.response?.data?.detail ||
//           "Unable to delete property.",
//         "error",
//       );
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const openCreateDialog = () => {
//     setEditingPropertyId(null);
//     setExistingMainImage("");
//     setExistingGalleryImages([]);
//     setRemoveImageIds([]);
//     setPropertyForm(initialPropertyForm);
//     setCreateDialogOpen(true);
//   };

//   const closeCreateDialog = () => {
//     if (createLoading) return;

//     setCreateDialogOpen(false);
//     setPropertyForm(initialPropertyForm);
//   };

//   const handlePropertyFormChange = (event) => {
//     const { name, value, files } = event.target;

//     if (name === "property_type") {
//       setPropertyForm((previous) => ({
//         ...previous,
//         property_type: value,

//         bedrooms: "",
//         bathrooms: "",
//         area_sqft: "",
//         total_floors: "",
//         parking: "",
//         furnishing: "",
//         floor_number: "",
//         price_per_cent: "",
//         road_access: "",
//         plot_type: "",
//         commercial_type: "",
//         floors: "",
//         total_cent: "",
//         builtup_area_sqft: "",
//       }));

//       return;
//     }

//     setPropertyForm((previous) => ({
//       ...previous,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handlePropertyImageChange = (event, index) => {
//     const selectedFile = event.target.files?.[0] || null;

//     setPropertyForm((previous) => {
//       const updatedImages = [...previous.property_images];
//       updatedImages[index] = selectedFile;

//       return {
//         ...previous,
//         property_images: updatedImages,
//       };
//     });
//   };

//   const addPropertyImageField = () => {
//     setPropertyForm((previous) => {
//       if (previous.property_images.length >= 8) {
//         showSnackbar("Maximum 8 property images are allowed.", "warning");

//         return previous;
//       }

//       return {
//         ...previous,
//         property_images: [...previous.property_images, null],
//       };
//     });
//   };

//   const removePropertyImageField = (index) => {
//     setPropertyForm((previous) => {
//       const updatedImages = previous.property_images.filter(
//         (_, imageIndex) => imageIndex !== index,
//       );

//       return {
//         ...previous,
//         property_images: updatedImages.length > 0 ? updatedImages : [null],
//       };
//     });
//   };

//   const handleCreateProperty = async () => {
//     if (
//       !propertyForm.title.trim() ||
//       !propertyForm.property_type ||
//       !propertyForm.listing_type ||
//       !propertyForm.price ||
//       !propertyForm.location.trim() ||
//       !propertyForm.expires_at
//     ) {
//       showSnackbar("Please complete all required property fields.", "warning");
//       return;
//     }

//     // Property type specific required field validation
//     if (propertyForm.property_type === "land" && !propertyForm.total_cent) {
//       showSnackbar("Please enter total land cents.", "warning");
//       return;
//     }

//     if (
//       propertyForm.property_type === "commercial" &&
//       (!propertyForm.commercial_type || !propertyForm.builtup_area_sqft)
//     ) {
//       showSnackbar("Please complete commercial property details.", "warning");
//       return;
//     }

//     try {
//       setCreateLoading(true);

//       const formData = new FormData();

//       // Common fields
//       formData.append("title", propertyForm.title.trim());
//       formData.append("description", propertyForm.description.trim());
//       formData.append("property_type", propertyForm.property_type);
//       formData.append("listing_type", propertyForm.listing_type);
//       formData.append("price", propertyForm.price);
//       formData.append("location", propertyForm.location.trim());
//       formData.append("address", propertyForm.address.trim());

//       formData.append("expires_at", propertyForm.expires_at);
//       // Property type specific optional fields
//       const optionalFields = [
//         "bedrooms",
//         "bathrooms",
//         "area_sqft",
//         "total_floors",
//         "floors",
//         "parking",
//         "furnishing",
//         "floor_number",
//         "total_cent",
//         "price_per_cent",
//         "road_access",
//         "plot_type",
//         "commercial_type",
//         "builtup_area_sqft",
//       ];

//       optionalFields.forEach((field) => {
//         const value = propertyForm[field];

//         if (value !== "" && value !== null && value !== undefined) {
//           formData.append(field, value);
//         }
//       });

//       const selectedImages = propertyForm.property_images.filter(
//         (image) => image instanceof File,
//       );
//       if (!isEditing && selectedImages.length === 0) {
//         showSnackbar("Please select at least one property image.", "warning");
//         return;
//       }

//       // First image is the main image
// if (selectedImages.length > 0) {
//   // First newly selected image replaces the main image
//   formData.append("main_image", selectedImages[0]);

//   // Remaining selected images become gallery images
//   selectedImages.slice(1).forEach((image) => {
//     formData.append("gallery_images", image);
//   });
// }

//       if (isEditing) {
//         formData.append("remove_image_ids", JSON.stringify(removeImageIds));
//       }

//       const response = isEditing
//         ? await adminAxiosInstance.patch(
//             `/admin-panel/properties/${editingPropertyId}/`,
//             formData,
//           )
//         : await adminAxiosInstance.post("/admin-panel/properties/", formData);

//         if (isEditing) {
//   setProperties((previous) =>
//     previous.map((property) =>
//       property.id === editingPropertyId
//         ? response.data
//         : property
//     )
//   );

//   showSnackbar(
//     "Property updated successfully.",
//     "success"
//   );
// } else {
//   setProperties((previous) => [
//     response.data,
//     ...previous,
//   ]);

//   showSnackbar(
//     "Property added and approved successfully.",
//     "success"
//   );
// }
//       setCreateDialogOpen(false);
//       setPropertyForm(initialPropertyForm);
//     } catch (err) {
//       console.error(err.response?.data || err.message);

//       const responseData = err.response?.data;

//       const errorMessage =
//         typeof responseData === "object"
//           ? Object.values(responseData).flat().join(" ")
//           : responseData;

//       showSnackbar(errorMessage || "Unable to add property.", "error");
//     } finally {
//       setCreateLoading(false);
//     }
//   };

//   const resetFilters = () => {
//     setStatusFilter("");
//     setPropertyTypeFilter("");
//     setListingTypeFilter("");
//     setSearch("");
//   };

//   const getStatusStyle = (status) => {
//     if (status === "approved") {
//       return {
//         label: "Approved",
//         bgcolor: "#ecfdf3",
//         color: "#067647",
//         border: "#abefc6",
//       };
//     }

//     if (status === "rejected") {
//       return {
//         label: "Rejected",
//         bgcolor: "#fef3f2",
//         color: "#b42318",
//         border: "#fecdca",
//       };
//     }

//     return {
//       label: "Pending",
//       bgcolor: "#fffaeb",
//       color: "#b54708",
//       border: "#fedf89",
//     };
//   };

//   const openEditDialog = (property) => {
//     setEditingPropertyId(property.id);

//     setExistingMainImage(property.main_image || "");

//     setExistingGalleryImages(property.images || []);

//     setRemoveImageIds([]);

//     setPropertyForm({
//       title: property.title || "",
//       description: property.description || "",
//       property_type: property.property_type || "",
//       listing_type: property.listing_type || "",
//       price: property.price || "",
//       location: property.location || "",
//       address: property.address || "",

//       expires_at: property.expires_at
//         ? dayjs(property.expires_at).format("YYYY-MM-DD")
//         : "",

//       property_images: [null],

//       bedrooms: property.bedrooms || "",
//       bathrooms: property.bathrooms || "",
//       area_sqft: property.area_sqft || "",

//       total_floors: property.total_floors || "",
//       floors: property.floors || "",
//       parking: property.parking || "",
//       furnishing: property.furnishing || "",

//       floor_number: property.floor_number || "",

//       total_cent: property.total_cent || "",
//       price_per_cent: property.price_per_cent || "",
//       road_access: property.road_access || "",
//       plot_type: property.plot_type || "",

//       commercial_type: property.commercial_type || "",
//       builtup_area_sqft: property.builtup_area_sqft || "",
//     });

//     setCreateDialogOpen(true);
//   };
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         py: { xs: 3, md: 4 },
//         bgcolor: "#f6f8fb",
//         background:
//           "radial-gradient(circle at top left, rgba(15,118,110,0.13), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.12), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f5f7fb 48%, #eefdf7 100%)",
//       }}
//     >
//       <Container maxWidth="xl">
//         <Stack
//           direction={{ xs: "column", md: "row" }}
//           justifyContent="space-between"
//           alignItems={{ xs: "flex-start", md: "center" }}
//           gap={2}
//           sx={{ mb: 3 }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: { xs: 28, md: 35 },
//                 fontWeight: 850,
//                 color: "#101828",
//                 letterSpacing: "-1px",
//                 lineHeight: 1.12,
//               }}
//             >
//               Manage Properties
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.8,
//                 color: "#667085",
//                 fontSize: { xs: 14, md: 15 },
//               }}
//             >
//               View, approve and reject submitted property listings.
//             </Typography>
//           </Box>

//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             spacing={1.2}
//             sx={{
//               ml: { md: "auto" },
//               width: { xs: "100%", sm: "auto" },
//             }}
//           >
//             <Button
//               variant="contained"
//               startIcon={<AddRoundedIcon />}
//               onClick={openCreateDialog}
//               sx={{
//                 borderRadius: "16px",
//                 textTransform: "none",
//                 fontWeight: 800,
//                 bgcolor: "#0f766e",
//                 px: 2.3,
//                 py: 1.05,
//                 boxShadow: "0 12px 25px rgba(15,118,110,0.18)",
//                 "&:hover": {
//                   bgcolor: "#0b625d",
//                   transform: "translateY(-1px)",
//                   boxShadow: "0 14px 28px rgba(15,118,110,0.22)",
//                 },
//               }}
//             >
//               Add Property
//             </Button>

//             <Button
//               variant="outlined"
//               startIcon={<RefreshOutlinedIcon />}
//               onClick={fetchProperties}
//               sx={{
//                 borderRadius: "16px",
//                 textTransform: "none",
//                 fontWeight: 800,
//                 color: "#344054",
//                 borderColor: "#d0d5dd",
//                 bgcolor: "#ffffff",
//                 px: 2.2,
//                 py: 1.05,
//                 boxShadow: "0 10px 22px rgba(15,23,42,0.05)",
//                 "&:hover": {
//                   bgcolor: "#ecfdf5",
//                   borderColor: "#bbf7d0",
//                   color: "#0f766e",
//                   transform: "translateY(-1px)",
//                 },
//               }}
//             >
//               Refresh
//             </Button>
//           </Stack>
//         </Stack>

//         <Card
//           elevation={0}
//           sx={{
//             mb: 2.5,
//             border: "1px solid rgba(255,255,255,0.9)",
//             borderRadius: "26px",
//             bgcolor: "rgba(255,255,255,0.92)",
//             backdropFilter: "blur(14px)",
//             boxShadow:
//               "0 20px 45px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
//           }}
//         >
//           <CardContent
//             sx={{
//               p: { xs: 2.2, md: 2.7 },
//               "&:last-child": {
//                 pb: { xs: 2.2, md: 2.7 },
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "1fr",
//                   sm: "repeat(2, minmax(0, 1fr))",
//                   lg: "2fr repeat(3, minmax(150px, 1fr)) auto",
//                 },
//                 gap: 1.5,
//                 alignItems: "center",
//               }}
//             >
//               <TextField
//                 size="small"
//                 label="Search properties"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Title, location or agent"
//                 InputProps={{
//                   startAdornment: (
//                     <SearchOutlinedIcon
//                       sx={{
//                         mr: 1,
//                         color: "#98a2b3",
//                         fontSize: 20,
//                       }}
//                     />
//                   ),
//                 }}
//                 sx={filterFieldStyle}
//               />

//               <TextField
//                 select
//                 size="small"
//                 label="Status"
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 sx={filterFieldStyle}
//               >
//                 <MenuItem value="">All Status</MenuItem>
//                 <MenuItem value="pending">Pending</MenuItem>
//                 <MenuItem value="approved">Approved</MenuItem>
//                 <MenuItem value="rejected">Rejected</MenuItem>
//               </TextField>

//               <TextField
//                 select
//                 size="small"
//                 label="Property Type"
//                 value={propertyTypeFilter}
//                 onChange={(e) => setPropertyTypeFilter(e.target.value)}
//                 sx={filterFieldStyle}
//               >
//                 <MenuItem value="">All Types</MenuItem>
//                 <MenuItem value="house">House</MenuItem>
//                 <MenuItem value="villa">Villa</MenuItem>
//                 <MenuItem value="apartment">Apartment</MenuItem>
//                 <MenuItem value="land">Land</MenuItem>
//                 <MenuItem value="commercial">Commercial</MenuItem>
//               </TextField>

//               <TextField
//                 select
//                 size="small"
//                 label="Listing Type"
//                 value={listingTypeFilter}
//                 onChange={(e) => setListingTypeFilter(e.target.value)}
//                 sx={filterFieldStyle}
//               >
//                 <MenuItem value="">All Listings</MenuItem>
//                 <MenuItem value="sale">Sale</MenuItem>
//                 <MenuItem value="rent">Rent</MenuItem>
//               </TextField>

//               <Button
//                 onClick={resetFilters}
//                 sx={{
//                   minHeight: 40,
//                   borderRadius: "14px",
//                   textTransform: "none",
//                   fontWeight: 800,
//                   color: "#475467",
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e5e7eb",
//                   px: 2,
//                   "&:hover": {
//                     bgcolor: "#ecfdf5",
//                     color: "#0f766e",
//                     borderColor: "#bbf7d0",
//                   },
//                 }}
//               >
//                 Clear
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>

//         {error && (
//           <Alert
//             severity="error"
//             sx={{
//               mb: 2,
//               borderRadius: "16px",
//               border: "1px solid #fecdca",
//             }}
//           >
//             {error}
//           </Alert>
//         )}

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={3500}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           onClose={() =>
//             setSnackbar((previous) => ({
//               ...previous,
//               open: false,
//             }))
//           }
//         >
//           <Alert
//             variant="filled"
//             severity={snackbar.severity}
//             onClose={() =>
//               setSnackbar((previous) => ({
//                 ...previous,
//                 open: false,
//               }))
//             }
//             sx={{
//               borderRadius: "14px",
//               fontWeight: 700,
//             }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>

//         <Typography
//           sx={{
//             mb: 1.8,
//             color: "#475467",
//             fontSize: 14,
//             fontWeight: 750,
//           }}
//         >
//           {filteredProperties.length} properties found
//         </Typography>

//         {loading ? (
//           <Box
//             sx={{
//               minHeight: 320,
//               display: "grid",
//               placeItems: "center",
//             }}
//           >
//             <CircularProgress sx={{ color: "#0f766e" }} />
//           </Box>
//         ) : filteredProperties.length === 0 ? (
//           <Card
//             elevation={0}
//             sx={{
//               border: "1px dashed #d0d5dd",
//               borderRadius: "28px",
//               bgcolor: "rgba(255,255,255,0.92)",
//               backdropFilter: "blur(12px)",
//               boxShadow:
//                 "0 24px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
//             }}
//           >
//             <CardContent sx={{ textAlign: "center", py: 7 }}>
//               <Box
//                 sx={{
//                   width: 74,
//                   height: 74,
//                   mx: "auto",
//                   borderRadius: "26px",
//                   bgcolor: "#ecfdf5",
//                   color: "#0f766e",
//                   display: "grid",
//                   placeItems: "center",
//                   boxShadow:
//                     "0 18px 34px rgba(15, 118, 110, 0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
//                 }}
//               >
//                 <HomeWorkOutlinedIcon sx={{ fontSize: 38 }} />
//               </Box>

//               <Typography
//                 sx={{
//                   mt: 1.8,
//                   fontWeight: 850,
//                   color: "#344054",
//                   fontSize: 18,
//                 }}
//               >
//                 No properties found
//               </Typography>

//               <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
//                 Try changing or clearing the selected filters.
//               </Typography>
//             </CardContent>
//           </Card>
//         ) : (
//           <Stack spacing={1.7}>
//             {filteredProperties.map((property) => {
//               const status = getStatusStyle(property.status);

//               return (
//                 <Card
//                   key={property.id}
//                   elevation={0}
//                   sx={{
//                     position: "relative",
//                     overflow: "hidden",
//                     border: "1px solid rgba(255,255,255,0.9)",
//                     borderRadius: "26px",
//                     bgcolor: "rgba(255,255,255,0.94)",
//                     backdropFilter: "blur(14px)",
//                     boxShadow:
//                       "0 18px 42px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
//                     transition: "0.24s ease",
//                     "&::before": {
//                       content: '""',
//                       position: "absolute",
//                       inset: 0,
//                       background:
//                         "linear-gradient(145deg, rgba(236,253,245,0.85) 0%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0) 100%)",
//                       pointerEvents: "none",
//                     },
//                     "&::after": {
//                       content: '""',
//                       position: "absolute",
//                       width: 120,
//                       height: 120,
//                       borderRadius: "50%",
//                       right: -48,
//                       top: -48,
//                       bgcolor: "rgba(15, 118, 110, 0.08)",
//                       boxShadow: "0 0 50px rgba(15, 118, 110, 0.1)",
//                       pointerEvents: "none",
//                     },
//                     "&:hover": {
//                       borderColor: "#bbf7d0",
//                       boxShadow:
//                         "0 26px 58px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
//                       transform: "translateY(-4px)",
//                     },
//                   }}
//                 >
//                   <CardContent
//                     sx={{
//                       position: "relative",
//                       zIndex: 1,
//                       p: { xs: 2.2, md: 2.7 },
//                       "&:last-child": {
//                         pb: { xs: 2.2, md: 2.7 },
//                       },
//                     }}
//                   >
//                     <Stack
//                       direction={{ xs: "column", lg: "row" }}
//                       justifyContent="space-between"
//                       alignItems={{ xs: "stretch", lg: "center" }}
//                       gap={2.5}
//                     >
//                       <Stack
//                         direction="row"
//                         spacing={1.6}
//                         alignItems="flex-start"
//                         sx={{ minWidth: 0, flex: 1 }}
//                       >
//                         <Box
//                           sx={{
//                             width: 56,
//                             height: 56,
//                             borderRadius: "20px",
//                             bgcolor: "#ecfdf5",
//                             color: "#0f766e",
//                             display: "grid",
//                             placeItems: "center",
//                             flexShrink: 0,
//                             boxShadow:
//                               "0 14px 28px rgba(15, 118, 110, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
//                             "& svg": {
//                               fontSize: 28,
//                             },
//                           }}
//                         >
//                           <HomeWorkOutlinedIcon />
//                         </Box>

//                         <Box sx={{ minWidth: 0, flex: 1 }}>
//                           <Stack
//                             direction={{ xs: "column", sm: "row" }}
//                             spacing={1}
//                             alignItems={{ xs: "flex-start", sm: "center" }}
//                           >
//                             <Typography
//                               sx={{
//                                 fontSize: { xs: 18, md: 20 },
//                                 fontWeight: 850,
//                                 color: "#101828",
//                                 letterSpacing: "-0.4px",
//                                 lineHeight: 1.15,
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                                 whiteSpace: "nowrap",
//                                 maxWidth: { xs: "100%", md: 520 },
//                               }}
//                             >
//                               {property.title}
//                             </Typography>

//                             <Chip
//                               label={status.label}
//                               size="small"
//                               sx={{
//                                 bgcolor: status.bgcolor,
//                                 color: status.color,
//                                 border: `1px solid ${status.border}`,
//                                 fontWeight: 800,
//                                 borderRadius: "999px",
//                                 px: 0.5,
//                               }}
//                             />
//                           </Stack>

//                           <Stack
//                             direction={{ xs: "column", sm: "row" }}
//                             spacing={{ xs: 0.9, sm: 1.5 }}
//                             sx={{ mt: 1.3 }}
//                           >
//                             <InfoText
//                               icon={<LocationOnOutlinedIcon />}
//                               text={property.location || "Location unavailable"}
//                             />

//                             <InfoText
//                               icon={<PersonOutlineOutlinedIcon />}
//                               text={property.agent_name || "Unknown agent"}
//                             />
//                           </Stack>

//                           <Stack
//                             direction={{ xs: "column", sm: "row" }}
//                             spacing={{ xs: 0.7, sm: 1.5 }}
//                             sx={{ mt: 1.2 }}
//                           >
//                             <Typography
//                               sx={{
//                                 color: "#101828",
//                                 fontSize: 14,
//                                 fontWeight: 850,
//                               }}
//                             >
//                               ₹
//                               {Number(property.price || 0).toLocaleString(
//                                 "en-IN",
//                               )}
//                             </Typography>

//                             <Typography
//                               sx={{
//                                 color: "#667085",
//                                 fontSize: 13.5,
//                                 textTransform: "capitalize",
//                                 fontWeight: 650,
//                               }}
//                             >
//                               {property.property_type} • {property.listing_type}
//                             </Typography>
//                           </Stack>
//                         </Box>
//                       </Stack>

//                       <Stack
//                         direction={{ xs: "column", sm: "row" }}
//                         spacing={1}
//                         alignItems={{ xs: "stretch", sm: "center" }}
//                         justifyContent={{ xs: "flex-start", lg: "flex-end" }}
//                         sx={{
//                           width: { xs: "100%", lg: "auto" },
//                           flexShrink: 0,
//                           flexWrap: "wrap",
//                         }}
//                       >
//                         <ActionButton
//                           icon={<VisibilityOutlinedIcon />}
//                           label="View"
//                           onClick={() => openPropertyDetails(property)}
//                         />
//                         <ActionButton
//                           icon={<EditOutlinedIcon />}
//                           label="Edit"
//                           onClick={() => openEditDialog(property)}
//                           disabled={Boolean(actionLoading)}
//                           variant="edit"
//                         />

//                         {property.status !== "approved" && (
//                           <ActionButton
//                             icon={
//                               actionLoading === `approve-${property.id}` ? (
//                                 <CircularProgress size={17} color="inherit" />
//                               ) : (
//                                 <CheckCircleOutlineOutlinedIcon />
//                               )
//                             }
//                             label="Approve"
//                             onClick={() => handleApprove(property.id)}
//                             disabled={Boolean(actionLoading)}
//                             variant="success"
//                           />
//                         )}

//                         {property.status !== "rejected" && (
//                           <ActionButton
//                             icon={<CancelOutlinedIcon />}
//                             label="Reject"
//                             onClick={() => openRejectDialog(property)}
//                             disabled={Boolean(actionLoading)}
//                             variant="warning"
//                           />
//                         )}

//                         <ActionButton
//                           icon={
//                             actionLoading === `delete-${property.id}` ? (
//                               <CircularProgress size={17} color="inherit" />
//                             ) : (
//                               <DeleteOutlineOutlinedIcon />
//                             )
//                           }
//                           label="Delete"
//                           onClick={() => openDeleteDialog(property)}
//                           disabled={Boolean(actionLoading)}
//                           variant="danger"
//                         />
//                       </Stack>
//                     </Stack>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </Stack>
//         )}
//       </Container>
//       <Dialog
//         open={createDialogOpen}
//         onClose={closeCreateDialog}
//         fullWidth
//         maxWidth="md"
//         PaperProps={{
//           sx: {
//             borderRadius: "26px",
//             boxShadow: "0 30px 80px rgba(15,23,42,0.2)",
//           },
//         }}
//       >
//         <DialogTitle
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             px: { xs: 2.5, md: 3.5 },
//             pt: 3,
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: 22,
//                 fontWeight: 900,
//                 color: "#101828",
//               }}
//             >
//               Add Property
//             </Typography>

//             <Typography
//               sx={{
//                 mt: 0.4,
//                 color: "#667085",
//                 fontSize: 13.5,
//               }}
//             >
//               Create a new property listing as Master Admin.
//             </Typography>
//           </Box>

//           <IconButton
//             onClick={closeCreateDialog}
//             disabled={createLoading}
//             sx={{
//               bgcolor: "#f8fafc",
//               "&:hover": {
//                 bgcolor: "#ecfdf5",
//               },
//             }}
//           >
//             <CloseOutlinedIcon />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ mt: 2 }} />

//         <DialogContent
//           sx={{
//             px: { xs: 2.5, md: 3.5 },
//             py: 3,
//           }}
//         >
//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "repeat(2, minmax(0, 1fr))",
//               },
//               gap: 2,
//             }}
//           >
//             <TextField
//               fullWidth
//               required
//               label="Property Title"
//               name="title"
//               value={propertyForm.title}
//               onChange={handlePropertyFormChange}
//               sx={filterFieldStyle}
//             />

//             <TextField
//               select
//               fullWidth
//               required
//               label="Property Type"
//               name="property_type"
//               value={propertyForm.property_type}
//               onChange={handlePropertyFormChange}
//               sx={filterFieldStyle}
//             >
//               <MenuItem value="house">House</MenuItem>
//               <MenuItem value="villa">Villa</MenuItem>
//               <MenuItem value="apartment">Apartment</MenuItem>
//               <MenuItem value="land">Land</MenuItem>
//               <MenuItem value="commercial">Commercial</MenuItem>
//             </TextField>

//             <TextField
//               select
//               fullWidth
//               required
//               label="Listing Type"
//               name="listing_type"
//               value={propertyForm.listing_type}
//               onChange={handlePropertyFormChange}
//               sx={filterFieldStyle}
//             >
//               <MenuItem value="sale">Sale</MenuItem>
//               <MenuItem value="rent">Rent</MenuItem>
//             </TextField>

//             <TextField
//               fullWidth
//               required
//               type="number"
//               label="Price"
//               name="price"
//               value={propertyForm.price}
//               onChange={handlePropertyFormChange}
//               inputProps={{ min: 0 }}
//               sx={filterFieldStyle}
//             />

//             <TextField
//               fullWidth
//               required
//               label="Location"
//               name="location"
//               value={propertyForm.location}
//               onChange={handlePropertyFormChange}
//               sx={filterFieldStyle}
//             />

//             <TextField
//               fullWidth
//               label="Address"
//               name="address"
//               value={propertyForm.address}
//               onChange={handlePropertyFormChange}
//               sx={filterFieldStyle}
//             />

//             {propertyForm.property_type && (
//               <Box
//                 sx={{
//                   gridColumn: "1 / -1",
//                   mt: 0.5,
//                   p: 2,
//                   borderRadius: "18px",
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #e5e7eb",
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     fontSize: 15,
//                     fontWeight: 850,
//                     color: "#101828",
//                   }}
//                 >
//                   {propertyForm.property_type === "land"
//                     ? "Land Details"
//                     : propertyForm.property_type === "commercial"
//                       ? "Commercial Details"
//                       : propertyForm.property_type === "apartment"
//                         ? "Apartment Details"
//                         : "House / Villa Details"}
//                 </Typography>

//                 <Box
//                   sx={{
//                     display: "grid",
//                     gridTemplateColumns: {
//                       xs: "1fr",
//                       sm: "repeat(2, minmax(0, 1fr))",
//                     },
//                     gap: 2,
//                     mt: 2,
//                   }}
//                 >
//                   {["house", "villa", "apartment"].includes(
//                     propertyForm.property_type,
//                   ) && (
//                     <>
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Bedrooms"
//                         name="bedrooms"
//                         value={propertyForm.bedrooms}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Bathrooms"
//                         name="bathrooms"
//                         value={propertyForm.bathrooms}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Area in sq.ft"
//                         name="area_sqft"
//                         value={propertyForm.area_sqft}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />
//                     </>
//                   )}

//                   {["house", "villa"].includes(propertyForm.property_type) && (
//                     <>
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Total Floors"
//                         name="total_floors"
//                         value={propertyForm.total_floors}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Property Floor"
//                         name="floors"
//                         value={propertyForm.floors}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         select
//                         fullWidth
//                         label="Parking"
//                         name="parking"
//                         value={propertyForm.parking}
//                         onChange={handlePropertyFormChange}
//                         sx={filterFieldStyle}
//                       >
//                         <MenuItem value="">Select Parking</MenuItem>
//                         <MenuItem value="available">Available</MenuItem>
//                         <MenuItem value="not_available">Not Available</MenuItem>
//                       </TextField>

//                       <TextField
//                         select
//                         fullWidth
//                         label="Furnishing"
//                         name="furnishing"
//                         value={propertyForm.furnishing}
//                         onChange={handlePropertyFormChange}
//                         sx={filterFieldStyle}
//                       >
//                         <MenuItem value="">Select Furnishing</MenuItem>
//                         <MenuItem value="furnished">Furnished</MenuItem>
//                         <MenuItem value="semi_furnished">
//                           Semi Furnished
//                         </MenuItem>
//                         <MenuItem value="unfurnished">Unfurnished</MenuItem>
//                       </TextField>
//                     </>
//                   )}

//                   {propertyForm.property_type === "apartment" && (
//                     <>
//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Floor Number"
//                         name="floor_number"
//                         value={propertyForm.floor_number}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Total Floors"
//                         name="total_floors"
//                         value={propertyForm.total_floors}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />
//                     </>
//                   )}

//                   {propertyForm.property_type === "land" && (
//                     <>
//                       <TextField
//                         fullWidth
//                         required
//                         type="number"
//                         label="Total Cents"
//                         name="total_cent"
//                         value={propertyForm.total_cent}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0, step: "0.01" }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         type="number"
//                         label="Price Per Cent"
//                         name="price_per_cent"
//                         value={propertyForm.price_per_cent}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         fullWidth
//                         label="Road Access"
//                         name="road_access"
//                         value={propertyForm.road_access}
//                         onChange={handlePropertyFormChange}
//                         placeholder="Example: 5 metre road access"
//                         sx={filterFieldStyle}
//                       />

//                       <TextField
//                         select
//                         fullWidth
//                         label="Plot Type"
//                         name="plot_type"
//                         value={propertyForm.plot_type}
//                         onChange={handlePropertyFormChange}
//                         sx={filterFieldStyle}
//                       >
//                         <MenuItem value="">Select Plot Type</MenuItem>
//                         <MenuItem value="residential">Residential</MenuItem>
//                         <MenuItem value="commercial">Commercial</MenuItem>
//                         <MenuItem value="agricultural">Agricultural</MenuItem>
//                         <MenuItem value="industrial">Industrial</MenuItem>
//                       </TextField>
//                     </>
//                   )}

//                   {propertyForm.property_type === "commercial" && (
//                     <>
//                       <TextField
//                         select
//                         fullWidth
//                         required
//                         label="Commercial Type"
//                         name="commercial_type"
//                         value={propertyForm.commercial_type}
//                         onChange={handlePropertyFormChange}
//                         sx={filterFieldStyle}
//                       >
//                         <MenuItem value="">Select Commercial Type</MenuItem>
//                         <MenuItem value="shop">Shop</MenuItem>
//                         <MenuItem value="office">Office</MenuItem>
//                         <MenuItem value="warehouse">Warehouse</MenuItem>
//                         <MenuItem value="showroom">Showroom</MenuItem>
//                         <MenuItem value="building">
//                           Commercial Building
//                         </MenuItem>
//                       </TextField>

//                       <TextField
//                         fullWidth
//                         required
//                         type="number"
//                         label="Built-up Area in sq.ft"
//                         name="builtup_area_sqft"
//                         value={propertyForm.builtup_area_sqft}
//                         onChange={handlePropertyFormChange}
//                         inputProps={{ min: 0 }}
//                         sx={filterFieldStyle}
//                       />
//                     </>
//                   )}
//                 </Box>
//               </Box>
//             )}

//             {/* <TextField
//   fullWidth
//   required
//   label="Expiry Date & Time"
//   name="expires_at"
//   value={propertyForm.expires_at}
//   onChange={handlePropertyFormChange}
//   InputLabelProps={{
//     shrink: true,
//   }}
//   inputProps={{
//     min: getMinimumExpiryDate(),
//   }}
//   sx={filterFieldStyle}
// /> */}

//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Expiry Date"
//                 value={
//                   propertyForm.expires_at
//                     ? dayjs(propertyForm.expires_at)
//                     : null
//                 }
//                 minDate={dayjs().startOf("day")}
//                 onChange={(newValue) => {
//                   setPropertyForm((previous) => ({
//                     ...previous,
//                     expires_at: newValue ? newValue.format("YYYY-MM-DD") : "",
//                   }));
//                 }}
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     required: true,
//                     sx: filterFieldStyle,
//                   },
//                 }}
//               />
//             </LocalizationProvider>

//             <Box
//               sx={{
//                 gridColumn: "1 / -1",
//                 p: 2,
//                 borderRadius: "18px",
//                 bgcolor: "#ffffff",
//                 border: "1px solid #e5e7eb",
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontSize: 15,
//                   fontWeight: 850,
//                   color: "#101828",
//                 }}
//               >
//                 Property Images
//               </Typography>

//               <Typography
//                 sx={{
//                   mt: 0.5,
//                   mb: 2,
//                   color: "#667085",
//                   fontSize: 13,
//                   lineHeight: 1.6,
//                 }}
//               >
//                 First image will be used as the main image. Remaining images
//                 will be added to the property gallery.
//               </Typography>

//               <Stack spacing={1.2}>
//                 {propertyForm.property_images.map((image, index) => (
//                   <Box
//                     key={index}
//                     sx={{
//                       display: "flex",
//                       flexDirection: {
//                         xs: "column",
//                         sm: "row",
//                       },
//                       alignItems: {
//                         xs: "stretch",
//                         sm: "center",
//                       },
//                       justifyContent: "space-between",
//                       gap: 1.3,
//                       p: 1.5,
//                       borderRadius: "14px",
//                       border: "1px solid #e5e7eb",
//                       bgcolor: index === 0 ? "#ecfdf5" : "#f8fafc",
//                     }}
//                   >
//                     <Box sx={{ minWidth: 0, flex: 1 }}>
//                       <Typography
//                         sx={{
//                           fontSize: 13.5,
//                           fontWeight: 800,
//                           color: "#344054",
//                         }}
//                       >
//                         {index === 0 ? "Main Image" : `Gallery Image ${index}`}
//                       </Typography>

//                       <Typography
//                         sx={{
//                           mt: 0.3,
//                           color: image ? "#475467" : "#98a2b3",
//                           fontSize: 12.5,
//                           overflow: "hidden",
//                           textOverflow: "ellipsis",
//                           whiteSpace: "nowrap",
//                         }}
//                       >
//                         {image ? image.name : "No image selected"}
//                       </Typography>
//                     </Box>

//                     <Stack
//                       direction="row"
//                       spacing={1}
//                       justifyContent="flex-end"
//                     >
//                       <Button
//                         component="label"
//                         size="small"
//                         startIcon={<CloudUploadOutlinedIcon />}
//                         sx={{
//                           borderRadius: "10px",
//                           textTransform: "none",
//                           fontWeight: 750,
//                           color: "#047857",
//                           bgcolor: "#ffffff",
//                           border: "1px solid #bbf7d0",
//                           px: 1.5,
//                           "&:hover": {
//                             bgcolor: "#ecfdf5",
//                             borderColor: "#86efac",
//                           },
//                         }}
//                       >
//                         Upload
//                         <input
//                           hidden
//                           type="file"
//                           accept="image/*"
//                           onChange={(event) =>
//                             handlePropertyImageChange(event, index)
//                           }
//                         />
//                       </Button>

//                       {propertyForm.property_images.length > 1 && (
//                         <IconButton
//                           size="small"
//                           onClick={() => removePropertyImageField(index)}
//                           sx={{
//                             borderRadius: "10px",
//                             color: "#b42318",
//                             bgcolor: "#ffffff",
//                             border: "1px solid #fecdca",
//                             "&:hover": {
//                               bgcolor: "#fef3f2",
//                             },
//                           }}
//                         >
//                           <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
//                         </IconButton>
//                       )}
//                     </Stack>
//                   </Box>
//                 ))}
//               </Stack>

//               <Button
//                 type="button"
//                 onClick={addPropertyImageField}
//                 disabled={propertyForm.property_images.length >= 8}
//                 startIcon={<AddRoundedIcon />}
//                 sx={{
//                   mt: 1.7,
//                   width: "100%",
//                   py: 1.1,
//                   borderRadius: "12px",
//                   textTransform: "none",
//                   fontWeight: 750,
//                   color: "#047857",
//                   bgcolor: "#f0fdf4",
//                   border: "1px dashed #86efac",
//                   "&:hover": {
//                     bgcolor: "#dcfce7",
//                   },
//                 }}
//               >
//                 Add Another Image
//               </Button>
//             </Box>

//             <TextField
//               fullWidth
//               multiline
//               minRows={4}
//               label="Description"
//               name="description"
//               value={propertyForm.description}
//               onChange={handlePropertyFormChange}
//               sx={{
//                 ...filterFieldStyle,
//                 gridColumn: {
//                   xs: "auto",
//                   sm: "1 / -1",
//                 },
//               }}
//             />
//           </Box>

//           <Alert
//             severity="info"
//             sx={{
//               mt: 2.5,
//               borderRadius: "16px",
//             }}
//           >
//             Property created by Master Admin will be approved automatically.
//           </Alert>
//         </DialogContent>

//         <Divider />

//         <DialogActions
//           sx={{
//             px: { xs: 2.5, md: 3.5 },
//             py: 2.5,
//           }}
//         >
//           <Button
//             onClick={closeCreateDialog}
//             disabled={createLoading}
//             sx={{
//               textTransform: "none",
//               fontWeight: 750,
//               color: "#475467",
//             }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             onClick={handleCreateProperty}
//             disabled={createLoading}
//             startIcon={
//               createLoading ? (
//                 <CircularProgress size={18} color="inherit" />
//               ) : (
//                 <AddRoundedIcon />
//               )
//             }
//             sx={{
//               borderRadius: "14px",
//               textTransform: "none",
//               fontWeight: 800,
//               bgcolor: "#0f766e",
//               px: 2.4,
//               boxShadow: "none",
//               "&:hover": {
//                 bgcolor: "#0b625d",
//                 boxShadow: "none",
//               },
//             }}
//           >
//             {createLoading ? "Adding..." : "Add Property"}
//           </Button>
//         </DialogActions>
//       </Dialog>
//       <PropertyDetailsDialog
//         open={detailsOpen}
//         onClose={closePropertyDetails}
//         property={selectedProperty}
//       />

//       <Dialog
//         open={rejectDialogOpen}
//         onClose={closeRejectDialog}
//         fullWidth
//         maxWidth="xs"
//         PaperProps={{
//           sx: {
//             borderRadius: "24px",
//             boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 900, color: "#101828" }}>
//           Reject Property
//         </DialogTitle>

//         <DialogContent>
//           <Typography sx={{ mb: 2, color: "#667085", lineHeight: 1.6 }}>
//             Enter the reason for rejecting{" "}
//             <strong>{selectedProperty?.title}</strong>.
//           </Typography>

//           <TextField
//             fullWidth
//             multiline
//             minRows={4}
//             label="Rejection reason"
//             value={rejectReason}
//             onChange={(event) => setRejectReason(event.target.value)}
//             sx={filterFieldStyle}
//           />
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button
//             onClick={closeRejectDialog}
//             disabled={Boolean(actionLoading)}
//             sx={{ textTransform: "none", fontWeight: 700, color: "#475467" }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleReject}
//             disabled={Boolean(actionLoading)}
//             sx={{
//               borderRadius: "14px",
//               textTransform: "none",
//               fontWeight: 800,
//               boxShadow: "none",
//             }}
//           >
//             {actionLoading?.startsWith("reject-") ? (
//               <CircularProgress size={20} color="inherit" />
//             ) : (
//               "Reject Property"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={closeDeleteDialog}
//         fullWidth
//         maxWidth="xs"
//         PaperProps={{
//           sx: {
//             borderRadius: "24px",
//             boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 900, color: "#101828" }}>
//           Delete Property
//         </DialogTitle>

//         <DialogContent>
//           <Typography sx={{ color: "#475467", lineHeight: 1.7 }}>
//             Are you sure you want to delete{" "}
//             <strong>{selectedProperty?.title}</strong>?
//           </Typography>

//           <Typography
//             sx={{
//               mt: 1,
//               fontSize: 13,
//               color: "#98a2b3",
//             }}
//           >
//             This action cannot be undone.
//           </Typography>
//         </DialogContent>

//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button
//             onClick={closeDeleteDialog}
//             disabled={Boolean(actionLoading)}
//             sx={{ textTransform: "none", fontWeight: 700, color: "#475467" }}
//           >
//             Cancel
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleDelete}
//             disabled={Boolean(actionLoading)}
//             sx={{
//               borderRadius: "14px",
//               textTransform: "none",
//               fontWeight: 800,
//               boxShadow: "none",
//             }}
//           >
//             {actionLoading?.startsWith("delete-") ? (
//               <CircularProgress size={20} color="inherit" />
//             ) : (
//               "Delete Property"
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// function ActionButton({
//   icon,
//   label,
//   onClick,
//   disabled = false,
//   variant = "default",
// }) {
//   const styles = {
//     default: {
//       color: "#344054",
//       borderColor: "#d0d5dd",
//       bgcolor: "#ffffff",
//       hoverBg: "#f8fafc",
//       hoverBorder: "#98a2b3",
//     },
//     success: {
//       color: "#ffffff",
//       borderColor: "#0f766e",
//       bgcolor: "#0f766e",
//       hoverBg: "#0b625d",
//       hoverBorder: "#0b625d",
//     },
//     warning: {
//       color: "#b54708",
//       borderColor: "#fedf89",
//       bgcolor: "#ffffff",
//       hoverBg: "#fffaeb",
//       hoverBorder: "#fdb022",
//     },
//     danger: {
//       color: "#b42318",
//       borderColor: "#fecdca",
//       bgcolor: "#ffffff",
//       hoverBg: "#fef3f2",
//       hoverBorder: "#fda29b",
//     },
//   };

//   const current = styles[variant] || styles.default;

//   return (
//     <Button
//       variant={variant === "success" ? "contained" : "outlined"}
//       startIcon={icon}
//       onClick={onClick}
//       disabled={disabled}
//       sx={{
//         minWidth: { xs: "100%", sm: 94 },
//         borderRadius: "15px",
//         textTransform: "none",
//         fontWeight: 800,
//         color: current.color,
//         borderColor: current.borderColor,
//         bgcolor: current.bgcolor,
//         boxShadow:
//           variant === "success"
//             ? "0 10px 22px rgba(15,118,110,0.16)"
//             : "0 8px 18px rgba(15,23,42,0.05)",
//         transition: "0.2s ease",
//         "&:hover": {
//           bgcolor: current.hoverBg,
//           borderColor: current.hoverBorder,
//           boxShadow:
//             variant === "success"
//               ? "0 12px 26px rgba(15,118,110,0.18)"
//               : "0 10px 20px rgba(15,23,42,0.06)",
//           transform: "translateY(-1px)",
//         },
//       }}
//     >
//       {label}
//     </Button>
//   );
// }

// function InfoText({ icon, text }) {
//   return (
//     <Stack direction="row" spacing={0.55} alignItems="center">
//       <Box
//         sx={{
//           color: "#98a2b3",
//           display: "flex",
//           "& svg": {
//             fontSize: 17,
//           },
//         }}
//       >
//         {icon}
//       </Box>

//       <Typography
//         sx={{
//           color: "#667085",
//           fontSize: 13.5,
//           fontWeight: 600,
//           overflow: "hidden",
//           textOverflow: "ellipsis",
//           whiteSpace: "nowrap",
//           maxWidth: { xs: 240, md: 340 },
//         }}
//       >
//         {text}
//       </Typography>
//     </Stack>
//   );
// }

// function PropertyDetailsDialog({ open, onClose, property }) {
//   const hasValue = (value) =>
//     value !== null && value !== undefined && value !== "";

//   const typeDetails = [];

//   if (["house", "villa", "apartment"].includes(property?.property_type)) {
//     typeDetails.push(
//       {
//         label: "Bedrooms",
//         value: property?.bedrooms,
//       },
//       {
//         label: "Bathrooms",
//         value: property?.bathrooms,
//       },
//       {
//         label: "Area",
//         value: property?.area_sqft ? `${property.area_sqft} sq.ft` : "",
//       },
//     );
//   }

//   if (["house", "villa"].includes(property?.property_type)) {
//     typeDetails.push(
//       {
//         label: "Total Floors",
//         value: property?.total_floors,
//       },
//       {
//         label: "Property Floor",
//         value: property?.floors,
//       },
//       {
//         label: "Parking",
//         value: property?.parking,
//       },
//       {
//         label: "Furnishing",
//         value: property?.furnishing,
//       },
//     );
//   }

//   if (property?.property_type === "apartment") {
//     typeDetails.push(
//       {
//         label: "Floor Number",
//         value: property?.floor_number,
//       },
//       {
//         label: "Total Floors",
//         value: property?.total_floors,
//       },
//       {
//         label: "Furnishing",
//         value: property?.furnishing,
//       },
//     );
//   }

//   if (property?.property_type === "land") {
//     typeDetails.push(
//       {
//         label: "Total Cent",
//         value: property?.total_cent,
//       },
//       {
//         label: "Price Per Cent",
//         value: property?.price_per_cent
//           ? `₹${Number(property.price_per_cent).toLocaleString("en-IN")}`
//           : "",
//       },
//       {
//         label: "Road Access",
//         value: property?.road_access,
//       },
//       {
//         label: "Plot Type",
//         value: property?.plot_type,
//       },
//     );
//   }

//   if (property?.property_type === "commercial") {
//     typeDetails.push(
//       {
//         label: "Commercial Type",
//         value: property?.commercial_type,
//       },
//       {
//         label: "Built-up Area",
//         value: property?.builtup_area_sqft
//           ? `${property.builtup_area_sqft} sq.ft`
//           : "",
//       },
//       {
//         label: "Floor Number",
//         value: property?.floor_number,
//       },
//       {
//         label: "Parking",
//         value: property?.parking,
//       },
//       {
//         label: "Road Access",
//         value: property?.road_access,
//       },
//     );
//   }

//   const visibleTypeDetails = typeDetails.filter((item) => hasValue(item.value));

//   const allImages = [
//     ...(property?.main_image
//       ? [
//           {
//             id: "main",
//             image: property.main_image,
//             label: "Main Image",
//           },
//         ]
//       : []),

//     ...(property?.images || []).map((image, index) => ({
//       id: image.id,
//       image: image.image,
//       label: `Gallery Image ${index + 1}`,
//     })),
//   ];

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
//       PaperProps={{
//         sx: {
//           borderRadius: "24px",
//           boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
//         },
//       }}
//     >
//       <DialogTitle sx={{ pr: 7 }}>
//         <Typography
//           sx={{
//             fontSize: 22,
//             fontWeight: 900,
//             color: "#101828",
//           }}
//         >
//           Property Details
//         </Typography>

//         <Typography
//           sx={{
//             mt: 0.4,
//             color: "#667085",
//             fontSize: 13.5,
//           }}
//         >
//           Complete information about this listing.
//         </Typography>

//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 14,
//             top: 14,
//             bgcolor: "#f8fafc",

//             "&:hover": {
//               bgcolor: "#ecfdf5",
//             },
//           }}
//         >
//           <CloseOutlinedIcon />
//         </IconButton>
//       </DialogTitle>

//       <Divider />

//       <DialogContent>
//         <Stack spacing={3}>
//           {allImages.length > 0 && (
//             <Box>
//               <Typography
//                 sx={{
//                   mb: 1.5,
//                   fontWeight: 850,
//                   color: "#101828",
//                 }}
//               >
//                 Property Images
//               </Typography>

//               <Box
//                 sx={{
//                   display: "grid",
//                   gridTemplateColumns: {
//                     xs: "1fr",
//                     sm: "repeat(2, 1fr)",
//                   },
//                   gap: 1.5,
//                 }}
//               >
//                 {allImages.map((image) => (
//                   <Box
//                     key={image.id}
//                     sx={{
//                       overflow: "hidden",
//                       borderRadius: "18px",
//                       border: "1px solid #eaecf0",
//                       bgcolor: "#f8fafc",
//                     }}
//                   >
//                     <Box
//                       component="img"
//                       src={image.image}
//                       alt={image.label}
//                       sx={{
//                         width: "100%",
//                         height: 220,
//                         display: "block",
//                         objectFit: "cover",
//                       }}
//                     />

//                     <Typography
//                       sx={{
//                         p: 1,
//                         color: "#667085",
//                         fontSize: 12.5,
//                         fontWeight: 700,
//                       }}
//                     >
//                       {image.label}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>
//           )}

//           <Box>
//             <Stack
//               direction={{
//                 xs: "column",
//                 sm: "row",
//               }}
//               justifyContent="space-between"
//               gap={1}
//             >
//               <Box>
//                 <Typography
//                   sx={{
//                     fontSize: 22,
//                     fontWeight: 900,
//                     color: "#101828",
//                   }}
//                 >
//                   {property?.title}
//                 </Typography>

//                 <Typography
//                   sx={{
//                     mt: 0.5,
//                     color: "#667085",
//                   }}
//                 >
//                   {property?.location}
//                 </Typography>
//               </Box>

//               <Chip
//                 label={property?.status || "Unknown"}
//                 sx={{
//                   textTransform: "capitalize",
//                   fontWeight: 800,
//                   bgcolor:
//                     property?.status === "approved"
//                       ? "#ecfdf3"
//                       : property?.status === "rejected"
//                         ? "#fef3f2"
//                         : "#fffaeb",
//                   color:
//                     property?.status === "approved"
//                       ? "#067647"
//                       : property?.status === "rejected"
//                         ? "#b42318"
//                         : "#b54708",
//                 }}
//               />
//             </Stack>
//           </Box>

//           <Divider />

//           <Box>
//             <Typography
//               sx={{
//                 mb: 1.3,
//                 fontWeight: 850,
//                 color: "#101828",
//               }}
//             >
//               Basic Information
//             </Typography>

//             <Stack spacing={1}>
//               <DetailsRow
//                 label="Price"
//                 value={`₹${Number(property?.price || 0).toLocaleString(
//                   "en-IN",
//                 )}`}
//               />

//               <DetailsRow
//                 label="Property Type"
//                 value={property?.property_type}
//               />

//               <DetailsRow label="Listing Type" value={property?.listing_type} />

//               <DetailsRow label="Address" value={property?.address} />

//               <DetailsRow label="Agent" value={property?.agent_name} />

//               <DetailsRow label="Agent Email" value={property?.agent_email} />

//               <DetailsRow
//                 label="Expiry Date"
//                 value={
//                   property?.expires_at
//                     ? dayjs(property.expires_at).format("DD MMM YYYY")
//                     : "N/A"
//                 }
//               />

//               <DetailsRow
//                 label="Created Date"
//                 value={
//                   property?.created_at
//                     ? dayjs(property.created_at).format("DD MMM YYYY")
//                     : "N/A"
//                 }
//               />
//             </Stack>
//           </Box>

//           {visibleTypeDetails.length > 0 && (
//             <Box>
//               <Typography
//                 sx={{
//                   mb: 1.3,
//                   fontWeight: 850,
//                   color: "#101828",
//                   textTransform: "capitalize",
//                 }}
//               >
//                 {property?.property_type} Details
//               </Typography>

//               <Stack spacing={1}>
//                 {visibleTypeDetails.map((item) => (
//                   <DetailsRow
//                     key={item.label}
//                     label={item.label}
//                     value={item.value}
//                   />
//                 ))}
//               </Stack>
//             </Box>
//           )}

//           {property?.description && (
//             <Box>
//               <Typography
//                 sx={{
//                   mb: 0.8,
//                   fontWeight: 850,
//                   color: "#101828",
//                 }}
//               >
//                 Description
//               </Typography>

//               <Typography
//                 sx={{
//                   p: 2,
//                   borderRadius: "16px",
//                   bgcolor: "#f8fafc",
//                   border: "1px solid #eaecf0",
//                   color: "#344054",
//                   lineHeight: 1.7,
//                   whiteSpace: "pre-wrap",
//                 }}
//               >
//                 {property.description}
//               </Typography>
//             </Box>
//           )}

//           {property?.rejection_reason && (
//             <Alert severity="error" sx={{ borderRadius: "14px" }}>
//               Rejection reason: {property.rejection_reason}
//             </Alert>
//           )}
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 3 }}>
//         <Button
//           onClick={onClose}
//           sx={{
//             textTransform: "none",
//             fontWeight: 800,
//             color: "#475467",
//           }}
//         >
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// function DetailsRow({ label, value }) {
//   return (
//     <Stack
//       direction="row"
//       justifyContent="space-between"
//       spacing={2}
//       sx={{
//         p: 1.25,
//         borderRadius: "14px",
//         bgcolor: "#f8fafc",
//         border: "1px solid #eaecf0",
//       }}
//     >
//       <Typography
//         sx={{
//           color: "#667085",
//           fontSize: 13.5,
//           fontWeight: 700,
//         }}
//       >
//         {label}
//       </Typography>

//       <Typography
//         sx={{
//           color: "#101828",
//           fontSize: 13.5,
//           fontWeight: 800,
//           textTransform: "capitalize",
//           textAlign: "right",
//           wordBreak: "break-word",
//         }}
//       >
//         {value || "N/A"}
//       </Typography>
//     </Stack>
//   );
// }

// const filterFieldStyle = {
//   bgcolor: "#ffffff",

//   "& .MuiOutlinedInput-root": {
//     borderRadius: "16px",
//     fontSize: 14,
//     bgcolor: "#f8fafc",

//     "& fieldset": {
//       borderColor: "#d0d5dd",
//     },

//     "&:hover fieldset": {
//       borderColor: "#98a2b3",
//     },

//     "&.Mui-focused fieldset": {
//       borderColor: "#0f766e",
//     },
//   },

//   "& .MuiInputLabel-root.Mui-focused": {
//     color: "#0f766e",
//   },
// };

// export default AdminProperties;
