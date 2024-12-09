import { useEffect, useState } from "react";
import { useSession } from "@/hooks/useSession";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Popconfirm, message } from "antd";
import {
  fetchAssetsByinstitutionId,
  deleteAssetById,
  createAsset,
  updateAsset,
} from "@/hooks/useAction";
import AssetModal from "@/components/modals/AssetModal"; // Import the modal component

export function AssetsPage() {
  const { session } = useSession();
  const token = session?.token;
  const fullname = session?.user?.fullname;
  const { id } = useParams();
  const [assets, setAssets] = useState([]); // To hold the assets data
  const [filteredAssets, setFilteredAssets] = useState([]); // To filter the assets
  const [loading, setLoading] = useState(false); // For loading state
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [selectedAsset, setSelectedAsset] = useState(null); // For editing asset
  const navigate = useNavigate();

  // Add new asset handler
  const handleAddAssets = () => {
    navigate(`/add-assets/${id}`);
  };

  // View asset handler
  const handleView = (asset) => {
    setSelectedAsset(asset); // Set selected asset data
    setModalVisible(true); // Show modal
  };

  // Edit asset handler
  const handleEdit = (asset) => {
    setSelectedAsset(asset); // Set selected asset data
    setModalVisible(true); // Show modal
  };

  // Delete asset handler
  const handleDelete = async (assetId) => {
    setLoading(true);
    try {
      await deleteAssetById(assetId); // Assuming `deleteAssetById` is a function to delete asset
      message.success("Asset deleted successfully");
      // Refresh the asset list after deletion
      setAssets(assets.filter((asset) => asset.id !== assetId));
      setFilteredAssets(filteredAssets.filter((asset) => asset.id !== assetId));
    } catch (error) {
      console.error("Failed to delete asset:", error);
      message.error("Failed to delete asset");
    } finally {
      setLoading(false);
    }
  };

  // Close modal handler
  const handleModalClose = () => {
    setModalVisible(false); // Close modal
    setSelectedAsset(null); // Reset selected asset
  };

  // Fetch asset data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        console.warn("No token available to fetch assets.");
        return;
      }

      setLoading(true);
      try {
        const result = await fetchAssetsByinstitutionId(id, token);
        setAssets(result); // Set assets data
        setFilteredAssets(result); // Set filtered assets to all assets initially
      } catch (error) {
        console.error("Failed to fetch assets:", error);
        message.error("Failed to load assets");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, id]);

  // Columns for the assets table
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          src={image}
          alt="Asset"
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span title={text}>
          {text.length > 40 ? `${text.slice(0, 40)}...` : text}
        </span>
      ),
    },
    {
      title: "Institution ID",
      dataIndex: "institutionId",
      key: "institutionId",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleView(record)} // Pass the entire record to handleView
            className="bg-appGreen text-white px-3 py-1 rounded hover:bg-gold"
          >
            View
          </Button>
          <Button
            onClick={() => handleEdit(record)} // Pass the entire record to handleEdit
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this asset?"
            onConfirm={() => handleDelete(record.id)} // Pass the ID to handleDelete
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              className="bg-red-500 text-red ml-1 px-3 py-1 rounded hover:bg-red-700"
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="w-full h-[92vh] grid grid-rows-[10%_1fr] md:px-12 px-5 py-3">
        <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
          <div>
            <h5 className="md:text-[20px] text-[16px] font-medium text-black">
              Site Photos
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
              <p className="md:text-[14px] text-[12px] font-light">
                View all site Photo associated with this institution.
              </p>
            </div>
            <div className="md:basis-[30%] basis-0 md:flex w-full h-full items-center justify-center">
              <button
                onClick={handleAddAssets}
                className="py-[10px] px-[20px] bg-appGreen hover:bg-gold rounded-[100px] text-white"
              >
                Add Photo
              </button>
            </div>
          </div>

          <div className="p-4 shadow-md">
            <h5 className="md:text-[24px] text-[18px] text-black font-medium border-b">
              Site Photo List
            </h5>
            <Table
              columns={columns}
              dataSource={filteredAssets}
              loading={loading}
              className="custom-table"
              rowKey="id"
            />
          </div>
        </div>
      </div>

      {/* Pass the selectedAsset and other handlers to AssetModal */}
      <AssetModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={selectedAsset ? updateAsset : createAsset}
        asset={selectedAsset}
      />
    </DashboardLayout>
  );
}
