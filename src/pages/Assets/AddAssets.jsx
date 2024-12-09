/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSession } from "@/hooks/useSession";
import { useParams } from "react-router-dom";
import { Spin, Select, Input } from "antd"; // for Ant Design components
import DashboardLayout from "@/components/layout/DashboardLayout";
import cameraImage from "../../assets/images/camera.jpeg";
import { fetchInstitutionById } from "@/hooks/useAction";
import BackBtn from "@/components/Custom/Buttons/BackBtn";

const AddAssets = () => {
  const initialRow = {
    image: "",
    caption: "",
    description: "",
  };

  const { session } = useSession();
  const token = session?.token;
  const { id } = useParams(); // Get the institution ID from the URL
  const [row, setRow] = useState(initialRow);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [institution, setInstitution] = useState(null);
  const [captions, setCaptions] = useState([
    "Main Gate",
    "Group Photo",
    "Meeting Session",
    "Administrative Building",
  ]); // Example options

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchInstitutionData = async () => {
      if (!token || !id) {
        console.warn("No token or id available to fetch institution data.");
        return;
      }
      try {
        const institutionData = await fetchInstitutionById(id, token);
        setInstitution(institutionData);
      } catch (error) {
        console.error("Failed to fetch institution data:", error);
      }
    };

    fetchInstitutionData();
  }, [id, token]);

  const renderError = () =>
    error && <p className="text-red-500 text-center mb-4">{error}</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Ensure row.image is a File object (not a blob URL)
    if (!(row.image instanceof File)) {
      setError("Please select a valid image file.");
      setIsLoading(false);
      return;
    }

    // Check the file type (only allow images)
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(row.image.type)) {
      setError("Invalid image format. Only JPEG, PNG, and GIF are allowed.");
      setIsLoading(false);
      return;
    }

    // Create FormData object to send data as multi-part form data
    const formData = new FormData();

    // Append data to the FormData object
    formData.append("image", row.image); // Send the actual File object
    formData.append("caption", row.caption);
    formData.append("description", row.description);
    formData.append("institutionId", id);
    formData.append("createdBy", session?.user?.applicationNo); // Assuming `createdBy` is the user ID from session

    try {
      const response = await fetch(`${API_BASE_URL}/assets`, {
        method: "POST",
        body: formData, // Send the formData as the body
      });

      if (!response.ok) {
        throw new Error("Failed to submit asset");
      }

      alert("Asset added successfully!");
      setRow(initialRow); // Reset the form after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Spin spinning={isLoading}>
        <div className="space-y-6 p-4">
          <BackBtn />

          <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
            <div>
              <h5 className="md:text-[20px] text-[16px] font-medium text-black">
                Add Asset
              </h5>
            </div>
          </div>

          <h5 className="md:text-[14px] text-[18px] text-black font-medium text-uupercase mb-4 mt-4">
            {institution ? institution.name : "Loading..."}
            <hr />
          </h5>

          {renderError()}

          {/* Image Upload */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Image <sup className="text-red-500">*</sup>
            </label>

            <div className="flex items-center space-x-4">
              {/* Avatar Image */}
              <div className="relative">
                <img
                  src={
                    row.image instanceof File
                      ? URL.createObjectURL(row.image)
                      : cameraImage
                  }
                  alt="Asset Avatar"
                  className="w-16 h-16 object-cover"
                />
                {row.image && (
                  <RiDeleteBin5Line
                    className="absolute top-0 right-0 cursor-pointer text-red-500"
                    onClick={() => {
                      setRow({ ...row, image: "" });
                    }}
                  />
                )}
              </div>

              {/* Upload Button */}
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
              >
                {row.image ? "Change Image" : "Upload Image"}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setRow({ ...row, image: file }); // Store the actual File object
                  }
                }}
              />
            </div>
          </div>

          {/* Caption - Searchable Dropdown */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Caption <sup className="text-red-500">*</sup>
            </label>
            <Select
              value={row.caption}
              onChange={(value) => setRow({ ...row, caption: value })}
              style={{ width: "100%" }}
              showSearch
              allowClear
              filterOption={(input, option) =>
                option?.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {captions.map((caption, idx) => (
                <Select.Option key={idx} value={caption}>
                  {caption}
                </Select.Option>
              ))}
              <Select.Option value="other">
                <Input
                  placeholder="Enter custom caption"
                  onBlur={(e) => setRow({ ...row, caption: e.target.value })}
                />
              </Select.Option>
            </Select>
          </div>

          {/* Description */}
          <div className="w-full flex flex-col">
            <label className="block text-sm font-medium text-gray-700">
              Description <sup className="text-red-500">*</sup>
            </label>
            <Input.TextArea
              value={row.description}
              onChange={(e) => setRow({ ...row, description: e.target.value })}
              rows={3}
              placeholder="Enter asset description"
            />
          </div>

          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-appGreen hover:bg-appGreenLight rounded-full text-white rounded"
            >
              Submit Asset
            </button>
          </div>
        </div>
      </Spin>
    </DashboardLayout>
  );
};

export default AddAssets;
