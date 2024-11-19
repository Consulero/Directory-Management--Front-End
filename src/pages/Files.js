import React, { useEffect, useState } from "react";
import { getFiles } from "../api";
import Table from "../components/Table";

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchFiles = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getFiles(page);
      setFiles(response.data?.data || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const columns = [
    { header: "ID", key: "id", width: "5%" },
    { header: "File", key: "file_name", width: "15%" },
    { header: "Manufacturer", key: "manufacturer", width: "10%" },
    { header: "Year", key: "year", width: "10%" },
    { header: "Uploaded By", key: "uploaded_by", width: "10%" },
  ];

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">List of Files</h2>
      <Table data={files} columns={columns} />
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-sm rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FileList;
