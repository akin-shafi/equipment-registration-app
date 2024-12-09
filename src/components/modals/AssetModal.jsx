/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Modal, Button, Input, Form } from "antd";
// import { useNavigate } from "react-router-dom";

const AssetModal = ({ visible, onClose, asset, onSave }) => {
  // State to manage form fields
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && asset) {
      // Set the form values when the modal opens with an asset
      form.setFieldsValue({
        caption: asset.caption,
        description: asset.description,
        image: asset.image,
      });
    }
  }, [visible, asset, form]);

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // Call the onSave function to save the edited asset
        onSave({ ...asset, ...values });
        onClose(); // Close the modal after saving
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
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
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Save
        </Button>,
      ]}
      width={600} // Adjust size as needed
    >
      {asset && (
        <div className="flex flex-col items-center">
          <img
            src={asset.image}
            alt="Asset"
            className="w-full max-w-[500px] object-cover rounded-md mb-4"
          />
          <h3 className="text-xl font-semibold">{asset.caption}</h3>
          <p className="text-gray-500">{asset.description}</p>

          {/* Asset Edit Form */}
          <Form
            form={form}
            layout="vertical"
            name="assetForm"
            initialValues={{
              caption: asset.caption,
              description: asset.description,
              image: asset.image,
            }}
          >
            <Form.Item
              label="Caption"
              name="caption"
              rules={[
                { required: true, message: "Please enter the asset caption!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                { required: true, message: "Please enter a description!" },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Image URL"
              name="image"
              rules={[
                {
                  required: true,
                  message: "Please provide the asset image URL!",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default AssetModal;
