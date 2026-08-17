import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

//import Landing from "./pages/Landing";
//import Login from "./pages/Login";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

import "./styles/admin.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        {/* <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> */}

        {/* Admin authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;