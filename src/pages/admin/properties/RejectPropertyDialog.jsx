import { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import adminAxiosInstance from "../../../api/adminAxiosInstance";
import { filterFieldStyle } from "./propertyFormUtils";

function RejectPropertyDialog({
  open,
  property,
  onClose,
  onRejected,
  showSnackbar,
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const resetAndClose = () => {
    setReason("");
    onClose();
  };

  const handleClose = () => {
    if (loading) return;
    resetAndClose();
  };

  const handleReject = async () => {
    if (!property?.id) return;

    if (!reason.trim()) {
      showSnackbar("Please enter a rejection reason.", "warning");
      return;
    }

    try {
      setLoading(true);

      const response = await adminAxiosInstance.patch(
        `/admin-panel/properties/${property.id}/reject/`,
        {
          rejection_reason: reason.trim(),
        },
      );

      const updatedProperty = response.data?.property || {
        ...property,
        status: "rejected",
        rejection_reason: reason.trim(),
      };

      onRejected(updatedProperty);
      showSnackbar(
        response.data?.message || "Property rejected successfully.",
        "success",
      );
      resetAndClose();
    } catch (error) {
      console.error(error.response?.data || error.message);

      showSnackbar(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Unable to reject property.",
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
        Reject Property
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: "#667085", lineHeight: 1.6 }}>
          Enter the reason for rejecting <strong>{property?.title}</strong>.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Rejection reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          sx={filterFieldStyle}
        />
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
          onClick={handleReject}
          disabled={loading}
          sx={{
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            boxShadow: "none",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Reject Property"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RejectPropertyDialog;
