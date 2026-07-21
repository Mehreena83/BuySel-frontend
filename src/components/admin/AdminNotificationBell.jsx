import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import adminAxiosInstance from "../../api/adminAxiosInstance";

function AdminNotificationBell() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markAllLoading, setMarkAllLoading] = useState(false);

  const open = Boolean(anchorEl);

  const fetchNotifications = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);

      const [listResponse, countResponse] = await Promise.all([
        adminAxiosInstance.get("/admin-panel/notifications/"),
        adminAxiosInstance.get("/admin-panel/notifications/unread-count/"),
      ]);

      const notificationData = Array.isArray(listResponse.data)
        ? listResponse.data
        : listResponse.data?.results || [];

      setNotifications(notificationData);
      setUnreadCount(countResponse.data?.unread_count || 0);
    } catch (error) {
      console.error(
        "Notification fetch error:",
        error.response?.data || error.message,
      );
    } finally {
      if (showLoader) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications(true);

    const intervalId = setInterval(() => {
      fetchNotifications(false);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.is_read) {
        await adminAxiosInstance.patch(
          `/admin-panel/notifications/${notification.id}/read/`,
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item,
          ),
        );

        setUnreadCount((previous) => Math.max(previous - 1, 0));
      }

      handleClose();

      if (notification.property_id) {
        navigate("/admin-properties", {
          state: {
            propertyId: notification.property_id,
          },
        });
      }
    } catch (error) {
      console.error(
        "Notification update error:",
        error.response?.data || error.message,
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkAllLoading(true);

      await adminAxiosInstance.patch(
        "/admin-panel/notifications/mark-all-read/",
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notification error:",
        error.response?.data || error.message,
      );
    } finally {
      setMarkAllLoading(false);
    }
  };

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton
          aria-label="Open notifications"
          onClick={handleOpen}
          sx={{
            width: 48,
            height: 48,
            borderRadius: "18px",
            color: open ? "#ffffff" : "#0f766e",
            bgcolor: open ? "#0f766e" : "rgba(255,255,255,0.92)",
            border: open ? "1px solid #0f766e" : "1px solid #d1fae5",
            backdropFilter: "blur(12px)",
            transition: "0.24s ease",
            boxShadow: open
              ? "0 18px 36px rgba(15,118,110,0.24), inset 0 1px 0 rgba(255,255,255,0.25)"
              : "0 12px 26px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.9)",

            "&:hover": {
              bgcolor: open ? "#0b625d" : "#ecfdf5",
              color: open ? "#ffffff" : "#047857",
              borderColor: "#86efac",
              transform: "translateY(-2px)",
              boxShadow: open
                ? "0 20px 42px rgba(15,118,110,0.28), inset 0 1px 0 rgba(255,255,255,0.25)"
                : "0 16px 34px rgba(15,23,42,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
            },
          }}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                minWidth: 19,
                height: 19,
                px: 0.55,
                fontSize: 10,
                fontWeight: 900,
                border: "2px solid #ffffff",
                boxShadow: "0 6px 14px rgba(180,35,24,0.22)",
              },
            }}
          >
            {unreadCount > 0 ? (
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 24 }} />
            ) : (
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 24 }} />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            width: {
              xs: "calc(100vw - 24px)",
              sm: 540,
            },
            maxWidth: 540,
            maxHeight: 590,
            mt: 1.4,
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.9)",
            bgcolor: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(18px)",
            boxShadow:
              "0 35px 90px rgba(15,23,42,0.24), inset 0 1px 0 rgba(255,255,255,0.95)",
            overflow: "hidden",

            "&::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(145deg, rgba(236,253,245,0.75) 0%, rgba(255,255,255,0.18) 42%, rgba(255,255,255,0) 100%)",
              pointerEvents: "none",
            },
          },
        }}
        MenuListProps={{
          sx: {
            p: 0,
            position: "relative",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 2, sm: 2.4 },
            pt: 2.3,
            pb: 1.9,
            background:
              "radial-gradient(circle at top right, rgba(16,185,129,0.16), transparent 36%), linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.95) 100%)",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
            sx={{ width: "100%" }}
          >
            <Stack
              direction="row"
              spacing={1.35}
              alignItems="center"
              sx={{ minWidth: 0, flex: 1 }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "22px",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#dcfce7",
                  color: "#047857",
                  border: "1px solid #bbf7d0",
                  flexShrink: 0,
                  boxShadow:
                    "0 16px 30px rgba(15,118,110,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
              >
                <NotificationsActiveOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 18, sm: 22 },
                    fontWeight: 900,
                    color: "#101828",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.15,
                  }}
                >
                  Notifications
                </Typography>

                <Typography
                  sx={{
                    mt: 0.4,
                    color: "#667085",
                    fontSize: { xs: 12.5, sm: 14 },
                    fontWeight: 700,
                  }}
                >
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount === 1 ? "" : "s"
                      }`
                    : "You are all caught up"}
                </Typography>
              </Box>
            </Stack>

            <IconButton
              size="small"
              onClick={handleClose}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                color: "#667085",
                bgcolor: "rgba(255,255,255,0.88)",
                border: "1px solid #eaecf0",
                flexShrink: 0,
                ml: "auto",
                boxShadow:
                  "0 10px 22px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
                transition: "0.2s ease",

                "&:hover": {
                  bgcolor: "#ffffff",
                  color: "#101828",
                  transform: "translateY(-1px)",
                  boxShadow:
                    "0 14px 28px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                },
              }}
            >
              <CloseRoundedIcon sx={{ fontSize: 23 }} />
            </IconButton>
          </Stack>

          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              disabled={markAllLoading}
              startIcon={
                markAllLoading ? (
                  <CircularProgress size={15} color="inherit" />
                ) : (
                  <DoneAllOutlinedIcon />
                )
              }
              sx={{
                mt: 1.6,
                px: 1.45,
                py: 0.7,
                minHeight: 36,
                borderRadius: "13px",
                textTransform: "none",
                fontSize: 12.6,
                fontWeight: 850,
                color: "#047857",
                bgcolor: "#ffffff",
                border: "1px solid #bbf7d0",
                boxShadow:
                  "0 10px 20px rgba(15,118,110,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",

                "&:hover": {
                  bgcolor: "#ecfdf5",
                  borderColor: "#86efac",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>

        <Divider sx={{ borderColor: "#e5e7eb" }} />

        {loading && notifications.length === 0 ? (
          <Box
            sx={{
              py: 7,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(248,250,252,0.75)",
            }}
          >
            <Stack spacing={1.2} alignItems="center">
              <CircularProgress size={28} sx={{ color: "#0f766e" }} />
              <Typography sx={{ color: "#667085", fontSize: 13 }}>
                Loading notifications...
              </Typography>
            </Stack>
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              py: 7,
              px: 3,
              textAlign: "center",
              bgcolor: "rgba(248,250,252,0.75)",
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                mx: "auto",
                borderRadius: "26px",
                bgcolor: "#ecfdf5",
                color: "#0f766e",
                display: "grid",
                placeItems: "center",
                border: "1px solid #d1fae5",
                boxShadow:
                  "0 18px 34px rgba(15,118,110,0.14), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 36 }} />
            </Box>

            <Typography
              sx={{
                mt: 1.6,
                fontSize: 16,
                fontWeight: 900,
                color: "#344054",
              }}
            >
              No notifications yet
            </Typography>

            <Typography
              sx={{
                mt: 0.55,
                mx: "auto",
                maxWidth: 270,
                color: "#667085",
                fontSize: 12.8,
                lineHeight: 1.6,
              }}
            >
              New property submissions will appear here for review.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 395,
              overflowY: "auto",
              bgcolor: "rgba(248,250,252,0.78)",
              p: 1.2,

              "&::-webkit-scrollbar": {
                width: 6,
              },

              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#cbd5e1",
                borderRadius: "999px",
              },
            }}
          >
            {notifications.map((notification) => (
              <Box
                key={notification.id}
                component="button"
                type="button"
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  position: "relative",
                  width: "100%",
                  p: 0,
                  mb: 1,
                  border: 0,
                  textAlign: "left",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  fontFamily: "inherit",

                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.45}
                  sx={{
                    position: "relative",
                    px: 1.7,
                    py: 1.7,
                    borderRadius: "22px",
                    bgcolor: notification.is_read
                      ? "rgba(255,255,255,0.94)"
                      : "#f0fdf4",
                    border: notification.is_read
                      ? "1px solid rgba(229,231,235,0.9)"
                      : "1px solid #bbf7d0",
                    boxShadow: notification.is_read
                      ? "0 12px 28px rgba(15,23,42,0.055), inset 0 1px 0 rgba(255,255,255,0.9)"
                      : "0 18px 38px rgba(15,118,110,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                    transition: "0.22s ease",
                    overflow: "hidden",

                    "&::before": !notification.is_read
                      ? {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 14,
                          bottom: 14,
                          width: 4,
                          borderRadius: "0 999px 999px 0",
                          bgcolor: "#10b981",
                        }
                      : {},

                    "&:hover": {
                      bgcolor: notification.is_read ? "#ffffff" : "#dcfce7",
                      transform: "translateY(-2px)",
                      boxShadow: notification.is_read
                        ? "0 16px 34px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.9)"
                        : "0 22px 44px rgba(15,118,110,0.16), inset 0 1px 0 rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      flexShrink: 0,
                      borderRadius: "18px",
                      bgcolor: "#ffffff",
                      color: "#0f766e",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid #d1fae5",
                      boxShadow:
                        "0 12px 22px rgba(15,118,110,0.1), inset 0 1px 0 rgba(255,255,255,0.9)",
                    }}
                  >
                    <HomeWorkOutlinedIcon sx={{ fontSize: 27 }} />
                  </Box>

                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Typography
                        sx={{
                          minWidth: 0,
                          color: "#101828",
                          fontSize: 16,
                          fontWeight: notification.is_read ? 800 : 900,
                          lineHeight: 1.35,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notification.title}
                      </Typography>

                      {!notification.is_read && (
                        <Box
                          component="span"
                          sx={{
                            px: 0.85,
                            py: 0.28,
                            borderRadius: "999px",
                            bgcolor: "#d1fae5",
                            color: "#047857",
                            fontSize: 10,
                            fontWeight: 900,
                            flexShrink: 0,
                            border: "1px solid #a7f3d0",
                            boxShadow: "0 6px 12px rgba(15,118,110,0.08)",
                          }}
                        >
                          NEW
                        </Box>
                      )}
                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.65,
                        color: "#475467",
                        fontSize: 13.2,
                        lineHeight: 1.55,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notification.message}
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0.55}
                      sx={{ mt: 0.95 }}
                    >
                      <AccessTimeRoundedIcon
                        sx={{
                          color: "#98a2b3",
                          fontSize: 15,
                        }}
                      />

                      <Typography
                        sx={{
                          color: "#98a2b3",
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {dayjs(notification.created_at).format(
                          "DD MMM YYYY, hh:mm A",
                        )}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        )}

        {notifications.length > 0 && (
          <Box
            sx={{
              px: 2.3,
              py: 1.3,
              textAlign: "center",
              bgcolor: "rgba(255,255,255,0.96)",
              borderTop: "1px solid #eaecf0",
            }}
          >
            <Typography
              sx={{
                color: "#98a2b3",
                fontSize: 11.5,
                fontWeight: 750,
              }}
            >
              Click a notification to open Properties
            </Typography>
          </Box>
        )}
      </Menu>
    </>
  );
}

export default AdminNotificationBell;
