import { useSession } from "../hooks/useSession";
import { Tabs } from "antd";
import InstituteNavBar from "../components/InstituteNavBar";
import { SingleUploadPage } from "./SingleUploadPage";
import { BulkUploadPage } from "./BulkUploadPage";

const { TabPane } = Tabs;

export function InstitutionDashboard() {
  const { session } = useSession();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <InstituteNavBar />

      {/* Main content */}
      <div className="mt-20 flex flex-col items-center justify-center flex-grow p-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {session?.user?.email}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          You are now logged in to your dashboard.
        </p>

        {/* Container for Tabs, center it using flex */}
        <div className="flex justify-center items-center w-full">
          <Tabs
            defaultActiveKey="1"
            type="card"
            className="w-full sm:w-1/2" // 100% on small screens, 50% on larger screens
          >
            <TabPane tab="Single Upload" key="1">
              <SingleUploadPage />
            </TabPane>
            <TabPane tab="Bulk Upload" key="2">
              <BulkUploadPage />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
