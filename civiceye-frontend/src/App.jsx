import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import AIAnalysis from "./pages/AIAnalysis";
import ComplaintTracking from "./pages/ComplaintTracking";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/analysis" element={<AIAnalysis />} />
        <Route path="/tracking/:id" element={<ComplaintTracking />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;