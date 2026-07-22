// import {
//   Box,
//   Button,
//   IconButton,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
// import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// import dayjs from "dayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import {
//   clearTypeSpecificFields,
//   filterFieldStyle,
// } from "./propertyFormUtils";

// function PropertyFormFields({
//   propertyForm,
//   setPropertyForm,
//   showSnackbar,
//   mode = "add",
//   existingMainImage = "",
//   existingGalleryImages = [],
//   onRemoveExistingGalleryImage,
// }) {
//   const isEditing = mode === "edit";

//   const handleChange = (event) => {
//     const { name, value } = event.target;

//     if (name === "property_type") {
//       setPropertyForm((previous) =>
//         clearTypeSpecificFields(previous, value),
//       );
//       return;
//     }

//     setPropertyForm((previous) => ({
//       ...previous,
//       [name]: value,
//     }));
//   };

//   const handleImageChange = (event, index) => {
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

//   const addImageField = () => {
//     const existingCount =
//       (existingMainImage ? 1 : 0) + existingGalleryImages.length;
//     const totalSlots = existingCount + propertyForm.property_images.length;

//     if (totalSlots >= 8) {
//       showSnackbar("Maximum 8 property images are allowed.", "warning");
//       return;
//     }

//     setPropertyForm((previous) => ({
//       ...previous,
//       property_images: [...previous.property_images, null],
//     }));
//   };

//   const removeImageField = (index) => {
//     setPropertyForm((previous) => {
//       const updatedImages = previous.property_images.filter(
//         (_, imageIndex) => imageIndex !== index,
//       );

//       return {
//         ...previous,
//         property_images:
//           updatedImages.length > 0 ? updatedImages : [null],
//       };
//     });
//   };

//   const totalImageSlots =
//     (existingMainImage ? 1 : 0) +
//     existingGalleryImages.length +
//     propertyForm.property_images.length;

//   return (
//     <Box
//       sx={{
//         display: "grid",
//         gridTemplateColumns: {
//           xs: "1fr",
//           sm: "repeat(2, minmax(0, 1fr))",
//         },
//         gap: 2,
//       }}
//     >
//       <TextField
//         fullWidth
//         required
//         label="Property Title"
//         name="title"
//         value={propertyForm.title}
//         onChange={handleChange}
//         sx={filterFieldStyle}
//       />

//       <TextField
//         select
//         fullWidth
//         required
//         label="Property Type"
//         name="property_type"
//         value={propertyForm.property_type}
//         onChange={handleChange}
//         sx={filterFieldStyle}
//       >
//         <MenuItem value="house">House</MenuItem>
//         <MenuItem value="villa">Villa</MenuItem>
//         <MenuItem value="apartment">Apartment</MenuItem>
//         <MenuItem value="land">Land</MenuItem>
//         <MenuItem value="commercial">Commercial</MenuItem>
//       </TextField>

//       <TextField
//         select
//         fullWidth
//         required
//         label="Listing Type"
//         name="listing_type"
//         value={propertyForm.listing_type}
//         onChange={handleChange}
//         sx={filterFieldStyle}
//       >
//         <MenuItem value="sale">Sale</MenuItem>
//         <MenuItem value="rent">Rent</MenuItem>
//       </TextField>

//       <TextField
//         fullWidth
//         required
//         type="number"
//         label="Price"
//         name="price"
//         value={propertyForm.price}
//         onChange={handleChange}
//         inputProps={{ min: 0 }}
//         sx={filterFieldStyle}
//       />

//       <TextField
//         fullWidth
//         required
//         label="Location"
//         name="location"
//         value={propertyForm.location}
//         onChange={handleChange}
//         sx={filterFieldStyle}
//       />

//       <TextField
//         fullWidth
//         label="Address"
//         name="address"
//         value={propertyForm.address}
//         onChange={handleChange}
//         sx={filterFieldStyle}
//       />

//       {propertyForm.property_type && (
//         <Box
//           sx={{
//             gridColumn: "1 / -1",
//             mt: 0.5,
//             p: 2,
//             borderRadius: "18px",
//             bgcolor: "#f8fafc",
//             border: "1px solid #e5e7eb",
//           }}
//         >
//           <Typography
//             sx={{
//               fontSize: 15,
//               fontWeight: 850,
//               color: "#101828",
//             }}
//           >
//             {propertyForm.property_type === "land"
//               ? "Land Details"
//               : propertyForm.property_type === "commercial"
//                 ? "Commercial Details"
//                 : propertyForm.property_type === "apartment"
//                   ? "Apartment Details"
//                   : "House / Villa Details"}
//           </Typography>

