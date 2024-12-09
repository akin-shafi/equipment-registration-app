/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table } from "antd";
import { fetchInstitutionsByIds } from "@/hooks/useAction";
import { UserModal } from "@/components/modals/UserModal";
import { useNavigate } from "react-router-dom";

export function InstitutionPage() {
  const { session } = useSession();
  const token = session?.token;
  const tags = session?.user?.tags || [];
  const fullname = session?.user?.fullname;

  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || tags.length === 0) {
        console.warn("No token or tags available to fetch institutions.");
        return;
      }

      setLoading(true);
      try {
        const result = await fetchInstitutionsByIds(tags, token);
        setInstitutions(result);
        setFilteredInstitutions(result);
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tags, token]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInviteSubmit = (values) => {
    console.log("Inviting member with values: ", values);
    // Add invite member logic here
  };

  const columns = [
    {
      title: "Institution Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span title={text}>
          {text.length > 40 ? `${text.slice(0, 40)}...` : text}
        </span>
      ),
    },
    {
      title: "Institution Contact",
      key: "contact",
      render: (_, record) => `${record.email}, ${record.phone}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <button
          onClick={() => navigate(`/institution-details/${record.id}`)}
          className="bg-appGreen text-white px-3 py-1 rounded hover:bg-gold"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full h-[92vh] grid grid-rows-[10%_1fr] md:px-12 px-5 py-3">
        {/* Header Section */}
        <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
          <div>
            <h5 className="md:text-[20px] text-[16px] font-medium text-black">
              Institution
            </h5>
            <p className="text-[#667085] md:text-[14px] text-[12px] font-normal">
              Welcome {fullname}
            </p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="w-full h-[170px] rounded-[12px] bg-olive flex items-center justify-between p-4">
          <div className="md:basis-[50%] basis-full text-secondary h-full flex flex-col justify-center gap-2">
            <h6 className="text-[10px] font-bold">OVERVIEW</h6>
            <h2 className="md:text-[20px] text-[16px] font-bold">
              Welcome to your Dashboard!
            </h2>
            <p className="md:text-[14px] text-[12px] font-light">
              Click on any metrics below to get started or update your profile.
            </p>
          </div>
          <div className="md:basis-[30%] basis-0 md:flex hidden w-full h-full items-center justify-center">
            <button
              onClick={openModal}
              className="py-[10px] px-[20px] bg-appGreen rounded-[100px] text-white"
            >
              Invite Member
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 shadow-md">
            <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b pb-2">
              Institutions
            </h5>
            <Table
              columns={columns}
              dataSource={filteredInstitutions}
              loading={loading}
              className="custom-table mt-2"
              rowKey="id"
            />
          </div>
          <div className="p-4 shadow-md">
            <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b pb-2">
              Contact Person
            </h5>
            {/* Add content for Contact Person */}
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      <UserModal
        visible={isModalOpen}
        onClose={closeModal}
        onSubmit={handleInviteSubmit}
        showCloseIcon={false}
      />
    </DashboardLayout>
  );
}
