import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { InstitutionDashboard } from "./pages/InstitutionDashboard";
import { AdminPage } from "./pages/Admin";
import { AssessorPage } from "./pages/Assessor";

import { UserManagementPage } from "./pages/Users/UserManagementPage";
import UserDetails from "./pages/Users/UserDetails"; // Import UserDetails component
import { InstitutionManagementPage } from "./pages/Admin/List/InstitutionManagementPage";
import { ListEquipmentPage } from "./pages/Admin/List/ListEquipmentPage";
import { InstituteData } from "./pages/Assessor/instituteData";
import { AddEquipment } from "./pages/Assessor/addEquipment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/institution" element={<InstitutionDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/assessor" element={<AssessorPage />} />
        <Route path="/all-users" element={<UserManagementPage />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="/add-equipment/:id" element={<AddEquipment />} />
        <Route path="/institution-details/:id" element={<InstituteData />} />
        <Route path="*" element={<AssessorPage />} />
        <Route
          path="/all-institutions"
          element={<InstitutionManagementPage />}
        />
        <Route path="/all-equipments" element={<ListEquipmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
