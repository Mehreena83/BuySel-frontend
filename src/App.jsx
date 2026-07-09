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
import ProtectedRoute from "./routes/ProtectedRoute";
import AgentRoute from "./routes/AgentRoute";

function App() {
  return (
    <Routes>
      {/* Public pages - Navbar/Footer varum */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Agent pages - Public Navbar/Footer venda */}
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
    </Routes>
  );
}

export default App;
