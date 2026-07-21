import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import adminAxiosInstance from "../../../api/adminAxiosInstance";
import PropertyFormFields from "./PropertyFormFields";
import {
  buildPropertyFormData,
  createInitialPropertyForm,
  propertyToForm,
  validatePropertyForm,
} from "./propertyFormUtils";

function EditPropertyDialog({
  open,
  property,
  onClose,
  onUpdated,
  showSnackbar,
}) {
  const [propertyForm, setPropertyForm] = useState(
    createInitialPropertyForm,
  );
  const [existingMainImage, setExistingMainImage] = useState("");
  const [existingGalleryImages, setExistingGalleryImages] = useState([]);
  const [removeImageIds, setRemoveImageIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && property) {
      setPropertyForm(propertyToForm(property));
      setExistingMainImage(property.main_image || "");
      setExistingGalleryImages(property.images || []);
      setRemoveImageIds([]);
    }
  }, [open, property]);

  const resetState = () => {
    setPropertyForm(createInitialPropertyForm());
    setExistingMainImage("");
    setExistingGalleryImages([]);
    setRemoveImageIds([]);
  };

  const resetAndClose = () => {
    resetState();
    onClose();
  };

  const handleClose = () => {
    if (loading) return;
    resetAndClose();
  };

  const handleRemoveExistingGalleryImage = (imageId) => {
    setRemoveImageIds((previous) =>
      previous.includes(imageId)
        ? previous
        : [...previous, imageId],
    );

    setExistingGalleryImages((previous) =>
      previous.filter((image) => image.id !== imageId),
    );
  };

  const handleSubmit = async () => {
    if (!property?.id) return;

    const validationMessage = validatePropertyForm(propertyForm);

    if (validationMessage) {
      showSnackbar(validationMessage, "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = buildPropertyFormData({
        propertyForm,
        removeImageIds,
        includeRemoveImageIds: true,
      });

      const response = await adminAxiosInstance.patch(
        `/admin-panel/properties/${property.id}/`,
        formData,
      );

      onUpdated(response.data);
      showSnackbar("Property updated successfully.", "success");
      resetAndClose();
    } catch (error) {
      console.error(error.response?.data || error.message);

      const responseData = error.response?.data;
      const message =
        typeof responseData === "object" && responseData !== null
          ? Object.values(responseData).flat().join(" ")
          : responseData;

      showSnackbar(message || "Unable to update property.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "26px",
          boxShadow: "0 30px 80px rgba(15,23,42,0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2.5, md: 3.5 },
          pt: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 22,
              fontWeight: 900,
              color: "#101828",
            }}
          >
            Edit Property
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              color: "#667085",
              fontSize: 13.5,
            }}
          >
            Update the selected property information.
          </Typography>
        </Box>

        <IconButton
          onClick={handleClose}
          disabled={loading}
          sx={{
            bgcolor: "#f8fafc",
            "&:hover": {
              bgcolor: "#ecfdf5",
            },
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ mt: 2 }} />

      <DialogContent
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 3,
        }}
      >
        <PropertyFormFields
          propertyForm={propertyForm}
          setPropertyForm={setPropertyForm}
          showSnackbar={showSnackbar}
          mode="edit"
          existingMainImage={existingMainImage}
          existingGalleryImages={existingGalleryImages}
          onRemoveExistingGalleryImage={
            handleRemoveExistingGalleryImage
          }
        />

        <Alert
          severity="info"
          sx={{
            mt: 2.5,
            borderRadius: "16px",
          }}
        >
          Existing images remain unchanged unless you replace or remove them.
        </Alert>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 2.5,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            fontWeight: 750,
            color: "#475467",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <EditOutlinedIcon />
            )
          }
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            bgcolor: "#175cd3",
            px: 2.4,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#1849a9",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Updating..." : "Update Property"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditPropertyDialog;
