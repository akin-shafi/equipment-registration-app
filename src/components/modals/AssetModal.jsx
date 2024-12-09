/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Modal, Button } from "antd";
// import { useNavigate } from "react-router-dom";

const AssetModal = ({ visible, onClose, asset, onEdit, onDelete }) => {
  //   const navigate = useNavigate();
  //   console.log("", navigate);

  const handleEdit = () => {
    onEdit(asset); // Trigger edit action
  };

  const handleDelete = () => {
    onDelete(asset.id); // Trigger delete action
  };

  useEffect(() => {
    if (!visible) {
      // Reset modal state when it closes
    }
  }, [visible]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
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
          {/* <Button
            type="primary"
            onClick={handleEdit}
            className="mt-4"
            style={{ marginRight: "10px" }}
          >
            Edit
          </Button> */}
          {/* <Button type="danger" onClick={handleDelete} className="mt-4">
            Delete
          </Button> */}
        </div>
      )}
    </Modal>
  );
};

export default AssetModal;
