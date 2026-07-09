// import { Link } from "react-router-dom";
// import {
//   Box,
//   Container,
//   Divider,
//   IconButton,
//   Stack,
//   Typography,
// } from "@mui/material";
// import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
// import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
// import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

// function Footer() {
//   return (
//     <Box
//       component="footer"
//       sx={{
//         bgcolor: "#0f172a",
//         color: "#ffffff",
//         mt: 7,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Box sx={{ py: { xs: 4, md: 5 } }}>
//           <Stack
//             direction={{ xs: "column", md: "row" }}
//             justifyContent="space-between"
//             spacing={{ xs: 4, md: 6 }}
//           >
//             <Box sx={{ maxWidth: 430 }}>
//               <Typography
//                 component={Link}
//                 to="/"
//                 sx={{
//                   textDecoration: "none",
//                   fontSize: 30,
//                   fontWeight: 900,
//                   color: "#ffffff",
//                   letterSpacing: "-0.5px",
//                 }}
//               >
//                 Buy<span style={{ color: "#34d399" }}>Sel</span>
//               </Typography>

//               <Typography
//                 sx={{
//                   mt: 1.5,
//                   color: "#cbd5e1",
//                   lineHeight: 1.7,
//                   fontSize: 14.5,
//                 }}
//               >
//                 A simple real estate platform for agents to list verified
//                 properties and for users to explore homes, land, rentals and
//                 commercial spaces.
//               </Typography>

//               <Stack direction="row" spacing={1.2} sx={{ mt: 2.5 }}>
//                 <FooterIcon icon={<HomeOutlinedIcon />} />
//                 <FooterIcon icon={<ApartmentOutlinedIcon />} />
//                 <FooterIcon icon={<WorkspacePremiumOutlinedIcon />} />
//               </Stack>
//             </Box>

//             <Stack
//               direction={{ xs: "column", sm: "row" }}
//               spacing={{ xs: 3, sm: 7, md: 9 }}
//             >
//               <Box>
//                 <FooterTitle>Quick Links</FooterTitle>

//                 <Stack spacing={1.2}>
//                   <FooterLink to="/">Home</FooterLink>
//                   <FooterLink to="/buy">Buy Properties</FooterLink>
//                   <FooterLink to="/rent">Rent Properties</FooterLink>
//                   <FooterLink to="/login">Login</FooterLink>
//                 </Stack>
//               </Box>

//               <Box>
//                 <FooterTitle>For Agents</FooterTitle>

//                 <Stack spacing={1.2}>
//                   <FooterLink to="/register">Register as Agent</FooterLink>
//                   <FooterLink to="/plans">Subscription Plans</FooterLink>
//                   <FooterLink to="/dashboard">Agent Dashboard</FooterLink>
//                   <FooterLink to="/add-property">Add Property</FooterLink>
//                 </Stack>
//               </Box>

//               <Box>
//                 <FooterTitle>Contact</FooterTitle>

//                 <Stack spacing={1.2}>
//                   <Typography sx={contactTextStyle}>
//                     Malappuram, Kerala
//                   </Typography>
//                   <Typography sx={contactTextStyle}>
//                     support@buysel.com
//                   </Typography>
//                   <Typography sx={contactTextStyle}>
//                     Real Estate Marketplace
//                   </Typography>
//                 </Stack>
//               </Box>
//             </Stack>
//           </Stack>

//           <Divider sx={{ borderColor: "#334155", my: 4 }} />

//           <Stack
//             direction={{ xs: "column", sm: "row" }}
//             justifyContent="space-between"
//             alignItems={{ xs: "flex-start", sm: "center" }}
//             spacing={1.5}
//           >
//             <Typography color="#94a3b8" fontSize={14}>
//               © {new Date().getFullYear()} BuySel. All rights reserved.
//             </Typography>

//             <Stack direction="row" spacing={2}>
//               <Typography component={Link} to="/" sx={bottomLinkStyle}>
//                 Privacy
//               </Typography>

//               <Typography component={Link} to="/" sx={bottomLinkStyle}>
//                 Terms
//               </Typography>
//             </Stack>
//           </Stack>
//         </Box>
//       </Container>
//     </Box>
//   );
// }

// const FooterTitle = ({ children }) => (
//   <Typography
//     sx={{
//       fontWeight: 800,
//       fontSize: 15,
//       color: "#ffffff",
//       mb: 1.8,
//     }}
//   >
//     {children}
//   </Typography>
// );

// const FooterLink = ({ to, children }) => (
//   <Typography
//     component={Link}
//     to={to}
//     sx={{
//       textDecoration: "none",
//       color: "#cbd5e1",
//       fontSize: 14,
//       transition: "0.2s ease",
//       "&:hover": {
//         color: "#34d399",
//         pl: 0.4,
//       },
//     }}
//   >
//     {children}
//   </Typography>
// );

