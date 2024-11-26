import React, { useEffect, useState } from "react";
import { getFiles, archiveFiles, deleteFiles } from "../api";
import Table from "../components/Table";
import HeaderSection from "../components/HeaderSection";
import Pagination from "../components/Pagination";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";

const ArchivedFile = () => {
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
      const archivedStatus = true;
      const response = await getFiles(page, archivedStatus);
      response?.data?.data?.forEach((record) => {
        const age = moment().diff(moment(record.publication_date), "months");
        record.age =
          age > 24
            ? "> 2 years"
            : age > 12
            ? "> 1 year"
            : age > 6
            ? "> 6 months"
            : "> 1 month";
        record.publication_date = moment(record.publication_date).format(
          "DD-MM-YYYY"
        );
        record.createdAt = moment(record.createdAt).format("DD-MM-YYYY");
      });

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
      const data = { ids: selectedRows, archivedStatus: false };
      const result = await archiveFiles(data);
      if (result.status === 200) {
        setSelectedRows([]);
        // update the file to remove higlited row
        return toast.success(`${result.data.message} File Unarchive`);
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to Unarchive");
    }
  };

  const handleDelete = async () => {
    try {
      const data = { ids: selectedRows };
      const result = await deleteFiles(data);
      if (result.status === 200) {
        setSelectedRows([]);
        // update the file to remove higlited row
        return toast.success(`${result.data.message} Files Deleted`);
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to delete");
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
    { header: "Year", key: "year", width: "5%" },
    { header: "Published", key: "publication_date", width: "10%" },
    { header: "Uploaded At", key: "createdAt", width: "10%" },
    { header: "Age", key: "age", width: "10%" },
    { header: "Uploaded By", key: "uploaded_by", width: "10%" },
  ];

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <HeaderSection title={"Archived Files"} />
        <div className="ml-auto flex space-x-2">
          <button
            disabled={selectedRows.length < 1}
            className={`px-3 py-1 text-sm rounded-md 
        ${
          selectedRows.length < 1
            ? "bg-red-300 text-white cursor-not-allowed"
            : "bg-red-500 text-white hover:scale-110 transform transition-all duration-200"
        }`}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            disabled={selectedRows.length < 1}
            className={`px-3 py-1 text-sm rounded-md 
        ${
          selectedRows.length < 1
            ? "bg-gray-500 text-white cursor-not-allowed"
            : "bg-[#454444] text-white hover:scale-110 transform transition-all duration-200"
        }`}
            onClick={handleArchive}
          >
            Unarchive
          </button>
        </div>
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

export default ArchivedFile;
