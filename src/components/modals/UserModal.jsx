/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Row, Col } from "antd";
import { fetchRoles, fetchInstitution } from "@/hooks/useAction"; // Import fetchRoles and fetchInstitution

export function UserModal({
  visible,
  onClose,
  onSubmit,
  user = null,
  showCloseIcon = true,
  tagsOptions = [], // Old tagsOptions prop, will be replaced with fetched institutions
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(user);
  const [roles, setRoles] = useState([]); // State to hold fetched roles
  const [institutions, setInstitutions] = useState([]); // State to hold fetched institutions

  // Fetch roles when the modal is visible
  useEffect(() => {
    if (visible) {
      // Fetch roles only when the modal is visible
      const getRoles = async () => {
        try {
          const rolesData = await fetchRoles(); // Fetch roles from API
          setRoles(rolesData); // Set the roles to the state
        } catch (error) {
          console.error("Failed to fetch roles", error);
        }
      };

      // Fetch institutions only when the modal is visible
      const getInstitutions = async () => {
        try {
          const institutionsData = await fetchInstitution(); // Fetch institutions from API
          const institutionOptions = institutionsData.map((institution) => ({
            value: institution.id,
            label: `${institution.name} (${institution.initial})`, // Format name and initial
          }));
          setInstitutions(institutionOptions); // Set the institutions to the state
        } catch (error) {
          console.error("Failed to fetch institutions", error);
        }
      };

      getRoles();
      getInstitutions();
      isEdit ? form.setFieldsValue(user) : form.resetFields();
    }
  }, [form, isEdit, user, visible]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      createdBy: "admin", // Automatically set createdBy
      role: values.role || "admin", // Set role to the selected value
    };
    onSubmit(payload);
    form.resetFields(); // Clear form after submission
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Edit Member" : "Create New Member"}
      onCancel={onClose}
      footer={[
        showCloseIcon && (
          <Button key="cancel" className="rounded-full" onClick={onClose}>
            Cancel
          </Button>
        ),
        <Button
          key="submit"
          type="primary"
          className="bg-appGreen hover:bg-appGreenLight rounded-full w-full"
          onClick={() => form.submit()}
        >
          {isEdit ? "Save Changes" : "Submit"}
        </Button>,
      ]}
      closeIcon={showCloseIcon ? undefined : null} // Hide close icon based on showCloseIcon state
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ tags: [] }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[
                { required: true, message: "Please enter the full name" },
              ]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter a valid email" },
                {
                  type: "email",
                  message: "Please enter a valid email address",
                },
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>
        </Row>

        {!isEdit && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder="Select role"
            options={roles.map((role) => ({ value: role, label: role }))}
          />
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          rules={[
            { required: true, message: "Please select at least one tag" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select tags"
            allowClear
            showSearch // Enable search functionality
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            } // Custom filter function for search
            options={institutions} // Use institutions as tag options
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
