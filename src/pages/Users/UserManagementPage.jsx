import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Button, Pagination, Popconfirm, message } from "antd";
import { useSession } from "../../hooks/useSession";
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../hooks/useAction";
import { SearchOutlined } from "@ant-design/icons";
import { UserModal } from "@/components/modals/UserModal";
import { Link } from "react-router-dom"; // Import Link for navigation

export function UserManagementPage() {
  const { session } = useSession();
  const token = session?.token;
  const [users, setUsers] = useState([]); // To hold the users data
  const [filteredUsers, setFilteredUsers] = useState([]); // To filter the users
  const [loading, setLoading] = useState(false); // For loading state
  const [searchText, setSearchText] = useState(""); // For search text
  const [page, setPage] = useState(1); // For current page
  const [pageSize, setPageSize] = useState(10); // For items per page
  const [isModalVisible, setIsModalVisible] = useState(false); // For modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // For editing user
  const tagsOptions = [
    "Federal Institute of Forest reserve",
    "Nigerian Institute for Oceanography and Marine Research",
  ]; // Tag options for multi-select

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchUsers(token); // Fetch users data from API
        setUsers(result);
        setFilteredUsers(result); // Initialize filtered users to all users
      } catch (error) {
        console.error("Failed to fetch users:", error);
        message.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter((user) =>
      user.fullname.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleCreateOrEditUser = async (user) => {
    setLoading(true);
    try {
      if (selectedUser) {
        // Edit user
        await updateUser(selectedUser.id, user, token);
        message.success("User updated successfully");
      } else {
        // Create new user
        await createUser(user, token);
        message.success("User created successfully");
      }

      // Refresh the user list
      const result = await fetchUsers(token);
      setUsers(result);
      setFilteredUsers(result);
    } catch (error) {
      console.error("Failed to save user:", error);
      message.error("Failed to save user");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async (id) => {
    setLoading(true);
    try {
      await deleteUser(id, token);
      message.success("User deleted successfully");

      // Refresh the user list
      const result = await fetchUsers(token);
      setUsers(result);
      setFilteredUsers(result);
    } catch (error) {
      console.error("Failed to delete user:", error);
      message.error("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            primary
            onClick={() => {
              setSelectedUser(record);
              setIsModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Link to={`/user/${record.id}`}>
            <Button type="link">View</Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record.id)}
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

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex justify-between mb-10">
          <h2>All Users</h2>
          <Button
            type="primary"
            className="bg-appGreen hover:bg-appGreenLight rounded-full"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              setSelectedUser(null);
              setIsModalVisible(true);
            }}
          >
            Invite User
          </Button>
        </div>
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: "250px", marginBottom: "20px" }}
        />
        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
        <Pagination
          current={page}
          pageSize={pageSize}
          total={filteredUsers.length}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          style={{ marginTop: 20 }}
        />
      </div>
      <UserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateOrEditUser}
        user={selectedUser}
        tagsOptions={tagsOptions}
      />
    </DashboardLayout>
  );
}
