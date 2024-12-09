/* eslint-disable react-hooks/exhaustive-deps */
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import { fetchInstitutionsByIds } from "@/hooks/useAction";
import { Card, Row, Col, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import BackBtn from "@/components/custom/buttons/BackBtn";

export function Equipment() {
  const { session } = useSession();
  const token = session?.token;
  const tags = session?.user?.tags || []; // Ensure tags is an array
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navidate = useNavigate();

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
      } catch (error) {
        console.error("Failed to fetch institutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tags, token]);

  const handleCardClick = (id) => {
    navidate(`/institution-details/${id}`); // Redirect to the institution details page
  };

  return (
    <DashboardLayout>
      <div className=" p-4">
        <BackBtn />
      </div>
      <div
        className="mt-10"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          flexDirection: "column",
        }}
      >
        <h2 className="page-title text-[24px]">Institutions</h2>
        {loading ? (
          <div className="spinner-container">
            <Spin tip="Loading institutions..." />
          </div>
        ) : institutions.length > 0 ? (
          <Row gutter={[16, 16]} justify="center" style={{ width: "100%" }}>
            {institutions.map((institution) => (
              <Col key={institution.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  title={institution.name}
                  className="custom-card bg-secondary text-white hover:bg-gold"
                  bordered={true}
                  hoverable
                >
                  <p>
                    <strong>Initial:</strong> {institution.initial || "N/A"}
                  </p>
                  <p>
                    <strong>Country:</strong> {institution.country || "N/A"}
                  </p>
                  {/* Add a button */}
                  <button
                    className="teal-outline-btn"
                    onClick={() => handleCardClick(institution.id)}
                  >
                    Open
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="No institutions found." />
        )}
      </div>
    </DashboardLayout>
  );
}