//           <Box
//             sx={{
//               display: "grid",
//               gridTemplateColumns: {
//                 xs: "1fr",
//                 sm: "repeat(2, minmax(0, 1fr))",
//               },
//               gap: 2,
//               mt: 2,
//             }}
//           >
//             {["house", "villa", "apartment"].includes(
//               propertyForm.property_type,
//             ) && (
//               <>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Bedrooms"
//                   name="bedrooms"
//                   value={propertyForm.bedrooms}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Bathrooms"
//                   name="bathrooms"
//                   value={propertyForm.bathrooms}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Area in sq.ft"
//                   name="area_sqft"
//                   value={propertyForm.area_sqft}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />
//               </>
//             )}

//             {["house", "villa"].includes(propertyForm.property_type) && (
//               <>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Total Floors"
//                   name="total_floors"
//                   value={propertyForm.total_floors}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Property Floor"
//                   name="floors"
//                   value={propertyForm.floors}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   select
//                   fullWidth
//                   label="Parking"
//                   name="parking"
//                   value={propertyForm.parking}
//                   onChange={handleChange}
//                   sx={filterFieldStyle}
//                 >
//                   <MenuItem value="">Select Parking</MenuItem>
//                   <MenuItem value="available">Available</MenuItem>
//                   <MenuItem value="not_available">Not Available</MenuItem>
//                 </TextField>

//                 <TextField
//                   select
//                   fullWidth
//                   label="Furnishing"
//                   name="furnishing"
//                   value={propertyForm.furnishing}
//                   onChange={handleChange}
//                   sx={filterFieldStyle}
//                 >
//                   <MenuItem value="">Select Furnishing</MenuItem>
//                   <MenuItem value="furnished">Furnished</MenuItem>
//                   <MenuItem value="semi_furnished">Semi Furnished</MenuItem>
//                   <MenuItem value="unfurnished">Unfurnished</MenuItem>
//                 </TextField>
//               </>
//             )}

//             {propertyForm.property_type === "apartment" && (
//               <>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Floor Number"
//                   name="floor_number"
//                   value={propertyForm.floor_number}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Total Floors"
//                   name="total_floors"
//                   value={propertyForm.total_floors}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />
//               </>
//             )}

//             {propertyForm.property_type === "land" && (
//               <>
//                 <TextField
//                   fullWidth
//                   required
//                   type="number"
//                   label="Total Cents"
//                   name="total_cent"
//                   value={propertyForm.total_cent}
//                   onChange={handleChange}
//                   inputProps={{ min: 0, step: "0.01" }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Price Per Cent"
//                   name="price_per_cent"
//                   value={propertyForm.price_per_cent}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   fullWidth
//                   label="Road Access"
//                   name="road_access"
//                   value={propertyForm.road_access}
//                   onChange={handleChange}
//                   placeholder="Example: 5 metre road access"
//                   sx={filterFieldStyle}
//                 />

//                 <TextField
//                   select
//                   fullWidth
//                   label="Plot Type"
//                   name="plot_type"
//                   value={propertyForm.plot_type}
//                   onChange={handleChange}
//                   sx={filterFieldStyle}
//                 >
//                   <MenuItem value="">Select Plot Type</MenuItem>
//                   <MenuItem value="residential">Residential</MenuItem>
//                   <MenuItem value="commercial">Commercial</MenuItem>
//                   <MenuItem value="agricultural">Agricultural</MenuItem>
//                   <MenuItem value="industrial">Industrial</MenuItem>
//                 </TextField>
//               </>
//             )}

//             {propertyForm.property_type === "commercial" && (
//               <>
//                 <TextField
//                   select
//                   fullWidth
//                   required
//                   label="Commercial Type"
//                   name="commercial_type"
//                   value={propertyForm.commercial_type}
//                   onChange={handleChange}
//                   sx={filterFieldStyle}
//                 >
//                   <MenuItem value="">Select Commercial Type</MenuItem>
//                   <MenuItem value="shop">Shop</MenuItem>
//                   <MenuItem value="office">Office</MenuItem>
//                   <MenuItem value="warehouse">Warehouse</MenuItem>
//                   <MenuItem value="showroom">Showroom</MenuItem>
//                   <MenuItem value="building">Commercial Building</MenuItem>
//                 </TextField>

