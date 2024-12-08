/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input } from "antd";
import { fetchInstitutionsByIds } from "@/hooks/useAction";
// import StatisticsCard from "@/components/dashboard/StatisticCard";
import { useNavigate } from "react-router-dom";

export function AssessorPage() {
  const { session } = useSession();
  const token = session?.token;
  const tags = session?.user?.tags || []; // Ensure tags is an array
  const fullname = session?.user?.fullname;
  const [page, setPage] = useState(1);
  const [institutions, setInstitutions] = useState([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
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

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);
    const filtered = institutions.filter((institution) =>
      institution.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredInstitutions(filtered);
    setPage(1);
  };

  const columns = [
    {
      title: "S/N",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, __, index) => page - 1 + index + 1, // Calculate serial number
    },
    {
      title: "Institution Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full h-[92vh] grid grid-rows-[10%_1fr] md:px-12 px-5 py-3">
        <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
          <div>
            <h5 className="md:text-[20px] text-[16px] font-medium text-black">
              Dashboard
            </h5>
            <p className="text-[#667085] md:text-[14px] text-[12px] font-normal">
              Welcome {fullname}
            </p>
          </div>
        </div>

        <div className="w-full h-[95%] mt-3 bg-white rounded-[10px] border border-[#E4E7EC] flex flex-col gap-3 overflow-y-auto p-4 scroller-none">
          <div className="w-full h-[170px] rounded-[12px] flex items-center justify-between bg-secondary p-4">
            <div className="md:basis-[50%] basis-full text-white h-full flex flex-col justify-center gap-2">
              <h6 className="text-[10px] font-bold">OVERVIEW</h6>
              <h2 className="md:text-[20px] text-[16px] font-bold">
                Welcome to your Dashboard!
              </h2>
              <p className="md:text-[14px] text-[12px] font-light">
                Get a comprehensive overview of your workforce, key metrics, and
                important updates at a glance. Stay informed and in control of
                your operations effortlessly.
              </p>
            </div>
            <div className="md:basis-[30%] basis-0 md:flex hidden w-full h-full items-center justify-center">
              <button className="py-[10px] px-[20px] bg-appGreen rounded-[100px] text-white">
                Learn More.
              </button>
            </div>
          </div>

          <div>
            {/* <h5 className="md:text-[24px] text-[18px] text-black font-medium">
              Statistics
            </h5>

            <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-4">
              <StatisticsCard detail={"0"} title="Institutions" />
            </div> */}

            {/* <hr className="my-4" /> */}

            <h5 className="md:text-[24px] text-[18px] text-black font-medium">
              Institutions
            </h5>
            <Input
              placeholder="Search by name"
              value={searchText}
              onChange={handleSearch}
              className="mb-4"
            />
            <Table
              columns={columns}
              dataSource={filteredInstitutions}
              loading={loading}
              className="cursor-pointer custom-table"
              rowKey="id"
              onRow={(record) => ({
                onClick: () => navigate(`/institution-details/${record.id}`),
              })}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
