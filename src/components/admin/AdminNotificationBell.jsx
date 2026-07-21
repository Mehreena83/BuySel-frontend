import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";

import NotificationsNoneOutlinedIcon from
  "@mui/icons-material/NotificationsNoneOutlined";

import DoneAllOutlinedIcon from
  "@mui/icons-material/DoneAllOutlined";

import HomeWorkOutlinedIcon from
  "@mui/icons-material/HomeWorkOutlined";

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import adminAxiosInstance from
  "../../api/adminAxiosInstance";


function AdminNotificationBell() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [loading, setLoading] =
    useState(false);

  const [markAllLoading, setMarkAllLoading] =
    useState(false);

  const open = Boolean(anchorEl);

  const fetchNotifications = useCallback(
    async () => {
      try {
        setLoading(true);

        const [listResponse, countResponse] =
          await Promise.all([
            adminAxiosInstance.get(
              "/admin-panel/notifications/"
            ),

            adminAxiosInstance.get(
              "/admin-panel/notifications/unread-count/"
            ),
          ]);

        const notificationData =
          Array.isArray(listResponse.data)
            ? listResponse.data
            : listResponse.data?.results || [];

        setNotifications(notificationData);

        setUnreadCount(
          countResponse.data?.unread_count || 0
        );
      } catch (error) {
        console.error(
          "Notification fetch error:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchNotifications();

    const intervalId = setInterval(
      fetchNotifications,
      30000
    );

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    fetchNotifications();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (
    notification
  ) => {
    try {
      if (!notification.is_read) {
        await adminAxiosInstance.patch(
          `/admin-panel/notifications/${notification.id}/read/`
        );

        setNotifications((previous) =>
          previous.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  is_read: true,
                }
              : item
          )
        );

        setUnreadCount((previous) =>
          Math.max(previous - 1, 0)
        );
      }

      handleClose();

      if (notification.property_id) {
        navigate("/admin-properties");
      }
    } catch (error) {
      console.error(
        "Notification update error:",
        error.response?.data || error.message
      );
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkAllLoading(true);

      await adminAxiosInstance.patch(
        "/admin-panel/notifications/mark-all-read/"
      );

      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Mark all notification error:",
        error.response?.data || error.message
      );
    } finally {
      setMarkAllLoading(false);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 44,
          height: 44,
          borderRadius: "14px",
          color: "#344054",
          bgcolor: "#f8fafc",
          border: "1px solid #e5e7eb",

          "&:hover": {
            bgcolor: "#ecfdf5",
            color: "#0f766e",
            borderColor: "#bbf7d0",
          },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
              xs: 320,
              sm: 390,
            },
            maxHeight: 520,
            mt: 1.2,
            borderRadius: "20px",
            border: "1px solid #eaecf0",
            boxShadow:
              "0 24px 60px rgba(15,23,42,0.18)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            px: 2.2,
            py: 1.8,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: 17,
                  fontWeight: 900,
                  color: "#101828",
                }}
              >
                Notifications
              </Typography>

              <Typography
                sx={{
                  mt: 0.2,
                  color: "#667085",
                  fontSize: 12.5,
                }}
              >
                {unreadCount} unread notification
                {unreadCount === 1 ? "" : "s"}
              </Typography>
            </Box>

            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllRead}
                disabled={markAllLoading}
                startIcon={
                  markAllLoading ? (
                    <CircularProgress
                      size={15}
                      color="inherit"
                    />
                  ) : (
                    <DoneAllOutlinedIcon />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 750,
                  color: "#0f766e",
                  borderRadius: "10px",
                }}
              >
                Mark all read
              </Button>
            )}
          </Stack>
        </Box>

        <Divider />

        {loading &&
        notifications.length === 0 ? (
          <Box
            sx={{
              py: 6,
              display: "grid",
              placeItems: "center",
            }}
          >
            <CircularProgress
              size={26}
              sx={{ color: "#0f766e" }}
            />
          </Box>
        ) : notifications.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                mx: "auto",
                borderRadius: "18px",
                bgcolor: "#ecfdf5",
                color: "#0f766e",
                display: "grid",
                placeItems: "center",
              }}
            >
              <NotificationsNoneOutlinedIcon
                sx={{ fontSize: 30 }}
              />
            </Box>

            <Typography
              sx={{
                mt: 1.4,
                fontWeight: 850,
                color: "#344054",
              }}
            >
              No notifications
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "#667085",
                fontSize: 13,
              }}
            >
              New property submissions will
              appear here.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: 390,
              overflowY: "auto",
            }}
          >
            {notifications.map((notification) => (
              <Box
                key={notification.id}
                component="button"
                type="button"
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
                sx={{
                  width: "100%",
                  p: 0,
                  border: 0,
                  textAlign: "left",
                  bgcolor: "transparent",
                  cursor: "pointer",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.4}
                  sx={{
                    px: 2.2,
                    py: 1.7,
                    bgcolor: notification.is_read
                      ? "#ffffff"
                      : "#f0fdf4",
                    borderBottom:
                      "1px solid #f2f4f7",

                    "&:hover": {
                      bgcolor: "#ecfdf5",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      borderRadius: "13px",
                      bgcolor: "#ffffff",
                      color: "#0f766e",
                      display: "grid",
                      placeItems: "center",
                      border: "1px solid #d1fae5",
                    }}
                  >
                    <HomeWorkOutlinedIcon
                      sx={{ fontSize: 22 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1}
                    >
                      <Typography
                        sx={{
                          color: "#101828",
                          fontSize: 14,
                          fontWeight:
                            notification.is_read
                              ? 750
                              : 900,
                        }}
                      >
                        {notification.title}
                      </Typography>

                      {!notification.is_read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "#0f766e",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.45,
                        color: "#475467",
                        fontSize: 12.8,
                        lineHeight: 1.55,
                      }}
                    >
                      {notification.message}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.7,
                        color: "#98a2b3",
                        fontSize: 11.5,
                      }}
                    >
                      {dayjs(
                        notification.created_at
                      ).format(
                        "DD MMM YYYY, hh:mm A"
                      )}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Menu>
    </>
  );
}

export default AdminNotificationBell;