//                 <TextField
//                   fullWidth
//                   required
//                   type="number"
//                   label="Built-up Area in sq.ft"
//                   name="builtup_area_sqft"
//                   value={propertyForm.builtup_area_sqft}
//                   onChange={handleChange}
//                   inputProps={{ min: 0 }}
//                   sx={filterFieldStyle}
//                 />
//               </>
//             )}
//           </Box>
//         </Box>
//       )}

//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker
//           label="Expiry Date"
//           value={
//             propertyForm.expires_at ? dayjs(propertyForm.expires_at) : null
//           }
//           minDate={dayjs().startOf("day")}
//           onChange={(newValue) => {
//             setPropertyForm((previous) => ({
//               ...previous,
//               expires_at: newValue ? newValue.format("YYYY-MM-DD") : "",
//             }));
//           }}
//           slotProps={{
//             textField: {
//               fullWidth: true,
//               required: true,
//               sx: filterFieldStyle,
//             },
//           }}
//         />
//       </LocalizationProvider>

//       <Box
//         sx={{
//           gridColumn: "1 / -1",
//           p: 2,
//           borderRadius: "18px",
//           bgcolor: "#ffffff",
//           border: "1px solid #e5e7eb",
//         }}
//       >
//         <Typography
//           sx={{
//             fontSize: 15,
//             fontWeight: 850,
//             color: "#101828",
//           }}
//         >
//           Property Images
//         </Typography>

//         <Typography
//           sx={{
//             mt: 0.5,
//             mb: 2,
//             color: "#667085",
//             fontSize: 13,
//             lineHeight: 1.6,
//           }}
//         >
//           {isEditing
//             ? "Current images remain unchanged unless you replace or remove them. The first newly selected image replaces the main image."
//             : "First image will be used as the main image. Remaining images will be added to the property gallery."}
//         </Typography>

//         {isEditing && existingMainImage && (
//           <Box sx={{ mb: 2 }}>
//             <Typography
//               sx={{
//                 mb: 1,
//                 fontSize: 13.5,
//                 fontWeight: 800,
//                 color: "#344054",
//               }}
//             >
//               Current Main Image
//             </Typography>

//             <Box
//               component="img"
//               src={existingMainImage}
//               alt="Current main property"
//               sx={{
//                 width: 180,
//                 height: 120,
//                 display: "block",
//                 objectFit: "cover",
//                 borderRadius: "14px",
//                 border: "1px solid #e5e7eb",
//               }}
//             />
//           </Box>
//         )}

//         {isEditing && existingGalleryImages.length > 0 && (
//           <Box sx={{ mb: 2.2 }}>
//             <Typography
//               sx={{
//                 mb: 1,
//                 fontSize: 13.5,
//                 fontWeight: 800,
//                 color: "#344054",
//               }}
//             >
//               Current Gallery Images
//             </Typography>

//             <Box
//               sx={{
//                 display: "grid",
//                 gridTemplateColumns: {
//                   xs: "repeat(2, minmax(0, 1fr))",
//                   sm: "repeat(4, minmax(0, 1fr))",
//                 },
//                 gap: 1.2,
//               }}
//             >
//               {existingGalleryImages.map((image) => (
//                 <Box
//                   key={image.id}
//                   sx={{
//                     position: "relative",
//                     overflow: "hidden",
//                     borderRadius: "14px",
//                     border: "1px solid #e5e7eb",
//                     bgcolor: "#f8fafc",
//                   }}
//                 >
//                   <Box
//                     component="img"
//                     src={image.image}
//                     alt="Property gallery"
//                     sx={{
//                       width: "100%",
//                       height: 105,
//                       display: "block",
//                       objectFit: "cover",
//                     }}
//                   />

//                   <IconButton
//                     size="small"
//                     aria-label="Remove gallery image"
//                     onClick={() => onRemoveExistingGalleryImage?.(image.id)}
//                     sx={{
//                       position: "absolute",
//                       top: 5,
//                       right: 5,
//                       bgcolor: "rgba(255,255,255,0.94)",
//                       color: "#b42318",
//                       "&:hover": {
//                         bgcolor: "#fef3f2",
//                       },
//                     }}
//                   >
//                     <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         )}

