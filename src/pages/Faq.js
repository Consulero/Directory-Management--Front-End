import React, { useEffect, useState } from "react";
import { getFaqs, approveFaq, prepareJsonl } from "../api";
import Table from "../components/Table";
import HeaderSection from "../components/HeaderSection";
import Pagination from "../components/Pagination";
import { toast, ToastContainer } from "react-toastify";

const Faq = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [jsonlLoading, setJsonlLoading] = useState(false);

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
      const response = await getFaqs(page);
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
      const data = { ids: selectedRows, approveStatus: true };
      const result = await approveFaq(data);
      if (result.status === 200) {
        setSelectedRows([]);
        toast.success(`${result.data.message} Data Approved`);
        window.location.reload();
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to approve");
    }
  };
  const createJsonl = async () => {
    try {
      setJsonlLoading(true);
      const result = await prepareJsonl();
      console.log(result);
      if (result.status === 200) {
        toast.success(`${result.data?.data} created`);
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to prepare JSONL file"
      );
    } finally {
      setJsonlLoading(false);
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
    { header: "Question", key: "question", width: "30%" },
    { header: "Answer", key: "answer", width: "50%" },
    { header: "Approve", key: "approve", width: "10%" },
  ];

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <HeaderSection title={"Faqs"} />
        <div className="ml-auto flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              jsonlLoading
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-[#454444] text-white hover:scale-110"
            }`}
            onClick={createJsonl}
            disabled={jsonlLoading}
          >
            + JSONL
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
            Approve
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

export default Faq;
