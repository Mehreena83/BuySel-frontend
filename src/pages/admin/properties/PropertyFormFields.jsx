import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  clearTypeSpecificFields,
  filterFieldStyle,
} from "./propertyFormUtils";

function PropertyFormFields({
  propertyForm,
  setPropertyForm,
  showSnackbar,
  mode = "add",
  existingMainImage = "",
  existingGalleryImages = [],
  onRemoveExistingGalleryImage,
}) {
  const isEditing = mode === "edit";

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

  const handleImageChange = (event, index) => {
    const selectedFile = event.target.files?.[0] || null;

    setPropertyForm((previous) => {
      const updatedImages = [...previous.property_images];
      updatedImages[index] = selectedFile;

      return {
        ...previous,
        property_images: updatedImages,
      };
    });
  };

  const addImageField = () => {
    const existingCount =
      (existingMainImage ? 1 : 0) + existingGalleryImages.length;
    const totalSlots = existingCount + propertyForm.property_images.length;

    if (totalSlots >= 8) {
      showSnackbar("Maximum 8 property images are allowed.", "warning");
      return;
    }

    setPropertyForm((previous) => ({
      ...previous,
      property_images: [...previous.property_images, null],
    }));
  };

  const removeImageField = (index) => {
    setPropertyForm((previous) => {
      const updatedImages = previous.property_images.filter(
        (_, imageIndex) => imageIndex !== index,
      );

      return {
        ...previous,
        property_images:
          updatedImages.length > 0 ? updatedImages : [null],
      };
    });
  };

  const totalImageSlots =
    (existingMainImage ? 1 : 0) +
    existingGalleryImages.length +
    propertyForm.property_images.length;

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
            propertyForm.expires_at ? dayjs(propertyForm.expires_at) : null
          }
          minDate={dayjs().startOf("day")}
          onChange={(newValue) => {
            setPropertyForm((previous) => ({
              ...previous,
              expires_at: newValue ? newValue.format("YYYY-MM-DD") : "",
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
          p: 2,
          borderRadius: "18px",
          bgcolor: "#ffffff",
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
          Property Images
        </Typography>

        <Typography
          sx={{
            mt: 0.5,
            mb: 2,
            color: "#667085",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {isEditing
            ? "Current images remain unchanged unless you replace or remove them. The first newly selected image replaces the main image."
            : "First image will be used as the main image. Remaining images will be added to the property gallery."}
        </Typography>

        {isEditing && existingMainImage && (
          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: 13.5,
                fontWeight: 800,
                color: "#344054",
              }}
            >
              Current Main Image
            </Typography>

            <Box
              component="img"
              src={existingMainImage}
              alt="Current main property"
              sx={{
                width: 180,
                height: 120,
                display: "block",
                objectFit: "cover",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
              }}
            />
          </Box>
        )}

        {isEditing && existingGalleryImages.length > 0 && (
          <Box sx={{ mb: 2.2 }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: 13.5,
                fontWeight: 800,
                color: "#344054",
              }}
            >
              Current Gallery Images
            </Typography>

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
              {existingGalleryImages.map((image) => (
                <Box
                  key={image.id}
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "14px",
                    border: "1px solid #e5e7eb",
                    bgcolor: "#f8fafc",
                  }}
                >
                  <Box
                    component="img"
                    src={image.image}
                    alt="Property gallery"
                    sx={{
                      width: "100%",
                      height: 105,
                      display: "block",
                      objectFit: "cover",
                    }}
                  />

                  <IconButton
                    size="small"
                    aria-label="Remove gallery image"
                    onClick={() => onRemoveExistingGalleryImage?.(image.id)}
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "rgba(255,255,255,0.94)",
                      color: "#b42318",
                      "&:hover": {
                        bgcolor: "#fef3f2",
                      },
                    }}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Stack spacing={1.2}>
          {propertyForm.property_images.map((image, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: "space-between",
                gap: 1.3,
                p: 1.5,
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                bgcolor: index === 0 ? "#ecfdf5" : "#f8fafc",
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 13.5,
                    fontWeight: 800,
                    color: "#344054",
                  }}
                >
                  {index === 0
                    ? isEditing
                      ? "New Main Image (optional)"
                      : "Main Image"
                    : `New Gallery Image ${index}`}
                </Typography>

                <Typography
                  sx={{
                    mt: 0.3,
                    color: image ? "#475467" : "#98a2b3",
                    fontSize: 12.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {image ? image.name : "No image selected"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  component="label"
                  size="small"
                  startIcon={<CloudUploadOutlinedIcon />}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 750,
                    color: "#047857",
                    bgcolor: "#ffffff",
                    border: "1px solid #bbf7d0",
                    px: 1.5,
                    "&:hover": {
                      bgcolor: "#ecfdf5",
                      borderColor: "#86efac",
                    },
                  }}
                >
                  Upload
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageChange(event, index)}
                  />
                </Button>

                {propertyForm.property_images.length > 1 && (
                  <IconButton
                    size="small"
                    aria-label="Remove new image field"
                    onClick={() => removeImageField(index)}
                    sx={{
                      borderRadius: "10px",
                      color: "#b42318",
                      bgcolor: "#ffffff",
                      border: "1px solid #fecdca",
                      "&:hover": {
                        bgcolor: "#fef3f2",
                      },
                    }}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 19 }} />
                  </IconButton>
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Button
          type="button"
          onClick={addImageField}
          disabled={totalImageSlots >= 8}
          startIcon={<AddRoundedIcon />}
          sx={{
            mt: 1.7,
            width: "100%",
            py: 1.1,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 750,
            color: "#047857",
            bgcolor: "#f0fdf4",
            border: "1px dashed #86efac",
            "&:hover": {
              bgcolor: "#dcfce7",
            },
          }}
        >
          Add Another Image
        </Button>
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
