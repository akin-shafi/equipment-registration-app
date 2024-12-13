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

const AddEquipmentForm = () => {
  const initialRow = {
    image: "",
    serialNo: "",
    name: "",
    taxonomy: "",
    department: "",
    description: "",
    quantity: "",
    availability: "",
    status: "",
  };

  const { session } = useSession();
  const token = session?.token;
  const { id } = useParams(); // Get the institution ID from the URL
  const [rows, setRows] = useState([initialRow]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [institution, setInstitution] = useState(null);

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

  const generateSerialNumber = (index) => {
    return `EQ-${Math.random().toString(36).substr(2, 8).toUpperCase()}-${id}`;
  };

  const handleAddRow = () => {
    const newRow = {
      ...initialRow,
      serialNo: generateSerialNumber(rows.length),
    };
    setRows([...rows, newRow]);
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
        formData.append("serialNo", row.serialNo);
        formData.append("name", row.name);
        formData.append("taxonomy", row.taxonomy);
        formData.append("department", row.department);
        formData.append("description", row.description);
        formData.append("availability", row.availability);
        formData.append("status", row.status);
        formData.append("quantity", row.quantity);
        formData.append("institutionId", id);
        formData.append("createdBy", session?.user?.applicationNo);

        const response = await fetch(`${API_BASE_URL}/equipment/create-multiple`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to submit equipment");
        }
      }

      alert("Equipment added successfully!");
      setRows([{ ...initialRow, serialNo: generateSerialNumber(0) }]); // Reset the form after successful submission
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setRows([{ ...initialRow, serialNo: generateSerialNumber(0) }]);
  }, [id]);

  return (
    <DashboardLayout>
      <Spin spinning={isLoading}>
        <div className="space-y-6 p-4">
          <BackBtn />

          <div className="w-full h-[8%] flex justify-between md:gap-0 gap-4 mt-1">
            <div>
              <h5 className="md:text-[20px] text-[16px] font-medium text-black">
                Add Equipment Sheet
              </h5>
            </div>
          </div>

          <h5 className="md:text-[14px] text-[18px] text-black font-medium text-uppercase mb-4 mt-4">
            {institution ? institution.name : "Loading..."}
            <hr />
          </h5>

          {renderError()}

          {rows.map((row, index) => (
            <>
              {rows.length > 1 && (
                <div className="flex justify-end items-center md:col-span-2 col-span-1 cursor-pointer">
                  <div
                    onClick={() => handleDeleteRow(index)}
                    className="flex items-center transition-all duration-300 hover:text-red-500"
                  >
                    <RiDeleteBin5Line className="mr-2 text-appMuted transition-all duration-300 hover:text-red-500" />
                    <span className="transition-all duration-300 hover:text-red-500">
                      Remove Row
                    </span>
                  </div>
                </div>
              )}
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
                        alt="Equipment"
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

                <div className="w-full flex flex-col hidden">
                  <label className="block text-sm font-medium text-gray-700">
                    Serial No <sup className="text-red-500">*</sup>
                  </label>
                  <Input
                    value={row.serialNo}
                    readOnly
                    placeholder="Serial Number"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Name <sup className="text-red-500">*</sup>
                  </label>
                  <Input
                    value={row.name}
                    required
                    onChange={(e) =>
                      handleInputChange(index, "name", e.target.value)
                    }
                    placeholder="Enter Equipment Name"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Taxonomy <sup className="text-red-500">*</sup>
                  </label>
                  <Input
                    value={row.taxonomy}
                    required
                    onChange={(e) =>
                      handleInputChange(index, "taxonomy", e.target.value)
                    }
                    placeholder="Enter Taxonomy"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Department <sup className="text-red-500">*</sup>
                  </label>
                  <Input
                    value={row.department}
                    required
                    onChange={(e) =>
                      handleInputChange(index, "department", e.target.value)
                    }
                    placeholder="Enter Department"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <sup className="text-red-500">*</sup>
                  </label>
                  <Input.TextArea
                    value={row.description}
                    required
                    onChange={(e) =>
                      handleInputChange(index, "description", e.target.value)
                    }
                    rows={3}
                    placeholder="Enter Description"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity <sup className="text-red-500">*</sup>
                  </label>
                  <Input
                    value={row.quantity}
                    required
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    placeholder="Enter Quantity"
                    type="number"
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Availability <sup className="text-red-500">*</sup>
                  </label>
                  <Select
                    value={row.availability}
                    required
                    onChange={(value) =>
                      handleInputChange(index, "availability", value)
                    }
                    placeholder="Select Availability"
                    options={[
                      { value: "", label: "Select Availability" },
                      { value: "true", label: "True" },
                      { value: "false", label: "False" },
                    ]}
                  />
                </div>

                <div className="w-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700">
                    Status <sup className="text-red-500">*</sup>
                  </label>
                  <Select
                    value={row.status}
                    onChange={(value) =>
                      handleInputChange(index, "status", value)
                    }
                    required
                    placeholder="Select Status"
                    options={[
                      { value: "", label: "Select Status" },
                      { value: "functioning", label: "Functioning" },
                      { value: "not-functioning", label: "Not functioning" },
                    ]}
                  />
                </div>
              </div>
            </>
          ))}

          <div className="mt-4 flex space-x-4">
            <button
              type="button"
              onClick={handleAddRow}
              className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-black"
            >
              Add Row
            </button>

            <button
              onClick={handleSubmit}
              className="flex-1 py-2 bg-appGreen hover:bg-appGreenLight rounded-full text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </Spin>
    </DashboardLayout>
  );
};

export default AddEquipmentForm;
