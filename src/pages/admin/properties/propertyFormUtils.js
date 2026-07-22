import dayjs from "dayjs";

export const MAX_PROPERTY_IMAGES = 8;

export const createInitialPropertyForm = () => ({
  title: "",
  description: "",
  property_type: "",
  listing_type: "",
  price: "",
  location: "",
  address: "",
  expires_at: "",
  property_images: [],

  bedrooms: "",
  bathrooms: "",
  area_sqft: "",

  total_floors: "",
  floors: "",
  parking: "",
  furnishing: "",

  floor_number: "",

  total_cent: "",
  price_per_cent: "",
  road_access: "",
  plot_type: "",

  commercial_type: "",
  builtup_area_sqft: "",
});

export const propertyToForm = (property) => ({
  title: property?.title || "",
  description: property?.description || "",
  property_type: property?.property_type || "",
  listing_type: property?.listing_type || "",
  price: property?.price ?? "",
  location: property?.location || "",
  address: property?.address || "",
  expires_at: property?.expires_at
    ? dayjs(property.expires_at).format("YYYY-MM-DD")
    : "",
  property_images: [],

  bedrooms: property?.bedrooms ?? "",
  bathrooms: property?.bathrooms ?? "",
  area_sqft: property?.area_sqft ?? "",

  total_floors: property?.total_floors ?? "",
  floors: property?.floors ?? "",
  parking: property?.parking || "",
  furnishing: property?.furnishing || "",

  floor_number: property?.floor_number ?? "",

  total_cent: property?.total_cent ?? "",
  price_per_cent: property?.price_per_cent ?? "",
  road_access: property?.road_access || "",
  plot_type: property?.plot_type || "",

  commercial_type: property?.commercial_type || "",
  builtup_area_sqft: property?.builtup_area_sqft ?? "",
});

export const optionalPropertyFields = [
  "bedrooms",
  "bathrooms",
  "area_sqft",
  "total_floors",
  "floors",
  "parking",
  "furnishing",
  "floor_number",
  "total_cent",
  "price_per_cent",
  "road_access",
  "plot_type",
  "commercial_type",
  "builtup_area_sqft",
];

export const validatePropertyForm = (
  propertyForm,
  { requireImage = false } = {},
) => {
  if (
    !propertyForm.title.trim() ||
    !propertyForm.property_type ||
    !propertyForm.listing_type ||
    propertyForm.price === "" ||
    propertyForm.price === null ||
    !propertyForm.location.trim() ||
    !propertyForm.expires_at
  ) {
    return "Please complete all required property fields.";
  }

  if (Number(propertyForm.price) < 0) {
    return "Price cannot be negative.";
  }

  if (
    propertyForm.property_type === "land" &&
    (propertyForm.total_cent === "" || propertyForm.total_cent === null)
  ) {
    return "Please enter total land cents.";
  }

  if (
    propertyForm.property_type === "commercial" &&
    (!propertyForm.commercial_type ||
      propertyForm.builtup_area_sqft === "" ||
      propertyForm.builtup_area_sqft === null)
  ) {
    return "Please complete commercial property details.";
  }

  const selectedImages = propertyForm.property_images.filter(
    (image) => image instanceof File,
  );

  if (selectedImages.length > MAX_PROPERTY_IMAGES) {
    return `Maximum ${MAX_PROPERTY_IMAGES} property images are allowed.`;
  }

  if (requireImage && selectedImages.length === 0) {
    return "Please select at least one property image.";
  }

  return "";
};

export const buildPropertyFormData = ({
  propertyForm,
  removeImageIds = [],
  includeRemoveImageIds = false,
  removeMainImage = false,
  includeRemoveMainImage = false,
  newImagesBecomeMain = true,
}) => {
  const formData = new FormData();

  formData.append("title", propertyForm.title.trim());
  formData.append("description", propertyForm.description.trim());
  formData.append("property_type", propertyForm.property_type);
  formData.append("listing_type", propertyForm.listing_type);
  formData.append("price", propertyForm.price);
  formData.append("location", propertyForm.location.trim());
  formData.append("address", propertyForm.address.trim());
  formData.append("expires_at", propertyForm.expires_at);

  optionalPropertyFields.forEach((field) => {
    const value = propertyForm[field];

    if (value !== "" && value !== null && value !== undefined) {
      formData.append(field, value);
    }
  });

  const selectedImages = propertyForm.property_images.filter(
    (image) => image instanceof File,
  );

  if (selectedImages.length > 0) {
    if (newImagesBecomeMain) {
      formData.append("main_image", selectedImages[0]);

      selectedImages.slice(1).forEach((image) => {
        formData.append("gallery_images", image);
      });
    } else {
      selectedImages.forEach((image) => {
        formData.append("gallery_images", image);
      });
    }
  }

  if (includeRemoveImageIds) {
    formData.append("remove_image_ids", JSON.stringify(removeImageIds));
  }

  if (includeRemoveMainImage) {
    formData.append("remove_main_image", removeMainImage ? "true" : "false");
  }

  return formData;
};

export const clearTypeSpecificFields = (previous, nextPropertyType) => ({
  ...previous,
  property_type: nextPropertyType,
  bedrooms: "",
  bathrooms: "",
  area_sqft: "",
  total_floors: "",
  floors: "",
  parking: "",
  furnishing: "",
  floor_number: "",
  total_cent: "",
  price_per_cent: "",
  road_access: "",
  plot_type: "",
  commercial_type: "",
  builtup_area_sqft: "",
});

export const getStatusStyle = (status) => {
  if (status === "approved") {
    return {
      label: "Approved",
      bgcolor: "#ecfdf3",
      color: "#067647",
      border: "#abefc6",
    };
  }

  if (status === "rejected") {
    return {
      label: "Rejected",
      bgcolor: "#fef3f2",
      color: "#b42318",
      border: "#fecdca",
    };
  }

  return {
    label: "Pending",
    bgcolor: "#fffaeb",
    color: "#b54708",
    border: "#fedf89",
  };
};

export const formatIndianCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export const filterFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    bgcolor: "#ffffff",
    "& fieldset": {
      borderColor: "#d0d5dd",
    },
    "&:hover fieldset": {
      borderColor: "#98a2b3",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0f766e",
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#0f766e",
  },
};