//         <Stack spacing={1.2}>
//           {propertyForm.property_images.map((image, index) => (
//             <Box
//               key={index}
//               sx={{
//                 display: "flex",
//                 flexDirection: { xs: "column", sm: "row" },
//                 alignItems: { xs: "stretch", sm: "center" },
//                 justifyContent: "space-between",
//                 gap: 1.3,
//                 p: 1.5,
//                 borderRadius: "14px",
//                 border: "1px solid #e5e7eb",
//                 bgcolor: index === 0 ? "#ecfdf5" : "#f8fafc",
//               }}
//             >
//               <Box sx={{ minWidth: 0, flex: 1 }}>
//                 <Typography
//                   sx={{
//                     fontSize: 13.5,
//                     fontWeight: 800,
//                     color: "#344054",
//                   }}
//                 >
//                   {index === 0
//                     ? isEditing
//                       ? "New Main Image (optional)"
//                       : "Main Image"
//                     : `New Gallery Image ${index}`}
//                 </Typography>

//                 <Typography
//                   sx={{
//                     mt: 0.3,
//                     color: image ? "#475467" : "#98a2b3",
//                     fontSize: 12.5,
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                     whiteSpace: "nowrap",
//                   }}
//                 >
//                   {image ? image.name : "No image selected"}
//                 </Typography>
//               </Box>

//               <Stack direction="row" spacing={1} justifyContent="flex-end">
//                 <Button
//                   component="label"
//                   size="small"
//                   startIcon={<CloudUploadOutlinedIcon />}
//                   sx={{
//                     borderRadius: "10px",
//                     textTransform: "none",
//                     fontWeight: 750,
//                     color: "#047857",
//                     bgcolor: "#ffffff",
//                     border: "1px solid #bbf7d0",
//                     px: 1.5,
//                     "&:hover": {
//                       bgcolor: "#ecfdf5",
//                       borderColor: "#86efac",
//                     },
//                   }}
//                 >
//                   Upload
//                   <input
//                     hidden
//                     type="file"
//                     accept="image/*"
//                     onChange={(event) => handleImageChange(event, index)}
//                   />
//                 </Button>

//                 {propertyForm.property_images.length > 1 && (
//                   <IconButton
//                     size="small"
//                     aria-label="Remove new image field"
//                     onClick={() => removeImageField(index)}
//                     sx={{
//                       borderRadius: "10px",
//                       color: "#b42318",
//                       bgcolor: "#ffffff",
//                       border: "1px solid #fecdca",
//                       "&:hover": {
//                         bgcolor: "#fef3f2",
//                       },
//                     }}
//                   >
//                     <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
//                   </IconButton>
//                 )}
//               </Stack>
//             </Box>
//           ))}
//         </Stack>

//         <Button
//           type="button"
//           onClick={addImageField}
//           disabled={totalImageSlots >= 8}
//           startIcon={<AddRoundedIcon />}
//           sx={{
//             mt: 1.7,
//             width: "100%",
//             py: 1.1,
//             borderRadius: "12px",
//             textTransform: "none",
//             fontWeight: 750,
//             color: "#047857",
//             bgcolor: "#f0fdf4",
//             border: "1px dashed #86efac",
//             "&:hover": {
//               bgcolor: "#dcfce7",
//             },
//           }}
//         >
//           Add Another Image
//         </Button>
//       </Box>

//       <TextField
//         fullWidth
//         multiline
//         minRows={4}
//         label="Description"
//         name="description"
//         value={propertyForm.description}
//         onChange={handleChange}
//         sx={{
//           ...filterFieldStyle,
//           gridColumn: { xs: "auto", sm: "1 / -1" },
//         }}
//       />
//     </Box>
//   );
// }

// export default PropertyFormFields;



import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import UndoRoundedIcon from "@mui/icons-material/UndoRounded";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  clearTypeSpecificFields,
  filterFieldStyle,
} from "./propertyFormUtils";

const MAX_PROPERTY_IMAGES = 8;

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || ""
).replace(/\/api\/?$/, "");

const getImageUrl = (value) => {
  const image = typeof value === "string" ? value : value?.image;

  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `${API_BASE_URL}${image}`;
};

