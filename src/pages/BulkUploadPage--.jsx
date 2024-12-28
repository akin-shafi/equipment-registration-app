/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useSession } from "@/hooks/useSession";
import UploadedFile from "@/components/custom/UploadedFile";
import { UploadIcon } from "@/components/Icon";

export function BulkUploadPage({ institutionId, applicationNo }) {
  const { session } = useSession();
  const token = session?.token;
  const [excelFile, setExcelFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef(null);
  const [skippedRows, setSkippedRows] = useState([]);
  const [realTimeMessages, setRealTimeMessages] = useState([]);

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
    setRealTimeMessages([]);

    try {
      const response = await fetch("/equipment/bulk-upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const eventSource = new EventSource("/equipment/bulk-upload/events");

        eventSource.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);
          setRealTimeMessages((prevMessages) => [...prevMessages, parsedData]);

          if (parsedData.message === "Upload completed") {
            setSuccessMessage("Upload completed successfully.");
            eventSource.close();
            setIsUploading(false);
          } else if (parsedData.error) {
            setSkippedRows((prevSkippedRows) => [
              ...prevSkippedRows,
              parsedData,
            ]);
          }
        };

        eventSource.onerror = (error) => {
          console.error("EventSource error: ", error);
          setErrorMessage("An error occurred during real-time updates.");
          eventSource.close();
        };
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Unknown error occurred.");
      }
    } catch (error) {
      setErrorMessage(error.message || "Error during bulk upload.");
    } finally {
      setIsUploading(false);
    }
  };

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
    setIsDownloading(true);
    const templateUrl =
      "https://docs.google.com/spreadsheets/d/1ZRjMLZMZMOYvbUazll0J44Paql6cdDWe/edit?gid=1161773019#gid=1161773019";
    window.open(templateUrl, "_blank");
    setTimeout(() => {
      setIsDownloading(false);
      alert("Your excel template for bulk upload has been downloaded.");
    }, 2000);
  };

  return (
    <>
      <div className="w-full h-[170px] rounded-[12px] flex items-center justify-between bg-olive p-4">
        <div className="md:basis-[70%] basis-full text-secondary h-full flex flex-col justify-center gap-2">
          <h6 className="text-[10px] font-bold">INSTRUCTIONS</h6>
          <h2 className="md:text-[20px] text-[16px] font-bold">
            Bulk Equipment Upload!.
          </h2>
          <p className="md:text-[14px] text-[12px] font-light">
            Download the template to easily upload multiple equipment records in
            bulk.
          </p>
        </div>
        <div className="md:basis-[30%] basis-0 md:flex w-full h-full items-center justify-center">
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
        <div className="grid grid-cols-2 gap-4 mb-4">
          <ol className="border shadow-md px-6 py-3 list-decimal list-inside">
            <h3 className="font-bold text-[15px] mb-2 border-b">
              Step 1: Download Sample Sheet
            </h3>
            <li>
              Click{" "}
              <b
                onClick={handleDownloadTemplate}
                className="text-appGreen cursor-pointer hover:text-black hover:underline"
              >
                {`"Download Template"`}
              </b>{" "}
              to access the sample Google Sheet.
            </li>
            <li>Download the sheet to your device and make your own copy.</li>
          </ol>
          <ol className="border shadow-md px-6 py-3 list-decimal list-inside">
            <h3 className="font-bold text-[15px] mb-2 border-b">
              Step 2: Data Entry
            </h3>
            <li>Replace the sample data in the sheet with your own data.</li>
            <li>
              Ensure the <b className="text-appGreen">{`"Serial No"`}</b> column
              starts from 100 and follows the sequence.
            </li>
            <li>
              For the <b className="text-appGreen">{`"Image"`}</b> column,
              upload images of your equipment to Google Drive and include the
              link to each image in the corresponding row.
            </li>
            <li>
              Save the document as an Excel file with the extension{" "}
              <code>.XLSX</code>.
            </li>
          </ol>
          <ol className="border shadow-md px-6 py-3 list-decimal list-inside">
            <h3 className="font-bold text-[15px] mb-2 border-b">
              Step 3: Upload Pre-filled Sheet
            </h3>
            <li>
              Click the <b className="text-appGreen">{`"Upload"`}</b> button
              below to select the sheet from your device.
            </li>
            <li>
              Finally, click{" "}
              <b className="text-appGreen">{`"Upload Excel Sheet"`}</b> to
              complete the process.
            </li>
          </ol>
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

            {/* Real-Time Messages */}
            {realTimeMessages.length > 0 && (
              <div className="mt-6 p-4 bg-blue-100 rounded-md">
                <h4 className="font-bold text-blue-700">Real-Time Updates</h4>
                <ul className="mt-2 list-decimal list-inside">
                  {realTimeMessages.map((message, index) => (
                    <li key={index} className="text-blue-800">
                      {JSON.stringify(message)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skipped Rows Section */}
            {skippedRows.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-100 rounded-md">
                <h4 className="font-bold text-yellow-700">Skipped Rows</h4>
                <p className="text-sm text-yellow-600">
                  The following rows were skipped during the upload process:
                </p>
                <ul className="mt-2 list-decimal list-inside">
                  {skippedRows.map((row, index) => (
                    <li key={index}>
                      Row {row.row.serialNo}: {row.error || "Duplicate record"}
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
      </div>
    </>
  );
}
