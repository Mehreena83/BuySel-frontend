import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { useNavigate } from "react-router-dom";
import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminPlans() {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    property_limit: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminAxiosInstance.get("/admin-panel/plans/");
        setPlans(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin-login");
          return;
        }

        setError("Unable to load plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration_days: "",
      property_limit: "",
    });
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenAddDialog(false);
    setEditingPlan(null);
    resetForm();
  };

  const handleAddPlan = async () => {
    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.duration_days ||
      !formData.property_limit
    ) {
      setSnackbar({
        open: true,
        message: "Please fill all plan fields.",
        severity: "error",
      });
      return;
    }

    const payload = {
      name: formData.name.trim(),
      price: Number(formData.price),
      duration_days: Number(formData.duration_days),
      property_limit: Number(formData.property_limit),
    };

    if (editingPlan) {
      try {
        setSaving(true);

        const response = await adminAxiosInstance.put(
          `/admin-panel/plans/${editingPlan.id}/`,
          payload,
        );

        setPlans((previous) =>
          previous.map((plan) =>
            plan.id === editingPlan.id ? response.data : plan,
          ),
        );

        setSnackbar({
          open: true,
          message: "Plan updated successfully.",
          severity: "success",
        });

        handleCloseDialog();
      } catch (err) {
        console.error(err.response?.data || err.message);

        setSnackbar({
          open: true,
          message: "Unable to update plan.",
          severity: "error",
        });
      } finally {
        setSaving(false);
      }

      return;
    }

    try {
      setSaving(true);

      const response = await adminAxiosInstance.post(
        "/admin-panel/plans/",
        payload,
      );

      setPlans((previous) =>
        [...previous, response.data].sort(
          (first, second) => Number(first.price) - Number(second.price),
        ),
      );

      setSnackbar({
        open: true,
        message: "Plan added successfully.",
        severity: "success",
      });

      handleCloseDialog();
    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

      const responseData = err.response?.data;
      let message = "Unable to add plan.";

      if (responseData && typeof responseData === "object") {
        const firstError = Object.values(responseData)[0];

        if (Array.isArray(firstError)) {
          message = firstError[0];
        } else if (typeof firstError === "string") {
          message = firstError;
        }
      }

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);

    setFormData({
      name: plan.name,
      price: plan.price,
      duration_days: plan.duration_days,
      property_limit: plan.property_limit,
    });

    setOpenAddDialog(true);
  };

  const handleOpenDeleteDialog = (plan) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    if (deleting) return;

    setDeleteDialogOpen(false);
    setSelectedPlan(null);
  };

  const handleDeletePlan = async () => {
    if (!selectedPlan) return;

    try {
      setDeleting(true);

      await adminAxiosInstance.delete(`/admin-panel/plans/${selectedPlan.id}/`);

      setPlans((previous) =>
        previous.filter((plan) => plan.id !== selectedPlan.id),
      );

      setSnackbar({
        open: true,
        message: "Plan deleted successfully.",
        severity: "success",
      });

      handleCloseDeleteDialog();
    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
        return;
      }

      const responseData = err.response?.data;
      let message = "Unable to delete plan.";

      if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.detail) {
        message = responseData.detail;
      }

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 3, md: 4 },
        bgcolor: "#f6f8fb",
        background:
          "radial-gradient(circle at top left, rgba(15,118,110,0.14), transparent 28%), radial-gradient(circle at top right, rgba(16,185,129,0.16), transparent 32%), linear-gradient(135deg, #f8fafc 0%, #f4f7fb 48%, #ecfdf5 100%)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 2,
          }}
        >
          <Box sx={{ p: { xs: 0, md: 0.5 } }}>
            <Typography
              sx={{
                fontSize: { xs: 28, md: 35 },
                fontWeight: 850,
                color: "#101828",
                letterSpacing: "-1px",
                lineHeight: 1.12,
              }}
            >
              Manage Plans
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: "#667085",
                fontSize: { xs: 14, md: 15 },
              }}
            >
              Create and manage subscription plans.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => {
              setEditingPlan(null);
              resetForm();
              setOpenAddDialog(true);
            }}
            sx={{
              ml: { sm: "auto" },
              bgcolor: "#0f766e",
              borderRadius: "18px",
              px: 2.4,
              py: 1.15,
              minWidth: 145,
              fontWeight: 800,
              textTransform: "none",
              boxShadow:
                "0 14px 26px rgba(15, 118, 110, 0.24), inset 0 1px 0 rgba(255,255,255,0.32)",
              transition: "0.22s ease",
              "&:hover": {
                bgcolor: "#115e59",
                boxShadow:
                  "0 18px 34px rgba(15, 118, 110, 0.28), inset 0 1px 0 rgba(255,255,255,0.32)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Add Plan
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "16px",
              border: "1px solid #fecdca",
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              minHeight: 320,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#0f766e" }} />
          </Box>
        ) : plans.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: "1px dashed #d0d5dd",
              borderRadius: "28px",
              bgcolor: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 24px 54px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <CardContent sx={{ textAlign: "center", py: 7 }}>
              <Box
                sx={{
                  width: 74,
                  height: 74,
                  mx: "auto",
                  borderRadius: "26px",
                  bgcolor: "#ecfdf5",
                  color: "#0f766e",
                  display: "grid",
                  placeItems: "center",
                  boxShadow:
                    "0 18px 34px rgba(15, 118, 110, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <WorkspacePremiumOutlinedIcon sx={{ fontSize: 38 }} />
              </Box>

              <Typography
                sx={{
                  mt: 1.8,
                  fontWeight: 850,
                  color: "#344054",
                  fontSize: 18,
                }}
              >
                No plans found
              </Typography>

              <Typography sx={{ mt: 0.5, color: "#667085", fontSize: 14 }}>
                Add your first subscription plan to start.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 1.7, md: 2.2 },
            }}
          >
            {plans.map((plan) => (
              <Card
                key={plan.id}
                elevation={0}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.9)",
                  borderRadius: "30px",
                  bgcolor: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(14px)",
                  boxShadow:
                    "0 24px 50px rgba(15, 23, 42, 0.09), 0 2px 0 rgba(255,255,255,0.9) inset",
                  transition: "0.25s ease",
                  transform: "translateZ(0)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(145deg, rgba(236,253,245,0.95) 0%, rgba(255,255,255,0.18) 46%, rgba(255,255,255,0) 100%)",
                    pointerEvents: "none",
                  },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    right: -55,
                    top: -55,
                    bgcolor: "rgba(15, 118, 110, 0.09)",
                    boxShadow: "0 0 60px rgba(15, 118, 110, 0.12)",
                    pointerEvents: "none",
                  },
                  "&:hover": {
                    borderColor: "#bbf7d0",
                    boxShadow:
                      "0 32px 70px rgba(15, 23, 42, 0.13), 0 2px 0 rgba(255,255,255,0.95) inset",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    p: { xs: 2.6, md: 3 },
                    "&:last-child": {
                      pb: { xs: 2.6, md: 3 },
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                  >
                    <Box
                      sx={{
                        width: 62,
                        height: 62,
                        borderRadius: "22px",
                        bgcolor: "#ecfdf5",
                        color: "#0f766e",
                        display: "grid",
                        placeItems: "center",
                        boxShadow:
                          "0 16px 30px rgba(15, 118, 110, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
                      }}
                    >
                      <WorkspacePremiumOutlinedIcon sx={{ fontSize: 30 }} />
                    </Box>

                    <Typography
                      sx={{
                        px: 1.35,
                        py: 0.6,
                        borderRadius: "999px",
                        bgcolor: "rgba(248,250,252,0.92)",
                        border: "1px solid #e5e7eb",
                        color: "#475467",
                        fontSize: 12.5,
                        fontWeight: 800,
                        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.035)",
                      }}
                    >
                      {plan.duration_days} Days
                    </Typography>
                  </Stack>

                  <Typography
                    sx={{
                      mt: 2.4,
                      fontSize: 22,
                      fontWeight: 850,
                      color: "#101828",
                      textTransform: "capitalize",
                      letterSpacing: "-0.4px",
                    }}
                  >
                    {plan.name}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.8,
                      fontSize: { xs: 32, md: 36 },
                      fontWeight: 900,
                      color: "#0f766e",
                      letterSpacing: "-1.2px",
                      lineHeight: 1,
                    }}
                  >
                    ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.8,
                      color: "#667085",
                      fontSize: 13.5,
                    }}
                  >
                    Subscription package for agents
                  </Typography>

                  <Stack spacing={1.2} sx={{ mt: 2.5 }}>
                    <FeatureRow
                      icon={<CalendarMonthOutlinedIcon />}
                      text={`${plan.duration_days} days validity`}
                    />

                    <FeatureRow
                      icon={<HomeWorkOutlinedIcon />}
                      text={`${plan.property_limit} property listings`}
                    />
                  </Stack>
                </CardContent>

                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    px: { xs: 2.6, md: 3 },
                    pb: { xs: 2.6, md: 3 },
                  }}
                >
                  <Button
                    startIcon={<EditOutlinedIcon />}
                    variant="outlined"
                    onClick={() => handleEditPlan(plan)}
                    fullWidth
                    sx={{
                      borderRadius: "16px",
                      textTransform: "none",
                      fontWeight: 800,
                      borderColor: "#d0d5dd",
                      color: "#344054",
                      bgcolor: "#ffffff",
                      boxShadow: "0 10px 20px rgba(15, 23, 42, 0.055)",
                      transition: "0.2s ease",
                      "&:hover": {
                        borderColor: "#0f766e",
                        color: "#0f766e",
                        bgcolor: "#ecfdf5",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    startIcon={<DeleteOutlineOutlinedIcon />}
                    variant="outlined"
                    color="error"
                    onClick={() => handleOpenDeleteDialog(plan)}
                    fullWidth
                    sx={{
                      borderRadius: "16px",
                      textTransform: "none",
                      fontWeight: 800,
                      bgcolor: "#ffffff",
                      boxShadow: "0 10px 20px rgba(15, 23, 42, 0.055)",
                      transition: "0.2s ease",
                      "&:hover": {
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Card>
            ))}
          </Box>
        )}
      </Container>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            color: "#101828",
          }}
        >
          Delete Plan
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#475467",
              lineHeight: 1.7,
            }}
          >
            Are you sure you want to delete{" "}
            <Box
              component="span"
              sx={{
                fontWeight: 800,
                color: "#101828",
              }}
            >
              {selectedPlan?.name}
            </Box>
            ?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#98a2b3",
              fontSize: 13.5,
            }}
          >
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={deleting}
            sx={{
              color: "#475467",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePlan}
            disabled={deleting}
            sx={{
              borderRadius: "14px",
              px: 2.5,
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "none",
            }}
          >
            {deleting ? (
              <CircularProgress size={21} color="inherit" />
            ) : (
              "Delete Plan"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAddDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            boxShadow: "0 26px 70px rgba(15,23,42,0.18)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: 900,
            color: "#101828",
          }}
        >
          {editingPlan ? "Edit Plan" : "Add New Plan"}

          <IconButton
            onClick={handleCloseDialog}
            disabled={saving}
            size="small"
          >
            <CloseOutlinedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Plan Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              placeholder="Example: Gold"
              sx={textFieldStyle}
            />

            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 0 }}
              sx={textFieldStyle}
            />

            <TextField
              label="Duration in days"
              name="duration_days"
              type="number"
              value={formData.duration_days}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
              sx={textFieldStyle}
            />

            <TextField
              label="Property limit"
              name="property_limit"
              type="number"
              value={formData.property_limit}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1 }}
              sx={textFieldStyle}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
            sx={{
              color: "#475467",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddPlan}
            disabled={saving}
            sx={{
              bgcolor: "#0f766e",
              borderRadius: "14px",
              px: 2.5,
              textTransform: "none",
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,118,110,0.18)",
              "&:hover": {
                bgcolor: "#115e59",
                boxShadow: "0 12px 28px rgba(15,118,110,0.2)",
              },
            }}
          >
            {saving ? (
              <CircularProgress size={21} color="inherit" />
            ) : editingPlan ? (
              "Update Plan"
            ) : (
              "Save Plan"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((previous) => ({
              ...previous,
              open: false,
            }))
          }
          sx={{ borderRadius: "14px" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function FeatureRow({ icon, text }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        p: 1.25,
        borderRadius: "18px",
        bgcolor: "rgba(248,250,252,0.9)",
        border: "1px solid #e5e7eb",
        boxShadow: "0 8px 18px rgba(15, 23, 42, 0.035)",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "13px",
          bgcolor: "#ffffff",
          color: "#0f766e",
          display: "grid",
          placeItems: "center",
          boxShadow:
            "0 8px 16px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          "& svg": {
            fontSize: 19,
          },
        }}
      >
        {icon}
      </Box>

      <Typography sx={{ color: "#475467", fontSize: 14, fontWeight: 650 }}>
        {text}
      </Typography>
    </Stack>
  );
}

const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "16px",
    bgcolor: "#f8fafc",
  },
};

export default AdminPlans;
