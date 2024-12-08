import DashboardLayout from "@/components/layout/DashboardLayout";

export function AdminPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-700">
          Only accessible by users with the <strong>admin</strong> role.
        </p>
      </div>
    </DashboardLayout>
  );
}
