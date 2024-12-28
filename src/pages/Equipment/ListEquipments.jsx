import { useEffect, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useSession } from "@/hooks/useSession";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Table, Input, Pagination } from "antd";
import {
  fetchEquipmentsByInstituteId,
  fetchInstitutionById,
} from "@/hooks/useAction";
import StatisticsCard from "@/components/dashboard/StatisticCard";
import BackBtn from "@/components/custom/buttons/BackBtn";

export function ListEquipments() {
  const { session } = useSession();
  const token = session?.token;
  const { id } = useParams(); // Get the institution ID from the URL
  const navigate = useNavigate();
  const [institution, setInstitution] = useState(null);
  const [equipment, setEquipments] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchInstitutionData = async () => {
      if (!token || !id) {
        console.warn("No token or id available to fetch institution data.");
        return;
      }
      try {
        const institutionData = await fetchInstitutionById(id, token);
        console.log("institutionData", institutionData);
        setInstitution(institutionData);
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
      }
    };

    fetchInstitutionData();

    const fetchEquipmentData = async () => {
      if (!token || !id) {
        console.warn(
          "No token or institutionId available to fetch equipment data."
        );
        return;
      }

      setLoading(true);
      try {
        const equipmentData = await fetchEquipmentsByInstituteId(id, token);
        // console.log("equipmentData", equipmentData);

        setEquipments(equipmentData);
        setFilteredEquipment(equipmentData);
      } catch (error) {
        console.error("Failed to fetch equipment data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentData();
  }, [id, token]);

  // const handleSearch = (value) => {
  //   setSearchText(value);
  //   const filtered = equipment.filter((item) =>
  //     item.name.toLowerCase().includes(value.toLowerCase())
  //   );
  //   setFilteredEquipment(filtered);
  //   setPage(1);
  // };
  const handleSearch = (value) => {
    setSearchText(value);
    const lowercasedValue = value.toLowerCase();

    const filtered = equipment.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(lowercasedValue)
      )
    );

    setFilteredEquipment(filtered);
    setPage(1); // Reset to the first page when searching
  };

  const handleAddEquipment = () => {
    navigate(`/add-equipment/${id}`);
  };

  const handlePageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (availability) => (availability ? "Available" : "Not Available"),
    },
    {
      title: "Verified By",
      dataIndex: "verifiedBy",
      key: "verifiedBy",
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full h-[92vh] grid grid-rows-[10%_1fr] md:px-12 px-5 py-3">
        <div className="w-full">
          <BackBtn />

          <div className="flex justify-between">
            <h5 className="md:text-[24px] text-[18px] text-black font-medium text-uupercase mb-4 mt-4">
              Equipments
            </h5>

            <div
              onClick={handleAddEquipment}
              className="md:h-[40px] h-[35px] px-4 flex items-center justify-items-center md:gap-4 gap-3 bg-appGreenLight hover:bg-gold text-white md:text-[14px] text-[12px] rounded-[100px] cursor-pointer transition-all duration-300"
            >
              <FaPlusCircle />
              Add new Equipment
            </div>
          </div>

          <h5 className="md:text-[14px] text-[18px] text-black font-medium text-uupercase mb-4 mt-4">
            {institution ? institution.name : "Loading..."}
            <hr />
          </h5>
          <div className="w-full grid md:grid-cols-4 grid-cols-2 gap-4">
            <StatisticsCard
              detail={equipment.length.toString()}
              title="Equipment"
            />
          </div>

          <hr className="my-4" />

          <Input
            placeholder="Search equipment by name"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            className="mb-4"
          />

          <Table
            columns={columns}
            dataSource={filteredEquipment}
            loading={loading}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => navigate(`/equipment-details/${record.id}`),
            })}
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
      </div>
    </DashboardLayout>
  );
}
