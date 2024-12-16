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
import BackBtn from "@/components/custom/buttons/BackBtn";

const AddAssets = () => {
  const initialRow = {
    image: "",
    caption: "",
    description: "",
  };

  const { session } = useSession();
  const token = session?.token;
  const { id } = useParams(); // Get the institution ID from the URL
  const [rows, setRows] = useState([initialRow]);
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

  const handleAddRow = () => {
    setRows([...rows, initialRow]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, idx) => idx !== index);
    setRows(updatedRows);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      for (const row of rows) {
        if (!(row.image instanceof File)) {
          setError("Please select a valid image file for all rows.");
          setIsLoading(false);
          return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(row.image.type)) {
          setError(
            "Invalid image format. Only JPEG, PNG, and GIF are allowed."
          );
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("image", row.image);
        formData.append("caption", row.caption);
        formData.append("description", row.description);
        formData.append("institutionId", id);
        formData.append("createdBy", session?.user?.applicationNo);

        const response = await fetch(`${API_BASE_URL}/assets`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to submit asset");
        }
      }

      alert("Assets added successfully!");
      setRows([initialRow]); // Reset the form after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (input) => {
    if (!input) {
      setCaptions([
        "Main Gate",
        "Group Photo",
        "Meeting Session",
        "Administrative Building",
      ]);
    } else if (!captions.includes(input)) {
      setCaptions([...captions, input]);
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

          <h5 className="md:text-[14px] text-[18px] text-black font-medium text-uppercase mb-4 mt-4">
            {institution ? institution.name : "Loading..."}
            <hr />
          </h5>

          {renderError()}

          {rows.map((row, index) => (
            <div
              key={index}
              className="space-y-4 border-b pb-4 mb-4 grid grid-cols-4 gap-2"
            >
              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Image <sup className="text-red-500">*</sup>
                </label>
                <div className="flex items-center space-x-4">
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
                        onClick={() => handleInputChange(index, "image", "")}
                      />
                    )}
                  </div>
                  <label
                    htmlFor={`image-upload-${index}`}
                    className="cursor-pointer text-blue-500 hover:text-blue-700"
                  >
                    {row.image ? "Change Image" : "Upload Image"}
                  </label>
                  <input
                    id={`image-upload-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleInputChange(index, "image", file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Caption <sup className="text-red-500">*</sup>
                </label>
                <Select
                  value={row.caption}
                  onChange={(value) =>
                    handleInputChange(index, "caption", value)
                  }
                  style={{ width: "100%" }}
                  showSearch
                  allowClear
                  onSearch={handleSearch}
                  filterOption={(input, option) =>
                    typeof option?.children === "string" &&
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {captions.map((caption, idx) => (
                    <Select.Option key={idx} value={caption}>
                      {caption}
                    </Select.Option>
                  ))}
                  {captions.includes(row.caption) || (
                    <Select.Option key="custom" value={row.caption}>
                      {row.caption}
                    </Select.Option>
                  )}
                </Select>
              </div>

              <div className="w-full flex flex-col">
                <label className="block text-sm font-medium text-gray-700">
                  Description <sup className="text-red-500">*</sup>
                </label>
                <Input.TextArea
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                  rows={3}
                  placeholder="Enter asset description"
                />
              </div>

              {rows.length > 1 && (
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteRow(index)}
                >
                  Delete Row
                </button>
              )}
            </div>
          ))}

          <div className="mt-4  grid grid-cols-2 gap-4 ">
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-black"
            >
              Add Row
            </button>
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-appGreen hover:bg-appGreenLight rounded-full text-white"
            >
              Submit Assets
            </button>
          </div>
        </div>
      </Spin>
    </DashboardLayout>
  );
};

export default AddAssets;
