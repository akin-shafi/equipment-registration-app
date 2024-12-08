import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSession } from "@/hooks/useSession";
import { fetchEquipment } from "@/hooks/useAction"; // Make sure this function is correctly defined
import { useNavigate } from "react-router-dom";

export function ListEquipmentPage() {
  const { session } = useSession();
  const token = session?.token;
  const [equipment, setEquipment] = useState([]); // State to store equipment data
  const [filteredEquipment, setFilteredEquipment] = useState([]); // State for filtered equipment
  const [loading, setLoading] = useState(false); // Loading state
  const [searchText, setSearchText] = useState(""); // Search text state
  const [page, setPage] = useState(1); // Pagination state for current page
  const [pageSize, setPageSize] = useState(10); // Pagination state for items per page

  const navigate = useNavigate();

  // Fetch equipment data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchEquipment(token); // Fetch equipment from the backend
        setEquipment(result);
        setFilteredEquipment(result); // Set initial filtered equipment to all
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = equipment.filter(
      (item) => item.name.toLowerCase().includes(value.toLowerCase()) // Search by name
    );
    setFilteredEquipment(filtered);
    setPage(1); // Reset to first page when searching
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Columns for Ant Design Table
  const columns = [
    {
      title: "S/N",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => (page - 1) * pageSize + index + 1, // Calculate serial number
    },
    {
      title: "Equipment Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name), // Sort by name
    },
    {
      title: "Application ID",
      dataIndex: "applicationId",
      key: "applicationId",
    },
    {
      title: "Model Number",
      dataIndex: "modelNumber",
      key: "modelNumber",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Taxonomy",
      dataIndex: "taxonomy",
      key: "taxonomy",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (text) => (
        <Tag color={text ? "green" : "red"}>
          {text ? "Available" : "Unavailable"}
        </Tag>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(), // Format date
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h2>List of Equipment</h2>
          <Button
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight"
            onClick={() => navigate("/equipment/add")} // Navigate to the add equipment page
            style={{ marginLeft: "auto" }}
          >
            Add Equipment
          </Button>
        </div>
        <Input
          placeholder="Search by equipment name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginBottom: "20px" }}
        />
        <Table
          columns={columns}
          dataSource={filteredEquipment}
          rowKey="id"
          pagination={false} // Disable default pagination
          loading={loading}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredEquipment.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          style={{ marginTop: 20 }}
        />
      </div>
    </DashboardLayout>
  );
}
