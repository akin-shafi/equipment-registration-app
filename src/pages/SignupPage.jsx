import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/hooks/useAuth"; // Adjust path as necessary
import { Form, Select, Input, Row, Col } from "antd";

import { fetchInstitution } from "@/hooks/useAction";
import WhiteLogo from "../components/whiteLogo";

export function SignupPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [institutions, setInstitutions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getInstitutions = async () => {
      try {
        const institutionsData = await fetchInstitution();
        const institutionOptions = institutionsData.map((institution) => ({
          value: institution.id,
          label: `${institution.name} (${institution.initial})`,
        }));
        setInstitutions(institutionOptions);
      } catch (err) {
        console.error("Failed to fetch institutions", err);
      }
    };

    getInstitutions();
  }, []);

  const handleFinish = async (values) => {
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser({
        title: values.title,
        fullName: values.fullName,
        tags: values.tags,
        email: values.email,
        password: values.password,
      });
      if (response.success) {
        navigate("/login");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(`An error occurred while registering: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary text-white p-4">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <WhiteLogo />
          <h1 className="text-1xl font-bold text-appGreen">Baseline Study</h1>
        </div>
        <div className="mb-4 text-2xl font-bold text-gray-600 text-center">
          Create an Account
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ tags: [] }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: "Please select your title" }]}
              >
                <Select placeholder="Select Title">
                  <Select.Option value="Mr">Mr</Select.Option>
                  <Select.Option value="Mrs">Mrs</Select.Option>
                  <Select.Option value="Ms">Ms</Select.Option>
                  <Select.Option value="Dr">Dr</Select.Option>
                  <Select.Option value="Prof">Prof</Select.Option>
                  <Select.Option value="Engr">Engr</Select.Option>
                  <Select.Option value="Barr">Barr</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: "Please enter the full name" }]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>
            </Col>
          </Row>

          {/* <Row gutter={16}>
            
          </Row> */}

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter a valid email" },
                  { type: "email", message: "Please enter a valid email address" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter a password" }]}
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[{ required: true, message: "Please confirm your password" }]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="tags"
            label="Institution Assigned"
            rules={[{ required: true, message: "Please select at least one institution assigned" }]}
          >
            <Select
              mode="multiple"
              placeholder="Select Institution"
              allowClear
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
              options={institutions}
            />
          </Form.Item>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded bg-secondary text-white hover:bg-teal-700 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Create an Account"}
          </button>
        </Form>

        <div className="mt-4 text-center">
          <p>
            Already have an account?{' '}
            <Link to="/auth/login" className="text-secondary">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}