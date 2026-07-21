import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  formatIndianCurrency,
  getStatusStyle,
} from "./propertyFormUtils";

function InfoText({ icon, text }) {
  return (
    <Stack direction="row" spacing={0.55} alignItems="center">
      <Box
        sx={{
          color: "#98a2b3",
          display: "flex",
          "& svg": { fontSize: 17 },
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          color: "#667085",
          fontSize: 13.5,
          fontWeight: 600,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: { xs: 240, md: 340 },
        }}
      >
        {text}
      </Typography>
    </Stack>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  disabled = false,
  variant = "default",
}) {
  const styles = {
    default: {
      color: "#344054",
      borderColor: "#d0d5dd",
      bgcolor: "#ffffff",
      hoverBg: "#f8fafc",
      hoverBorder: "#98a2b3",
    },
    edit: {
      color: "#175cd3",
      borderColor: "#b2ccff",
      bgcolor: "#ffffff",
      hoverBg: "#eff8ff",
      hoverBorder: "#84adff",
    },
    success: {
      color: "#ffffff",
      borderColor: "#0f766e",
      bgcolor: "#0f766e",
      hoverBg: "#0b625d",
      hoverBorder: "#0b625d",
    },
    warning: {
      color: "#b54708",
      borderColor: "#fedf89",
      bgcolor: "#ffffff",
      hoverBg: "#fffaeb",
      hoverBorder: "#fdb022",
    },
    danger: {
      color: "#b42318",
      borderColor: "#fecdca",
      bgcolor: "#ffffff",
      hoverBg: "#fef3f2",
      hoverBorder: "#fda29b",
    },
  };

  const current = styles[variant] || styles.default;

  return (
    <Button
      variant={variant === "success" ? "contained" : "outlined"}
      startIcon={icon}
      onClick={onClick}
      disabled={disabled}
      sx={{
        minWidth: { xs: "100%", sm: 94 },
        borderRadius: "15px",
        textTransform: "none",
        fontWeight: 800,
        color: current.color,
        borderColor: current.borderColor,
        bgcolor: current.bgcolor,
        boxShadow:
          variant === "success"
            ? "0 10px 22px rgba(15,118,110,0.16)"
            : "0 8px 18px rgba(15,23,42,0.05)",
        transition: "0.2s ease",
        "&:hover": {
          bgcolor: current.hoverBg,
          borderColor: current.hoverBorder,
          boxShadow:
            variant === "success"
              ? "0 12px 26px rgba(15,118,110,0.18)"
              : "0 10px 20px rgba(15,23,42,0.06)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {label}
    </Button>
  );
}

function PropertyCard({
  property,
  actionLoading,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDelete,
}) {
  const status = getStatusStyle(property.status);
  const approveLoading = actionLoading === `approve-${property.id}`;

  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.9)",
        borderRadius: "26px",
        bgcolor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
        boxShadow:
          "0 18px 42px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.9)",
        transition: "0.24s ease",
        "&::before": {
          content: '\"\"',
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(145deg, rgba(236,253,245,0.85) 0%, rgba(255,255,255,0.15) 42%, rgba(255,255,255,0) 100%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '\"\"',
          position: "absolute",
          width: 120,
          height: 120,
          borderRadius: "50%",
          right: -48,
          top: -48,
          bgcolor: "rgba(15, 118, 110, 0.08)",
          boxShadow: "0 0 50px rgba(15, 118, 110, 0.1)",
          pointerEvents: "none",
        },
        "&:hover": {
          borderColor: "#bbf7d0",
          boxShadow:
            "0 26px 58px rgba(15, 23, 42, 0.11), inset 0 1px 0 rgba(255,255,255,0.95)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent
        sx={{
          position: "relative",
          zIndex: 1,
          p: { xs: 2.2, md: 2.7 },
          "&:last-child": { pb: { xs: 2.2, md: 2.7 } },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", lg: "center" }}
          gap={2.5}
        >
          <Stack
            direction="row"
            spacing={1.6}
            alignItems="flex-start"
            sx={{ minWidth: 0, flex: 1 }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "20px",
                bgcolor: "#ecfdf5",
                color: "#0f766e",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                boxShadow:
                  "0 14px 28px rgba(15, 118, 110, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
                "& svg": { fontSize: 28 },
              }}
            >
              <HomeWorkOutlinedIcon />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 18, md: 20 },
                    fontWeight: 850,
                    color: "#101828",
                    letterSpacing: "-0.4px",
                    lineHeight: 1.15,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: { xs: "100%", md: 520 },
                  }}
                >
                  {property.title}
                </Typography>

                <Chip
                  label={status.label}
                  size="small"
                  sx={{
                    bgcolor: status.bgcolor,
                    color: status.color,
                    border: `1px solid ${status.border}`,
                    fontWeight: 800,
                    borderRadius: "999px",
                    px: 0.5,
                  }}
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.9, sm: 1.5 }}
                sx={{ mt: 1.3 }}
              >
                <InfoText
                  icon={<LocationOnOutlinedIcon />}
                  text={property.location || "Location unavailable"}
                />
                <InfoText
                  icon={<PersonOutlineOutlinedIcon />}
                  text={property.agent_name || "Unknown agent"}
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.7, sm: 1.5 }}
                sx={{ mt: 1.2 }}
              >
                <Typography
                  sx={{ color: "#101828", fontSize: 14, fontWeight: 850 }}
                >
                  {formatIndianCurrency(property.price)}
                </Typography>

                <Typography
                  sx={{
                    color: "#667085",
                    fontSize: 13.5,
                    textTransform: "capitalize",
                    fontWeight: 650,
                  }}
                >
                  {property.property_type} • {property.listing_type}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent={{ xs: "flex-start", lg: "flex-end" }}
            sx={{
              width: { xs: "100%", lg: "auto" },
              flexShrink: 0,
              flexWrap: "wrap",
            }}
          >
            <ActionButton
              icon={<VisibilityOutlinedIcon />}
              label="View"
              onClick={() => onView(property)}
            />

            <ActionButton
              icon={<EditOutlinedIcon />}
              label="Edit"
              onClick={() => onEdit(property)}
              disabled={Boolean(actionLoading)}
              variant="edit"
            />

            {property.status !== "approved" && (
              <ActionButton
                icon={
                  approveLoading ? (
                    <CircularProgress size={17} color="inherit" />
                  ) : (
                    <CheckCircleOutlineOutlinedIcon />
                  )
                }
                label="Approve"
                onClick={() => onApprove(property.id)}
                disabled={Boolean(actionLoading)}
                variant="success"
              />
            )}

            {property.status !== "rejected" && (
              <ActionButton
                icon={<CancelOutlinedIcon />}
                label="Reject"
                onClick={() => onReject(property)}
                disabled={Boolean(actionLoading)}
                variant="warning"
              />
            )}

            <ActionButton
              icon={<DeleteOutlineOutlinedIcon />}
              label="Delete"
              onClick={() => onDelete(property)}
              disabled={Boolean(actionLoading)}
              variant="danger"
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;
