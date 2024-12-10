import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, Tag, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSession } from "@/hooks/useSession";
import {
  fetchEquipmentsByInstituteId,
  fetchInstitutionNames,
} from "@/hooks/useAction"; // Ensure these functions are correctly defined
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export function ListEquipmentPage() {
  const { session } = useSession();
  const token = session?.token;

  const [institutions, setInstitutions] = useState([]); // State for institution names
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null); // Selected institution ID
  const [equipment, setEquipment] = useState([]); // Equipment data
  const [filteredEquipment, setFilteredEquipment] = useState([]); // Filtered equipment data
  const [loading, setLoading] = useState(false); // Loading state
  const [searchText, setSearchText] = useState(""); // Search text state
  const [page, setPage] = useState(1); // Pagination current page
  const [pageSize, setPageSize] = useState(10); // Pagination page size

  const navigate = useNavigate();

  // Fetch institution names on mount
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const result = await fetchInstitutionNames(token);
        setInstitutions(result);
        if (result.length > 0) {
          setSelectedInstitutionId(result[0].id); // Default to the first institution ID
        }
      } catch (error) {
        console.error("Failed to fetch institution names:", error);
      }
    };

    fetchInstitutions();
  }, [token]);

  // Fetch equipment by selected institution ID
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!selectedInstitutionId) return;

      setLoading(true);
      try {
        const result = await fetchEquipmentsByInstituteId(
          selectedInstitutionId,
          token
        );
        setEquipment(result || []); // Handle empty results gracefully
        setFilteredEquipment(result || []); // Initialize filtered data
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [selectedInstitutionId, token]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = equipment.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredEquipment(filtered);
    setPage(1); // Reset pagination on search
  };

  // Handle dropdown change for institution
  const handleInstitutionChange = (value) => {
    setSelectedInstitutionId(value);
    setSearchText(""); // Reset search text on institution change
  };

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Columns for the Ant Design Table
  const columns = [
    {
      title: "S/N",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Equipment Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Institution Name",
      dataIndex: "institutionName",
      key: "institutionName",
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
      render: (text) => new Date(text).toLocaleDateString(),
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
            onClick={() => navigate("/equipment")}
          >
            Add Equipment
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by equipment name"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
            style={{ width: "250px" }}
          />
          <Select
            value={selectedInstitutionId}
            onChange={handleInstitutionChange}
            style={{ width: 250 }}
            placeholder="Select Institution"
          >
            {institutions.map((institution) => (
              <Option key={institution.id} value={institution.id}>
                {institution.name}
              </Option>
            ))}
          </Select>
        </div>
        <Table
          columns={columns}
          dataSource={filteredEquipment}
          rowKey="id"
          pagination={false}
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
