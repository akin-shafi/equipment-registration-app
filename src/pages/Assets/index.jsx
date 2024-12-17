/* eslint-disable no-unused-vars */
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
import ViewAssetModal from "@/components/modals/ViewAssetModal"; // Import the view image modal component

export function AssetsPage() {
  const { session } = useSession();
  const token = session?.token;
  const fullname = session?.user?.fullname;
  const { id } = useParams();
  const [assets, setAssets] = useState([]); // To hold the assets data
  const [filteredAssets, setFilteredAssets] = useState([]); // To filter the assets
  const [loading, setLoading] = useState(false); // For loading state
  const [modalVisible, setModalVisible] = useState(false); // For modal visibility
  const [imageModalVisible, setImageModalVisible] = useState(false); // For image modal visibility
  const [selectedAsset, setSelectedAsset] = useState(null); // For editing asset
  const [viewImage, setViewImage] = useState(""); // For viewing image
  const navigate = useNavigate();

  // Add new asset handler
  const handleAddAssets = () => {
    navigate(`/add-assets/${id}`);
  };

  // View asset image handler
  const handleView = (image) => {
    setViewImage(image); // Set selected image data
    setImageModalVisible(true); // Show image modal
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
      await deleteAssetById(assetId); // Delete the asset
      message.success("Asset deleted successfully");
      // Remove deleted asset from lists
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.id !== assetId)
      );
      setFilteredAssets((prevFiltered) =>
        prevFiltered.filter((asset) => asset.id !== assetId)
      );
    } catch (error) {
      console.error("Failed to delete asset:", error);
      message.error("Failed to delete asset");
    } finally {
      setLoading(false);
    }
  };

  // Close modal handler
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedAsset(null);
  };

  // Close image modal handler
  const handleImageModalClose = () => {
    setImageModalVisible(false);
    setViewImage("");
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
        setAssets(result);
        setFilteredAssets(result);
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
      render: (image, record) => (
        <img
          src={image}
          alt="Asset"
          className="w-16 h-16 object-cover rounded-md cursor-pointer"
          onClick={() => handleView(record)} // Trigger modal on image click
        />
      ),
    },
    {
      title: "Caption & Description",
      key: "captionDescription",
      render: (_, record) => (
        <div>
          <div>
            <strong>Caption:</strong> {record.caption}
          </div>
          <div>
            <strong>Description:</strong>{" "}
            {record.description.length > 40
              ? `${record.description.slice(0, 40)}...`
              : record.description}
          </div>
        </div>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            onClick={() => handleEdit(record)}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this asset?"
            onConfirm={() => handleDelete(record.id)}
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
                View all site photos associated with this institution.
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

      <AssetModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={async (data) => {
          setLoading(true);
          try {
            if (selectedAsset) {
              const updatedAsset = await updateAsset(
                selectedAsset.id,
                data,
                token
              );
              message.success("Asset updated successfully");
              setAssets((prev) =>
                prev.map((asset) =>
                  asset.id === selectedAsset.id
                    ? { ...asset, ...updatedAsset }
                    : asset
                )
              );
              setFilteredAssets((prev) =>
                prev.map((asset) =>
                  asset.id === selectedAsset.id
                    ? { ...asset, ...updatedAsset }
                    : asset
                )
              );
            } else {
              const newAsset = await createAsset(data, token);
              message.success("Asset created successfully");
              setAssets((prev) => [...prev, newAsset]);
              setFilteredAssets((prev) => [...prev, newAsset]);
            }
            setModalVisible(false);
          } catch (error) {
            console.error("Failed to save asset:", error);
            message.error("Failed to save asset");
          } finally {
            setLoading(false);
          }
        }}
        asset={selectedAsset}
      />

      <ViewAssetModal
        visible={imageModalVisible}
        onClose={handleImageModalClose}
        selectedAsset={viewImage}
      />
    </DashboardLayout>
  );
}
