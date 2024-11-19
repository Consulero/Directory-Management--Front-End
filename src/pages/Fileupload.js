import React, { useRef, useState } from "react";
import { uploadFiles } from "../api";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    setSelectedFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await uploadFiles(formData);

      if (!response.ok) {
        throw new Error("Upload failed.");
      }

      alert("Files uploaded successfully!");
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSpanClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">File Uploader</h2>
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
            className="hidden" // Hide the file input
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

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default FileUpload;
