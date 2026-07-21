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
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import adminAxiosInstance from "../../../api/adminAxiosInstance";
import PropertyFormFields from "./PropertyFormFields";
import {
  buildPropertyFormData,
  createInitialPropertyForm,
  validatePropertyForm,
} from "./propertyFormUtils";

function AddPropertyDialog({
  open,
  onClose,
  onCreated,
  showSnackbar,
}) {
  const [propertyForm, setPropertyForm] = useState(
    createInitialPropertyForm,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPropertyForm(createInitialPropertyForm());
    }
  }, [open]);

  const resetAndClose = () => {
    setPropertyForm(createInitialPropertyForm());
    onClose();
  };

  const handleClose = () => {
    if (loading) return;
    resetAndClose();
  };

  const handleSubmit = async () => {
    const validationMessage = validatePropertyForm(propertyForm, {
      requireImage: true,
    });

    if (validationMessage) {
      showSnackbar(validationMessage, "warning");
      return;
    }

    try {
      setLoading(true);

      const formData = buildPropertyFormData({
        propertyForm,
      });

      const response = await adminAxiosInstance.post(
        "/admin-panel/properties/",
        formData,
      );

      onCreated(response.data);
      showSnackbar(
        "Property added and approved successfully.",
        "success",
      );
      resetAndClose();
    } catch (error) {
      console.error(error.response?.data || error.message);

      const responseData = error.response?.data;
      const message =
        typeof responseData === "object" && responseData !== null
          ? Object.values(responseData).flat().join(" ")
          : responseData;

      showSnackbar(message || "Unable to add property.", "error");
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
            Add Property
          </Typography>

          <Typography
            sx={{
              mt: 0.4,
              color: "#667085",
              fontSize: 13.5,
            }}
          >
            Create a new property listing as Master Admin.
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
          mode="add"
        />

        <Alert
          severity="info"
          sx={{
            mt: 2.5,
            borderRadius: "16px",
          }}
        >
          Property created by Master Admin will be approved automatically.
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
              <AddRoundedIcon />
            )
          }
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            bgcolor: "#0f766e",
            px: 2.4,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#0b625d",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Adding..." : "Add Property"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPropertyDialog;
