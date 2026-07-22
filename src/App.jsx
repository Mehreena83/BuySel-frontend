import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AgentLayout from "./layouts/AgentLayout";
import AdminLayout from "./layouts/AdminLayout";
import PublicRoute from "./routes/PublicRoute";
import Home from "./pages/public/Home";
import Buy from "./pages/public/Buy";
import Rent from "./pages/public/Rent";
import PropertyDetails from "./pages/public/PropertyDetails";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/agent/Dashboard";
import Plans from "./pages/agent/Plans";
import AddProperty from "./pages/agent/AddProperty";
import MyProperties from "./pages/agent/MyProperties";
import MyInquiries from "./pages/agent/MyInquiries";
import EditProperty from "./pages/agent/EditProperty";
import PaymentHistory from "./pages/agent/PaymentHistory";

import AgentRoute from "./routes/AgentRoute";
import AdminRoute from "./routes/AdminRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProperties from "./pages/admin/properties/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

<Route
  element={
    <PublicRoute>
      <PublicLayout />
    </PublicRoute>
  }
>        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />

        <Route path="/properties/:id" element={<PropertyDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= AGENT ROUTES ================= */}

      <Route
        element={
          <AgentRoute>
            <AgentLayout />
          </AgentRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/my-properties" element={<MyProperties />} />

        <Route path="/add-property" element={<AddProperty />} />

        <Route path="/edit-property/:id" element={<EditProperty />} />

        <Route path="/plans" element={<Plans />} />

        <Route path="/payment-history" element={<PaymentHistory />} />

        <Route path="/my-inquiries" element={<MyInquiries />} />
      </Route>

      {/* ================= ADMIN LOGIN ================= */}

      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ================= ADMIN ROUTES ================= */}

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        <Route path="/admin-properties" element={<AdminProperties />} />

        <Route path="/admin-users" element={<AdminUsers />} />

        <Route path="/admin-plans" element={<AdminPlans />} />

        <Route path="/admin-payments" element={<AdminPayments />} />

        <Route path="/admin-subscriptions" element={<AdminSubscriptions />} />
      </Route>
    </Routes>
  );
}

export default App;
