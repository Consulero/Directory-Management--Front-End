import React, { useRef, useState } from "react";
import { uploadFiles } from "../api";
import HeaderSection from "../components/HeaderSection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { COUNTRIES, MANUFACTURER, YEAR, REVISION } from "../data/index";

const FileUpload = () => {
  const initialState = {
    manufacturer: null,
    year: null,
    model: null,
    revision: null,
    publication_date: null,
    region: null,
    software_version: null,
  };
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null); // Ref for the file input
  const [formInput, setFormInput] = useState(initialState);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const handleUpload = async () => {
    setUploading(true);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    // adding the fromInput data to formData
    Object.keys(formInput).forEach((key) => {
      formData.append(key, formInput[key]);
    });

    try {
      if (
        !formInput.model ||
        !formInput.manufacturer ||
        !formInput.year ||
        !formInput.publication_date ||
        !formInput.revision
      ) {
        return toast.error(
          "Missing: Manufacturer | Model | Year | Publish Date | Revision"
        );
      }
      const response = await uploadFiles(formData);

      if (response?.data?.data) {
        const { successResult, failureResult, alreadyExist } =
          response.data.data;

        if (successResult.length > 0) {
          toast.success(`Successfully uploaded: ${successResult.join(", ")}`, {
            position: "top-right",
          });
        }

        if (failureResult.length > 0) {
          toast.error(`Failed to upload: ${failureResult.join(", ")}`, {
            position: "top-right",
          });
        }

        if (alreadyExist.length > 0) {
          toast.error(`Already Exist: ${alreadyExist.join(", ")}`, {
            position: "top-right",
          });
        }
        setSelectedFiles([]);
        setFormInput(initialState);
      }
    } catch (err) {
      return toast.error("Upload Failed!");
    } finally {
      setUploading(false);
    }
  };

  const inputEvent = (e) => {
    const { name, value } = e.target;
    setFormInput((old) => {
      return {
        ...old,
        [name]: value,
      };
    });
  };

  const handleSpanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <>
      <HeaderSection title={"File Upload"} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 bg-white rounded-md shadow-lg p-6">
        <div>
          <label className="font-semibold text-gray-700">Manufacturer</label>
          <select
            id="manufacturer"
            name="manufacturer"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.manufacturer}
            onChange={inputEvent}
          >
            <option value={null}>Select Manufacturer</option>
            {Object.keys(MANUFACTURER).map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Model</label>
          <select
            id="model"
            name="model"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.model}
            onChange={inputEvent}
          >
            <option value={null}>Select Model</option>
            {MANUFACTURER[formInput.manufacturer]?.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">Year</label>
          <select
            id="year"
            name="year"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.year}
            onChange={inputEvent}
          >
            <option value={null}>Select Year</option>
            {YEAR.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-gray-700">
            Manual Publish Date
          </label>
          <input
            id="publication_date"
            name="publication_date"
            type="date"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.publication_date || ""}
            onChange={inputEvent}
          />
        </div>
        <div>
          <label className="font-semibold text-gray-700">Revision</label>
          <select
            id="revision"
            name="revision"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.revision}
            onChange={inputEvent}
          >
            <option value={null}>Select Revision</option>
            {REVISION.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-gray-700">Region</label>
          <select
            id="region"
            name="region"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.region}
            onChange={inputEvent}
          >
            <option value={null}>Select Region</option>
            {COUNTRIES.map((value, idx) => (
              <option key={idx} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold text-gray-700">
            Software Version
          </label>
          <input
            id="software_version"
            name="software_version"
            className="block w-full mt-1 p-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-400 text-sm bg-gray-50"
            value={formInput.software_version}
            onChange={inputEvent}
          />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6   border border-gray-300 rounded-md">
        <div
          className="border-dashed border-2 border-gray-400 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all"
          onDrop={(event) => {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files);
            const pdfFiles = files.filter(
              (file) => file.type === "application/pdf"
            );
            setSelectedFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <p className="text-gray-600">
            Drag and drop your PDF files here or{" "}
            <span
              className="text-blue-600 underline cursor-pointer"
              onClick={handleSpanClick}
            >
              click to upload
            </span>
          </p>
          <input
            type="file"
            name="files"
            accept=".pdf"
            multiple
            onChange={handleFileSelect}
            ref={fileInputRef}
            className="hidden"
          />
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <div className="max-h-40 overflow-y-auto rounded p-2">
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 hover:bg-gray-50"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => removeFile(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className={`w-full mt-4 py-2 rounded bg-gray-200 ${
            uploading || selectedFiles.length === 0
              ? " cursor-not-allowed"
              : " hover:bg-gray-300"
          } text-black font-semibold`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <ToastContainer />
      </div>
    </>
  );
};

export default FileUpload;
