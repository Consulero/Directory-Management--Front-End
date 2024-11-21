import React, { useEffect, useState } from "react";
import { getFiles } from "../api";
import Table from "../components/Table";
import HeaderSection from "../components/HeaderSection";
import Pagination from "../components/Pagination";

const ArchivedFile = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleRowSelect = (rowIndex) => {
    const updatedFiles = [...files];
    updatedFiles[rowIndex].selected = !updatedFiles[rowIndex].selected;
    setFiles(updatedFiles);
  };

  const fetchFiles = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const archivedStatus = true;
      const response = await getFiles(page, archivedStatus);
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
    <div>
      <HeaderSection title={"List Files"} />
      <Table data={files} columns={columns} onRowSelect={handleRowSelect} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ArchivedFile;
