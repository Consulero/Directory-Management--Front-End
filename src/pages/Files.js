import React, { useEffect, useState } from "react";
import { getFiles, archiveFiles } from "../api";
import Table from "../components/Table";
import HeaderSection from "../components/HeaderSection";
import Pagination from "../components/Pagination";
import { toast, ToastContainer } from "react-toastify";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelect = (rowIndex) => {
    const updatedFiles = [...files];
    const rowId = updatedFiles[rowIndex].id;

    updatedFiles[rowIndex].selected = !updatedFiles[rowIndex].selected;

    setSelectedRows((prevSelectedRows) => {
      if (updatedFiles[rowIndex].selected) {
        return [...prevSelectedRows, rowId];
      } else {
        return prevSelectedRows.filter((id) => id !== rowId);
      }
    });

    setFiles(updatedFiles);
  };

  const fetchFiles = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const archivedStatus = false;
      const response = await getFiles(page, archivedStatus);
      setFiles(response.data?.data || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async () => {
    try {
      const result = await archiveFiles({ ids: selectedRows });
      if (result.status === 200) {
        setSelectedRows([]);
        // update the file to remove higlited row
        return toast.success(result.data.message);
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to archive");
    }
  };

  useEffect(() => {
    fetchFiles(currentPage);
    setSelectedRows([]);
    setFiles((prevFiles) =>
      prevFiles.map((file) => ({ ...file, selected: false }))
    );
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = [
    { header: "File", key: "file_name", width: "20%" },
    { header: "Manufacturer", key: "manufacturer", width: "10%" },
    { header: "Model", key: "model", width: "10%" },
    { header: "Year", key: "year", width: "10%" },
    { header: "Published", key: "publication_date", width: "10%" },
    { header: "Uploaded By", key: "uploaded_by", width: "10%" },
  ];

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <HeaderSection title={"List Files"} />
        <button
          disabled={selectedRows.length < 1}
          className={`px-3 py-1 mr-2 text-sm rounded-md 
            ${
              selectedRows.length < 1
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-[#454444] text-white hover:scale-110 transform transition-all duration-200"
            }`}
          onClick={handleArchive}
        >
          Archive
        </button>
      </div>
      <Table data={files} columns={columns} onRowSelect={handleRowSelect} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </>
  );
};

export default FileList;