function NewImagePreview({
  image,
  index,
  isMainImage,
  onRemove,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        border: isMainImage
          ? "1.5px solid #34d399"
          : "1px solid #e4e7ec",
        bgcolor: "#ffffff",
        boxShadow: isMainImage
          ? "0 8px 22px rgba(5,150,105,0.10)"
          : "0 6px 18px rgba(15,23,42,0.05)",
      }}
    >
      <Box
        component="img"
        src={previewUrl}
        alt={isMainImage ? "New main property" : `New property ${index + 1}`}
        sx={{
          display: "block",
          width: "100%",
          height: 132,
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
            fontWeight: 800,
          }}
        >
          {isMainImage ? "Main Image" : `Gallery Image ${index + 1}`}
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

      {isMainImage && (
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
            fontWeight: 900,
            letterSpacing: "0.3px",
          }}
        >
          MAIN
        </Box>
      )}

      <IconButton
        type="button"
        aria-label={`Remove selected image ${index + 1}`}
        onClick={() => onRemove(index)}
        sx={{
          position: "absolute",
          top: 7,
          right: 7,
          width: 29,
          height: 29,
          color: "#ffffff",
          bgcolor: "rgba(15,23,42,0.72)",
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

function ExistingImagePreview({
  image,
  label,
  markedForRemoval,
  onToggleRemove,
}) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "14px",
        border: markedForRemoval
          ? "1.5px solid #f04438"
          : label === "MAIN"
            ? "1.5px solid #34d399"
            : "1px solid #e4e7ec",
        bgcolor: "#ffffff",
      }}
    >
      <Box
        component="img"
        src={getImageUrl(image)}
        alt={label}
        sx={{
          display: "block",
          width: "100%",
          height: 112,
          objectFit: "cover",
          opacity: markedForRemoval ? 0.35 : 1,
          filter: markedForRemoval ? "grayscale(0.35)" : "none",
          transition: "0.2s ease",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: 7,
          left: 7,
          px: 0.8,
          py: 0.3,
          borderRadius: "999px",
          bgcolor: markedForRemoval
            ? "#b42318"
            : label === "MAIN"
              ? "#047857"
              : "rgba(15,23,42,0.72)",
          color: "#ffffff",
          fontSize: 9.5,
          fontWeight: 900,
          letterSpacing: "0.2px",
        }}
      >
        {markedForRemoval ? "REMOVE ON UPDATE" : label}
      </Box>

      <IconButton
        type="button"
        aria-label={
          markedForRemoval
            ? "Undo image removal"
            : "Mark image for removal"
        }
        onClick={onToggleRemove}
        sx={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 29,
          height: 29,
          color: "#ffffff",
          bgcolor: markedForRemoval
            ? "#047857"
            : "rgba(15,23,42,0.72)",
          backdropFilter: "blur(4px)",
          "&:hover": {
            bgcolor: markedForRemoval ? "#065f46" : "#b42318",
          },
        }}
      >
        {markedForRemoval ? (
          <UndoRoundedIcon sx={{ fontSize: 17 }} />
        ) : (
          <CloseRoundedIcon sx={{ fontSize: 17 }} />
        )}
      </IconButton>
    </Box>
  );
}

