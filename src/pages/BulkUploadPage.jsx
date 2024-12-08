/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import { sendBulkEquipment } from "../hooks/useAction";
import UploadedFile from "@/components/custom/UploadedFile";
import { UploadIcon } from "@/components/Icon";

export function BulkUploadPage({ institutionId, applicationNo }) {
  const { session } = useSession();
  const token = session?.token;
  const [excelFile, setExcelFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State for tracking upload process
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);
  const [skippedRows, setSkippedRows] = useState([]); // State to track skipped rows

  const handleUploadFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) setExcelFile(selectedFile);
  };

  const handleDeleteFile = () => setExcelFile(null);

  const renderUploadSection = (fileType, title) => {
    const fileName = excelFile?.name || null;

    return (
      <div className="w-full md:h-[75px] h-[60px]">
        {excelFile ? (
          <UploadedFile
            fileName={fileName}
            onDelete={handleDeleteFile}
            type=".XLSX"
          />
        ) : (
          <div
            className="w-full md:h-[75px] h-[60px] border-dashed border border-[#D0D5DD] rounded-[10px] px-5 mt-3 flex items-center justify-between gap-3 transition-all duration-500 hover:border-appGreen cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <UploadIcon />
            <div>
              <p className="text-[10px] sm:text-primary font-bold">{`Upload ${title}`}</p>
              <p className="text-[10px] sm:text-[#98A2B3]">.XLSX | 2MB max.</p>
            </div>
            <div className="w-[80px] h-[36px] flex items-center justify-center bg-teal-700 text-white rounded-[6px]">
              Upload
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleUploadFileChange}
              accept=".XLSX"
            />
          </div>
        )}
      </div>
    );
  };

  const handleDownloadTemplate = () => {
    const templateUrl =
      "https://docs.google.com/spreadsheets/d/1ZRjMLZMZMOYvbUazll0J44Paql6cdDWe/edit?gid=1161773019#gid=1161773019";
    window.open(templateUrl, "_blank");
  };

  const handleBulkUploadSubmit = async (e) => {
    e.preventDefault();

    if (!excelFile) {
      setErrorMessage("Excel file is required for bulk upload.");
      return;
    }

    const formData = new FormData();
    formData.append("applicationNo", applicationNo);
    formData.append("institutionId", institutionId);
    formData.append("excelFile", excelFile);

    setIsUploading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setSkippedRows([]);

    try {
      const result = await sendBulkEquipment(formData, token);

      if (result?.statusCode === 200) {
        setSuccessMessage(result.message);
        setSkippedRows(result.skippedRows || []); // Populate skipped rows
        setErrorMessage("");
      } else {
        setErrorMessage(result?.message || "Unknown error occurred.");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage(error.message || "Error during bulk upload.");
      setSuccessMessage("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="w-full h-[170px] rounded-[12px] flex items-center justify-between bg-secondary p-4">
        <div className="md:basis-[50%] basis-full text-white h-full flex flex-col justify-center gap-2">
          <h6 className="text-[10px] font-bold">INSTRUCTIONS</h6>
          <h2 className="md:text-[20px] text-[16px] font-bold">
            Bulk Equipment Upload
          </h2>
          <p className="md:text-[14px] text-[12px] font-light">
            Download the template to easily upload multiple equipment records in
            bulk. Stay organized and streamline your inventory management with
            ease.
          </p>
        </div>

        <div className="md:basis-[30%] basis-0 md:flex hidden w-full h-full items-center justify-center">
          <button
            className="py-[10px] px-[20px] bg-appGreen rounded-[100px] text-white"
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
          >
            {isDownloading ? "Downloading..." : "Download template"}
          </button>
        </div>
      </div>

      <div className="mt-8 w-full bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">Bulk Equipment Upload</h3>
        <form onSubmit={handleBulkUploadSubmit}>
          <div className="my-5">
            <p className="font-azoSansRegular">
              Please ensure that the excel file you upload is well filled
              following instructions as stated above.
            </p>
            {renderUploadSection("excel", "excel File")}
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <div className="text-red-500 mb-4">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}

          {/* Success Message Display */}
          {successMessage && (
            <div className="text-green-500 mb-4">
              <strong>Success:</strong> {successMessage}
            </div>
          )}

          {/* Skipped Rows Section */}
          {skippedRows.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-100 rounded-md">
              <h4 className="font-bold text-yellow-700">Skipped Rows</h4>
              <p className="text-sm text-yellow-600">
                The following rows were skipped during the upload process:
              </p>
              <ul className="mt-2 list-disc list-inside">
                {skippedRows.map((row, index) => (
                  <li key={index} className="text-yellow-800">
                    {typeof row === "string"
                      ? row // Display reason if it's a string
                      : `Row ${row.serialNo}: ${
                          row.reason || "Duplicate record"
                        }`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className={`w-full mt-4 text-white px-4 py-2 rounded-md ${
              isUploading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-appGreen hover:bg-appGreenLight"
            }`}
            disabled={isUploading}
          >
            {isUploading ? "Processing..." : "Upload excel sheet"}
          </button>
        </form>
      </div>
    </>
  );
}
