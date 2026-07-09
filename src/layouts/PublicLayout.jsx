import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/common/PublicNavbar";
import Footer from "../components/common/Footer";

function PublicLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <PublicNavbar />

      <Outlet />

      <Footer />
    </Box>
  );
}

export default PublicLayout;