function PropertyFormFields({
  propertyForm,
  setPropertyForm,
  showSnackbar,
  mode = "add",
  existingMainImage = "",
  existingGalleryImages = [],
  removeMainImage = false,
  removedImageIds = [],
  onToggleRemoveMainImage,
  onToggleRemoveExistingGalleryImage,
}) {
  const isEditing = mode === "edit";

  const keptExistingGalleryCount = useMemo(
    () =>
      existingGalleryImages.filter(
        (image) => !removedImageIds.includes(image.id),
      ).length,
    [existingGalleryImages, removedImageIds],
  );

  const keptExistingCount =
    (isEditing && existingMainImage && !removeMainImage ? 1 : 0) +
    keptExistingGalleryCount;

  const selectedImages = propertyForm.property_images.filter(
    (image) => image instanceof File,
  );

  const newImagesBecomeMain =
    !isEditing || removeMainImage || !existingMainImage;

  const totalImageCount = keptExistingCount + selectedImages.length;

  const remainingSlots = Math.max(
    MAX_PROPERTY_IMAGES - totalImageCount,
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "property_type") {
      setPropertyForm((previous) =>
        clearTypeSpecificFields(previous, value),
      );
      return;
    }

    setPropertyForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageSelection = (event) => {
    const pickedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (pickedFiles.length === 0) return;

    const validImages = pickedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (validImages.length !== pickedFiles.length) {
      showSnackbar("Only image files are allowed.", "warning");
    }

    const uniqueImages = validImages.filter(
      (newImage) =>
        !selectedImages.some(
          (currentImage) =>
            currentImage.name === newImage.name &&
            currentImage.size === newImage.size &&
            currentImage.lastModified === newImage.lastModified,
        ),
    );

    if (remainingSlots <= 0) {
      showSnackbar(
        `Maximum ${MAX_PROPERTY_IMAGES} property images are allowed.`,
        "warning",
      );
      return;
    }

    const acceptedImages = uniqueImages.slice(0, remainingSlots);

    setPropertyForm((previous) => ({
      ...previous,
      property_images: [
        ...previous.property_images.filter(
          (image) => image instanceof File,
        ),
        ...acceptedImages,
      ],
    }));

    if (uniqueImages.length > remainingSlots) {
      showSnackbar(
        `Only ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        } can be added. Maximum limit is ${MAX_PROPERTY_IMAGES}.`,
        "warning",
      );
    }
  };

  const removeNewImage = (index) => {
    setPropertyForm((previous) => ({
      ...previous,
      property_images: previous.property_images.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        required
        label="Property Title"
        name="title"
        value={propertyForm.title}
        onChange={handleChange}
        sx={filterFieldStyle}
      />

      <TextField
        select
        fullWidth
        required
        label="Property Type"
        name="property_type"
        value={propertyForm.property_type}
        onChange={handleChange}
        sx={filterFieldStyle}
      >
        <MenuItem value="house">House</MenuItem>
        <MenuItem value="villa">Villa</MenuItem>
        <MenuItem value="apartment">Apartment</MenuItem>
        <MenuItem value="land">Land</MenuItem>
        <MenuItem value="commercial">Commercial</MenuItem>
      </TextField>

      <TextField
        select
        fullWidth
        required
        label="Listing Type"
        name="listing_type"
        value={propertyForm.listing_type}
        onChange={handleChange}
        sx={filterFieldStyle}
      >
        <MenuItem value="sale">Sale</MenuItem>
        <MenuItem value="rent">Rent</MenuItem>
      </TextField>

      <TextField
        fullWidth
        required
        type="number"
        label="Price"
        name="price"
        value={propertyForm.price}
        onChange={handleChange}
        inputProps={{ min: 0 }}
        sx={filterFieldStyle}
      />

      <TextField
        fullWidth
        required
        label="Location"
        name="location"
        value={propertyForm.location}
        onChange={handleChange}
        sx={filterFieldStyle}
      />

      <TextField
        fullWidth
        label="Address"
        name="address"
        value={propertyForm.address}
        onChange={handleChange}
        sx={filterFieldStyle}
      />

      {propertyForm.property_type && (
        <Box
          sx={{
            gridColumn: "1 / -1",
            mt: 0.5,
            p: 2,
            borderRadius: "18px",
            bgcolor: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 850,
              color: "#101828",
            }}
          >
            {propertyForm.property_type === "land"
              ? "Land Details"
              : propertyForm.property_type === "commercial"
                ? "Commercial Details"
                : propertyForm.property_type === "apartment"
                  ? "Apartment Details"
                  : "House / Villa Details"}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
              mt: 2,
            }}
          >
            {["house", "villa", "apartment"].includes(
              propertyForm.property_type,
            ) && (
              <>
                <TextField
                  fullWidth
                  type="number"
                  label="Bedrooms"
                  name="bedrooms"
                  value={propertyForm.bedrooms}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Bathrooms"
                  name="bathrooms"
                  value={propertyForm.bathrooms}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Area in sq.ft"
                  name="area_sqft"
                  value={propertyForm.area_sqft}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />
              </>
            )}

            {["house", "villa"].includes(propertyForm.property_type) && (
              <>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Floors"
                  name="total_floors"
                  value={propertyForm.total_floors}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Property Floor"
                  name="floors"
                  value={propertyForm.floors}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  select
                  fullWidth
                  label="Parking"
                  name="parking"
                  value={propertyForm.parking}
                  onChange={handleChange}
                  sx={filterFieldStyle}
                >
                  <MenuItem value="">Select Parking</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="not_available">Not Available</MenuItem>
                </TextField>

                <TextField
                  select
                  fullWidth
                  label="Furnishing"
                  name="furnishing"
                  value={propertyForm.furnishing}
                  onChange={handleChange}
                  sx={filterFieldStyle}
                >
                  <MenuItem value="">Select Furnishing</MenuItem>
                  <MenuItem value="furnished">Furnished</MenuItem>
                  <MenuItem value="semi_furnished">Semi Furnished</MenuItem>
                  <MenuItem value="unfurnished">Unfurnished</MenuItem>
                </TextField>
              </>
            )}

            {propertyForm.property_type === "apartment" && (
              <>
                <TextField
                  fullWidth
                  type="number"
                  label="Floor Number"
                  name="floor_number"
                  value={propertyForm.floor_number}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Total Floors"
                  name="total_floors"
                  value={propertyForm.total_floors}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />
              </>
            )}

            {propertyForm.property_type === "land" && (
              <>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Total Cents"
                  name="total_cent"
                  value={propertyForm.total_cent}
                  onChange={handleChange}
                  inputProps={{ min: 0, step: "0.01" }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Price Per Cent"
                  name="price_per_cent"
                  value={propertyForm.price_per_cent}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />

                <TextField
                  fullWidth
                  label="Road Access"
                  name="road_access"
                  value={propertyForm.road_access}
                  onChange={handleChange}
                  placeholder="Example: 5 metre road access"
                  sx={filterFieldStyle}
                />

                <TextField
                  select
                  fullWidth
                  label="Plot Type"
                  name="plot_type"
                  value={propertyForm.plot_type}
                  onChange={handleChange}
                  sx={filterFieldStyle}
                >
                  <MenuItem value="">Select Plot Type</MenuItem>
                  <MenuItem value="residential">Residential</MenuItem>
                  <MenuItem value="commercial">Commercial</MenuItem>
                  <MenuItem value="agricultural">Agricultural</MenuItem>
                  <MenuItem value="industrial">Industrial</MenuItem>
                </TextField>
              </>
            )}

            {propertyForm.property_type === "commercial" && (
              <>
                <TextField
                  select
                  fullWidth
                  required
                  label="Commercial Type"
                  name="commercial_type"
                  value={propertyForm.commercial_type}
                  onChange={handleChange}
                  sx={filterFieldStyle}
                >
                  <MenuItem value="">Select Commercial Type</MenuItem>
                  <MenuItem value="shop">Shop</MenuItem>
                  <MenuItem value="office">Office</MenuItem>
                  <MenuItem value="warehouse">Warehouse</MenuItem>
                  <MenuItem value="showroom">Showroom</MenuItem>
                  <MenuItem value="building">Commercial Building</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Built-up Area in sq.ft"
                  name="builtup_area_sqft"
                  value={propertyForm.builtup_area_sqft}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  sx={filterFieldStyle}
                />
              </>
            )}
          </Box>
        </Box>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Expiry Date"
          value={
            propertyForm.expires_at
              ? dayjs(propertyForm.expires_at)
              : null
          }
          minDate={dayjs().startOf("day")}
          onChange={(newValue) => {
            setPropertyForm((previous) => ({
              ...previous,
              expires_at: newValue
                ? newValue.format("YYYY-MM-DD")
                : "",
            }));
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              sx: filterFieldStyle,
            },
          }}
        />
      </LocalizationProvider>

      <Box
        sx={{
          gridColumn: "1 / -1",
          p: { xs: 2, sm: 2.4 },
          borderRadius: "18px",
          bgcolor: "#ffffff",
          border: "1px solid #e4e7ec",
          boxShadow: "0 6px 18px rgba(15,23,42,0.035)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          gap={1.2}
          sx={{ mb: 1.8, width: "100%" }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                color: "#101828",
                fontSize: 15,
                fontWeight: 850,
              }}
            >
              Property Images
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "#667085",
                fontSize: 12.7,
                lineHeight: 1.55,
              }}
            >
              {isEditing
                ? "Existing images remain unchanged unless you mark them with ×. Changes apply after Update Property."
                : `Select 1 to ${MAX_PROPERTY_IMAGES} images together. The first selected image becomes the main image.`}
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
                totalImageCount >= MAX_PROPERTY_IMAGES
                  ? "#fef3f2"
                  : "#ecfdf3",
              border:
                totalImageCount >= MAX_PROPERTY_IMAGES
                  ? "1px solid #fecdca"
                  : "1px solid #abefc6",
            }}
          >
            <Typography
              sx={{
                color:
                  totalImageCount >= MAX_PROPERTY_IMAGES
                    ? "#b42318"
                    : "#067647",
                fontSize: 12.5,
                fontWeight: 900,
              }}
            >
              {totalImageCount}/{MAX_PROPERTY_IMAGES}
            </Typography>

            <Typography
              sx={{
                color:
                  totalImageCount >= MAX_PROPERTY_IMAGES
                    ? "#b42318"
                    : "#067647",
                fontSize: 11.8,
                fontWeight: 750,
              }}
            >
              {isEditing ? "final" : "selected"}
            </Typography>
          </Box>
        </Stack>

        {isEditing &&
          (existingMainImage || existingGalleryImages.length > 0) && (
            <Box sx={{ mb: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1.1 }}
              >
                <Typography
                  sx={{
                    color: "#344054",
                    fontSize: 13,
                    fontWeight: 850,
                  }}
                >
                  Current images
                </Typography>

                <Typography
                  sx={{
                    color: "#98a2b3",
                    fontSize: 11.5,
                  }}
                >
                  Click × to mark for removal
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, minmax(0, 1fr))",
                    sm: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1.2,
                }}
              >
                {existingMainImage && (
                  <ExistingImagePreview
                    image={existingMainImage}
                    label="MAIN"
                    markedForRemoval={removeMainImage}
                    onToggleRemove={onToggleRemoveMainImage}
                  />
                )}

                {existingGalleryImages.map((image, index) => (
                  <ExistingImagePreview
                    key={image.id || `${image.image}-${index}`}
                    image={image}
                    label={`GALLERY ${index + 1}`}
                    markedForRemoval={removedImageIds.includes(
                      image.id,
                    )}
                    onToggleRemove={() =>
                      onToggleRemoveExistingGalleryImage?.(
                        image.id,
                      )
                    }
                  />
                ))}
              </Box>

              {(removeMainImage || removedImageIds.length > 0) && (
                <Box
                  sx={{
                    mt: 1.4,
                    px: 1.4,
                    py: 1.1,
                    borderRadius: "12px",
                    bgcolor: "#fff7ed",
                    border: "1px solid #fed7aa",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#9a3412",
                      fontSize: 12,
                      fontWeight: 750,
                      lineHeight: 1.5,
                    }}
                  >
                    Marked images will be removed only after clicking
                    Update Property. Use the green undo icon to restore
                    them.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

        {isEditing &&
          (existingMainImage || existingGalleryImages.length > 0) && (
            <Divider sx={{ mb: 2 }} />
          )}

        <Box
          component="label"
          sx={{
            minHeight: { xs: 116, sm: 92 },
            borderRadius: "14px",
            border: "1.5px dashed",
            borderColor:
              remainingSlots <= 0 ? "#d0d5dd" : "#86d7b4",
            bgcolor:
              remainingSlots <= 0 ? "#f8fafc" : "#f7fcfa",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 2.2 },
            py: { xs: 2, sm: 1.7 },
            cursor:
              remainingSlots <= 0 ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor:
                remainingSlots <= 0 ? "#f8fafc" : "#effaf5",
              borderColor:
                remainingSlots <= 0 ? "#d0d5dd" : "#34b27b",
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
                  remainingSlots <= 0 ? "#f2f4f7" : "#dcfce7",
                color:
                  remainingSlots <= 0 ? "#98a2b3" : "#047857",
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
                    remainingSlots <= 0 ? "#98a2b3" : "#344054",
                  fontSize: 13.8,
                  fontWeight: 850,
                }}
              >
                {remainingSlots <= 0
                  ? "Maximum image limit reached"
                  : selectedImages.length > 0
                    ? "Add more images"
                    : isEditing && removeMainImage
                      ? "Choose a new main image"
                      : "Choose property images"}
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  color: "#98a2b3",
                  fontSize: 11.8,
                }}
              >
                {remainingSlots} slot
                {remainingSlots === 1 ? "" : "s"} available · JPG,
                PNG or WEBP
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
                remainingSlots <= 0 ? "#f2f4f7" : "#047857",
              color:
                remainingSlots <= 0 ? "#98a2b3" : "#ffffff",
              textAlign: "center",
              fontSize: 12.5,
              fontWeight: 850,
              boxShadow:
                remainingSlots <= 0
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
            disabled={remainingSlots <= 0}
            onChange={handleImageSelection}
          />
        </Box>

        {selectedImages.length > 0 && (
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
                  fontWeight: 850,
                }}
              >
                Newly selected images
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
              {selectedImages.map((image, index) => (
                <NewImagePreview
                  key={`${image.name}-${image.size}-${image.lastModified}`}
                  image={image}
                  index={index}
                  isMainImage={newImagesBecomeMain && index === 0}
                  onRemove={removeNewImage}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      <TextField
        fullWidth
        multiline
        minRows={4}
        label="Description"
        name="description"
        value={propertyForm.description}
        onChange={handleChange}
        sx={{
          ...filterFieldStyle,
          gridColumn: { xs: "auto", sm: "1 / -1" },
        }}
      />
    </Box>
  );
}

export default PropertyFormFields;
