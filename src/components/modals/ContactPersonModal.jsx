/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Modal, Button, Input, Form, message } from "antd";

const ContactPersonModal = ({
  visible,
  onClose,
  contact,
  onSave,
  designatedBy,
  institutionId,
}) => {
  const [form] = Form.useForm();

  // Set form values when the modal opens
  useEffect(() => {
    if (visible && contact) {
      // Set form values when the modal opens with a contact
      form.setFieldsValue({
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        designation: contact.designation,
        createdBy: designatedBy,
        institutionId: institutionId,
      });
    } else if (visible && !contact) {
      // Clear form for adding a new contact
      form.resetFields();
    }
  }, [visible, contact, form, designatedBy, institutionId]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Ensure 'fullName', 'designatedBy', and 'institutionId' are included in the values sent to the backend
        const contactData = {
          ...values, // values will include 'fullName', 'email', 'phone', etc.
          createdBy: designatedBy, // Add designatedBy to the payload
          institutionId: institutionId, // Add institutionId to the payload
        };

        // Save the contact information
        onSave(contactData)
          .then(() => {
            message.success(
              contact
                ? "Contact updated successfully"
                : "Contact added successfully"
            );
            onClose(); // Close the modal
          })
          .catch((error) => {
            console.error("Failed to save contact:", error);
            message.error("Failed to save contact");
          });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          className="bg-appGreen hover:bg-appGreenLight"
          onClick={handleSubmit}
        >
          {contact ? "Save Changes" : "Add Contact"}
        </Button>,
      ]}
      width={600} // Adjust size as needed
      title={contact ? `Edit Contact: ${contact.fullName}` : "Add New Contact"}
    >
      {/* Contact Form */}
      <Form
        form={form}
        layout="vertical"
        name="contactForm"
        initialValues={{
          fullName: contact?.fullName,
          email: contact?.email,
          phone: contact?.phone,
          designation: contact?.designation,
        }}
      >
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter the name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter an email address!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: "Please enter a phone number!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Designation"
          name="designation"
          rules={[{ required: true, message: "Please enter designation!" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContactPersonModal;
