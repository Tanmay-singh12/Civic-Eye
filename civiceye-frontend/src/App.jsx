import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import AIAnalysis from "./pages/AIAnalysis";
import ComplaintTracking from "./pages/ComplaintTracking";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";

import "./styles/admin.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PUBLIC / CITIZEN ROUTES
            ===================================================== */}

        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/analysis" element={<AIAnalysis />} />
        <Route
          path="/tracking/:id"
          element={<ComplaintTracking />}
        />

        {/* =====================================================
            ADMIN AUTHENTICATION
            ===================================================== */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* =====================================================
            PROTECTED ADMIN ROUTES
            ===================================================== */}

        <Route element={<ProtectedAdminRoute />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Route>

        {/* =====================================================
            FALLBACK
            ===================================================== */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;