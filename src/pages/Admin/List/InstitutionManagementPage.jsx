import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, Popconfirm, message } from "antd";
import { useSession } from "@/hooks/useSession";
import {
  fetchInstitution,
  createInstitution,
  updateInstitution,
  deleteInstitution,
} from "@/hooks/useAction";
import { SearchOutlined } from "@ant-design/icons";
import { InstitutionModal } from "@/components/modals/InstitutionModal";

export function InstitutionManagementPage() {
  const { session } = useSession();
  const token = session?.token;
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchInstitution(token);
        console.log(result);
        setInstitutions(result);
        setFilteredInstitutions(result);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
        message.error("Failed to load institutions");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = institutions.filter((institution) =>
      institution.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInstitutions(filtered);
    setPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleCreateOrEditInstitution = async (institution) => {
    setLoading(true);
    try {
      if (selectedInstitution) {
        await updateInstitution(selectedInstitution.id, institution, token);
        message.success("Institution updated successfully");
      } else {
        await createInstitution(institution, token);
        message.success("Institution created successfully");
      }

      const result = await fetchInstitution(token);
      setInstitutions(result);
      setFilteredInstitutions(result);
    } catch (error) {
      console.error("Failed to save institution:", error);
      message.error("Failed to save institution");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      setSelectedInstitution(null);
    }
  };

  const handleDeleteInstitution = async (id) => {
    setLoading(true);
    try {
      await deleteInstitution(id, token);
      message.success("Institution deleted successfully");

      const result = await fetchInstitution(token);
      setInstitutions(result);
      setFilteredInstitutions(result);
    } catch (error) {
      console.error("Failed to delete institution:", error);
      message.error("Failed to delete institution");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => (page - 1) * pageSize + index + 1, // Calculate serial number
    },
    {
      title: "Institution Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Location",
      key: "location",
      render: (text, record) => {
        const { address, city, state, country } = record;
        return `${address}, ${city}, ${state}, ${country}`;
      },
    },
    {
      title: "Accredited",
      dataIndex: "isAccredited",
      key: "isAccredited",
      render: (isAccredited) => (isAccredited ? "Yes" : "No"),
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setSelectedInstitution(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this institution?"
            onConfirm={() => handleDeleteInstitution(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  const paginatedData = filteredInstitutions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h2>Institution Management</h2>
          <Button
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight rounded-full"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              setSelectedInstitution(null);
              setIsModalVisible(true);
            }}
          >
            Add Institution
          </Button>
        </div>
        <Input
          placeholder="Search by institution name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginBottom: "20px" }}
        />
        <Table
          columns={columns}
          dataSource={paginatedData} // Use paginatedData here
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredInstitutions.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          style={{ marginTop: 20 }}
        />
      </div>
      <InstitutionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateOrEditInstitution}
        institution={selectedInstitution}
      />
    </DashboardLayout>
  );
}
