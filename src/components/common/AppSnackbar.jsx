import { Alert, Snackbar } from "@mui/material";

function AppSnackbar({ open, message, severity = "success", onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "down", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ borderRadius: 2, fontWeight: 700 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
