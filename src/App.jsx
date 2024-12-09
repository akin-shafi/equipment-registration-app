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
import { InstitutionPage } from "./pages/Institution";
import { ListEquipments } from "./pages/Equipment/ListEquipments";

import { Equipment } from "./pages/Equipment";
import { AddEquipment } from "./pages/Equipment/addEquipment";
import { OnboardingPage } from "./pages/Onboarding";
import { AssetsPage } from "./pages/Assets";
import AddAssets from "./pages/Assets/AddAssets";
import { ContactPage } from "./pages/Contact";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/institution" element={<InstitutionDashboard />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/assessor" element={<AssessorPage />} />
        <Route path="/all-users" element={<UserManagementPage />} />
        <Route path="/user/:id" element={<UserDetails />} />
        <Route path="/add-equipment/:id" element={<AddEquipment />} />
        <Route path="/equipment/" element={<Equipment />} />
        <Route path="/institutions" element={<InstitutionPage />} />
        <Route path="/assets/:id" element={<AssetsPage />} />
        <Route path="/list-equipments/:id" element={<ListEquipments />} />
        <Route path="/add-assets/:id" element={<AddAssets />} />
        <Route path="/contact/:id" element={<ContactPage />} />

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