// const FooterIcon = ({ icon }) => (
//   <IconButton
//     size="small"
//     sx={{
//       width: 36,
//       height: 36,
//       bgcolor: "rgba(52, 211, 153, 0.12)",
//       color: "#34d399",
//       border: "1px solid rgba(52, 211, 153, 0.18)",
//       "&:hover": {
//         bgcolor: "rgba(52, 211, 153, 0.2)",
//       },
//     }}
//   >
//     {icon}
//   </IconButton>
// );

// const contactTextStyle = {
//   color: "#cbd5e1",
//   fontSize: 14,
// };

// const bottomLinkStyle = {
//   textDecoration: "none",
//   color: "#94a3b8",
//   fontSize: 14,
//   "&:hover": {
//     color: "#34d399",
//   },
// };

// export default Footer;



import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0f172a",
        color: "#ffffff",
        mt: 7,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 4.5, md: 5.5 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "flex-start" }}
            spacing={{ xs: 4, md: 8 }}
          >
            <Box sx={{ maxWidth: 420 }}>
              <Typography
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.6px",
                  display: "inline-block",
                }}
              >
                Buy<span style={{ color: "#34d399" }}>Sel</span>
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: "#cbd5e1",
                  fontSize: 14.5,
                  lineHeight: 1.8,
                }}
              >
                A trusted real estate marketplace where agents can list
                verified properties and users can explore homes, land,
                rentals and commercial spaces with ease.
              </Typography>

              <Stack spacing={1.3} sx={{ mt: 2.5 }}>
                <FooterInfo
                  icon={<LocationOnOutlinedIcon />}
                  text="Malappuram, Kerala"
                />
                <FooterInfo
                  icon={<EmailOutlinedIcon />}
                  text="support@buysel.com"
                />
                <FooterInfo
                  icon={<HomeWorkOutlinedIcon />}
                  text="Real Estate Marketplace"
                />
              </Stack>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 3.5, sm: 7, md: 9 }}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <Box>
                <FooterTitle>Quick Links</FooterTitle>

                <Stack spacing={1.25}>
                  <FooterLink to="/">Home</FooterLink>
                  <FooterLink to="/buy">Buy Properties</FooterLink>
                  <FooterLink to="/rent">Rent Properties</FooterLink>
                  <FooterLink to="/login">Login</FooterLink>
                </Stack>
              </Box>

              <Box>
                <FooterTitle>For Agents</FooterTitle>

                <Stack spacing={1.25}>
                  <FooterLink to="/register">Register as Agent</FooterLink>
                  <FooterLink to="/plans">Subscription Plans</FooterLink>
                  <FooterLink to="/dashboard">Agent Dashboard</FooterLink>
                  <FooterLink to="/add-property">Add Property</FooterLink>
                </Stack>
              </Box>

              <Box>
                <FooterTitle>Support</FooterTitle>

                <Stack spacing={1.25}>
                  <FooterLink to="/">Help Center</FooterLink>
                  <FooterLink to="/">Privacy Policy</FooterLink>
                  <FooterLink to="/">Terms & Conditions</FooterLink>
                  <FooterLink to="/">Contact</FooterLink>
                </Stack>
              </Box>
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.22)", my: 4 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
          >
            <Typography color="#94a3b8" fontSize={14}>
              © {new Date().getFullYear()} BuySel. All rights reserved.
            </Typography>

            <Typography color="#94a3b8" fontSize={14}>
              Built for property agents and buyers.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

const FooterTitle = ({ children }) => (
  <Typography
    sx={{
      fontSize: 15,
      fontWeight: 800,
      color: "#ffffff",
      mb: 1.8,
      letterSpacing: "0.2px",
    }}
  >
    {children}
  </Typography>
);

const FooterLink = ({ to, children }) => (
  <Typography
    component={Link}
    to={to}
    sx={{
      display: "block",
      textDecoration: "none",
      color: "#cbd5e1",
      fontSize: 14,
      transition: "0.2s ease",
      width: "fit-content",
      "&:hover": {
        color: "#34d399",
        transform: "translateX(3px)",
      },
    }}
  >
    {children}
  </Typography>
);

const FooterInfo = ({ icon, text }) => (
  <Stack direction="row" alignItems="center" spacing={1.1}>
    <Box
      sx={{
        width: 30,
        height: 30,
        borderRadius: 2,
        bgcolor: "rgba(52, 211, 153, 0.12)",
        color: "#34d399",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        "& svg": {
          fontSize: 17,
        },
      }}
    >
      {icon}
    </Box>

    <Typography color="#cbd5e1" fontSize={14}>
      {text}
    </Typography>
  </Stack>
);

export default Footer;