import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import adminAxiosInstance from "../../../api/adminAxiosInstance";

function DeletePropertyDialog({
  open,
  property,
  onClose,
  onDeleted,
  showSnackbar,
}) {
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleDelete = async () => {
    if (!property?.id) return;

    try {
      setLoading(true);

      await adminAxiosInstance.delete(
        `/admin-panel/properties/${property.id}/`,
      );

      onDeleted(property.id);
      showSnackbar("Property deleted successfully.", "success");
      onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);

      showSnackbar(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Unable to delete property.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#101828" }}>
        Delete Property
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "#475467", lineHeight: 1.7 }}>
          Are you sure you want to delete <strong>{property?.title}</strong>?
        </Typography>

        <Typography sx={{ mt: 1, fontSize: 13, color: "#98a2b3" }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 700, color: "#475467" }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={loading}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            boxShadow: "none",
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Delete Property"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePropertyDialog;
