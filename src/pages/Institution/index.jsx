/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table } from "antd";
import { fetchInstitutionsByIds } from "@/hooks/useAction";
// import StatisticsCard from "@/components/dashboard/StatisticCard";
import { useNavigate } from "react-router-dom";

export function InstitutionPage() {
  const { session } = useSession();
  const token = session?.token;
  const tags = session?.user?.tags || []; // Ensure tags is an array
  const fullname = session?.user?.fullname;
  // const [page, setPage] = useState(1);
  const [setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  //   const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!token || tags.length === 0) {
        console.warn("No token or tags available to fetch institutions.");
        return;
      }

      setLoading(true);
      try {
        const result = await fetchInstitutionsByIds(tags, token); // Pass tags and token to the hook
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
      render: (text, record) => {
        const { email, phone } = record;
        return `${email}, ${phone}`;
      },
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

        <div className="w-full h-[95%] mt-3 bg-white rounded-[10px] border border-[#E4E7EC] flex flex-col gap-3 overflow-y-auto p-4 scroller-none">
          <div className="w-full h-[170px] rounded-[12px] flex items-center justify-between bg-olive p-4">
            <div className="md:basis-[50%] basis-full text-secondary h-full flex flex-col justify-center gap-2">
              <h6 className="text-[10px] font-bold">OVERVIEW</h6>
              {/* <h2 className="md:text-[20px] text-[16px] font-bold">
                Welcome to your Dashboard!
              </h2> */}
              <p className="md:text-[14px] text-[12px] font-light">
                See institution you belong
              </p>
            </div>
            <div className="md:basis-[30%] basis-0 md:flex hidden w-full h-full items-center justify-center">
              <button className="py-[10px] px-[20px] bg-appGreen hover:bg-gold rounded-[100px] text-white">
                Invite Contact.
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 shadow-md">
              <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b">
                Institutions
              </h5>
              <Table
                columns={columns}
                dataSource={filteredInstitutions}
                loading={loading}
                className="custom-table"
                rowKey="id"
              />
            </div>
            <div className="p-4 shadow-md">
              <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b">
                Contact Person
              </h5>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
