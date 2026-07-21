import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
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
import AgentRoute from "./routes/AgentRoute";
import PaymentHistory from "./pages/agent/PaymentHistory";
import AdminRoute from "./routes/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProperties from "./pages/admin/properties/AdminProperties";
import AdminLayout from "./layouts/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPlans from "./pages/admin/AdminPlans";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route
        path="/dashboard"
        element={
          <AgentRoute>
            <Dashboard />
          </AgentRoute>
        }
      />

      <Route
        path="/plans"
        element={
          <AgentRoute>
            <Plans />
          </AgentRoute>
        }
      />

      <Route
        path="/add-property"
        element={
          <AgentRoute>
            <AddProperty />
          </AgentRoute>
        }
      />

      <Route
        path="/my-properties"
        element={
          <AgentRoute>
            <MyProperties />
          </AgentRoute>
        }
      />

      <Route
        path="/edit-property/:id"
        element={
          <AgentRoute>
            <EditProperty />
          </AgentRoute>
        }
      />

      <Route
        path="/my-inquiries"
        element={
          <AgentRoute>
            <MyInquiries />
          </AgentRoute>
        }
      />
      <Route
        path="/payment-history"
        element={
          <AgentRoute>
            <PaymentHistory />
          </AgentRoute>
        }
      />
      <Route path="/admin-login" element={<AdminLogin />} />

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
