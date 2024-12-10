import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSession } from "@/hooks/useSession";
import {
  fetchAssetsByinstitutionId,
  fetchInstitutionNames,
} from "@/hooks/useAction";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export function ListAssetsPage() {
  const { session } = useSession();
  const token = session?.token;

  const [institutions, setInstitutions] = useState([]); // State for institution names
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(null); // Selected institution ID
  const [assets, setAssets] = useState([]); // Assets data
  const [filteredAssets, setFilteredAssets] = useState([]); // Filtered assets data
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

  // Fetch assets by selected institution ID
  useEffect(() => {
    const fetchAssets = async () => {
      if (!selectedInstitutionId) return;

      setLoading(true);
      try {
        const result = await fetchAssetsByinstitutionId(
          selectedInstitutionId,
          token
        );
        setAssets(result || []); // Handle empty results gracefully
        setFilteredAssets(result || []); // Initialize filtered data
      } catch (error) {
        console.error("Failed to fetch assets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [selectedInstitutionId, token]);

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = assets.filter((item) =>
      item.caption.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredAssets(filtered);
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (url) => (
        <img
          src={url}
          alt="Asset"
          style={{ width: "100px", height: "60px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      sorter: (a, b) => a.caption.localeCompare(b.caption),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    // {
    //   title: "Institution ID",
    //   dataIndex: "institutionId",
    //   key: "institutionId",
    // },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h2>List of Assets</h2>
          <Button
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight"
            onClick={() => navigate("/assets/add")}
          >
            Add Asset
          </Button>
        </div>
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Search by caption"
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
          dataSource={filteredAssets}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredAssets.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          style={{ marginTop: 20 }}
        />
      </div>
    </DashboardLayout>
  );
}
