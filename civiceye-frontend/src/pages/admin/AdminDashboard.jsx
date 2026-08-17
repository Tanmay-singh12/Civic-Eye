import AdminLayout from "../../components/admin/AdminLayout";
import DashboardShell from "../../components/admin/DashboardShell";

function AdminDashboard() {
  return (
    <AdminLayout>
      <DashboardShell />
    </AdminLayout>
  );
}

import { MOCK_COMPLAINTS } from "../../data/mockComplaints";

// console.log("CivicEye mock complaints:", MOCK_COMPLAINTS);
// console.log("Total complaints:", MOCK_COMPLAINTS.length);


export default AdminDashboard;