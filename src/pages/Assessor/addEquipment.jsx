import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { SingleUploadPage } from "../SingleUploadPage";
import { BulkUploadPage } from "../BulkUploadPage";
import { fetchInstitutionById } from "@/hooks/useAction";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BackBtn from "@/components/custom/buttons/BackBtn";

const { TabPane } = Tabs;

export function AddEquipment() {
  const { session } = useSession();
  const token = session?.token;
  const applicationNo = session?.user?.applicationNo;
  const [institution, setInstitution] = useState(null);
  const { id } = useParams(); // Get the institution ID from the URL
  const navigate = useNavigate();
  //   const { session } = useSession();
  // console.log("applicationNo", applicationNo);

  useEffect(() => {
    if (!id) {
      console.warn("No institution ID provided. Redirecting...");
      navigate("/assessor"); // Redirect to the institute-details page
    }
  }, [id, navigate]);

  useEffect(() => {
    const fetchInstitutionData = async () => {
      if (!token || !id) {
        console.warn("No token or id available to fetch institution data.");
        return;
      }
      try {
        const institutionData = await fetchInstitutionById(id, token);
        // console.log("institutionData", institutionData);
        setInstitution(institutionData);
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
      }
    };

    fetchInstitutionData();
  }, [id, token]);
  return (
    <DashboardLayout>
      <div className="w-full  grid grid-rows-[10%_1fr] md:px-12 px-5 py-3 ">
        <BackBtn />

        <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 ">
          <div className="">
            <h5 className="md:text-[20px] text-[16px] font-medium text-black">
              Equipment Register
            </h5>
            <p className="text-[#667085] md:text-[14px] text-[12px] font-normal">
              Register equipment:{" "}
              {institution ? institution.name : "Loading..."}
            </p>
          </div>
        </div>

        {/*  */}

        <div className="flex justify-center items-center w-full mt-3">
          <Tabs
            defaultActiveKey="1"
            type="card"
            // className="w-full "
            className="custom-tabs w-full"
          >
            <TabPane tab="Bulk Upload" key="1">
              {/* Pass id as a prop to BulkUploadPage */}
              <BulkUploadPage
                institutionId={id}
                applicationNo={applicationNo}
              />
            </TabPane>
            <TabPane tab="Single Upload" key="2">
              {/* Pass id as a prop to SingleUploadPage */}
              <SingleUploadPage institutionId={id} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
