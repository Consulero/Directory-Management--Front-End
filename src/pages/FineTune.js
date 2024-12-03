import React, { useEffect, useState } from "react";
import { fineTune, getTrainingFile, refreshFinetuneSatus } from "../api";
import HeaderSection from "../components/HeaderSection";
import Pagination from "../components/Pagination";
import { toast, ToastContainer } from "react-toastify";
import { RefreshIcon } from "../icons";

const FineTune = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [finetuneLoading, setFinetuneLoading] = useState(false);

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
      const response = await getTrainingFile(page);
      setFiles(response.data?.data || []);
      setTotalPages(response.data?.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (fileId, rowId, status) => {
    try {
      const result = await refreshFinetuneSatus(fileId, rowId, status);
      console.log(result);
      if (result.status === 200) {
        toast.success(`${result.data.message}`);
        window.location.reload();
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to refresh");
    }
  };

  const handleFinetune = async () => {
    try {
      setFinetuneLoading(true);
      const data = { id: selectedRows[0] };

      const result = await fineTune(data);
      if (result.status === 200) {
        setSelectedRows([]);
        toast.success(result.data.message);
        window.location.reload();
      } else {
        return toast.error(result.data.message);
      }
    } catch (err) {
      toast.error("Failed to start finetunning");
    } finally {
      setFinetuneLoading(false);
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

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <HeaderSection title={"Fine-Tunning"} />
        <div className="ml-auto flex space-x-2">
          <button
            disabled={finetuneLoading || selectedRows.length !== 1}
            className={`px-3 py-1 text-sm rounded-md 
        ${
          finetuneLoading || selectedRows.length !== 1
            ? "bg-gray-500 text-white cursor-not-allowed"
            : "bg-[#454444] text-white hover:scale-110 transform transition-all duration-200"
        }`}
            onClick={handleFinetune}
          >
            Start Fine Tuning
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="overflow-auto" style={{ maxHeight: "420px" }}>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th
                  key={1}
                  className="border-b bg-gray-200 p-2 text-sm text-left text-semibold"
                  style={{ width: "20%" }}
                >
                  File Name
                </th>
                <th
                  key={2}
                  className="border-b bg-gray-200 p-2 text-sm text-left text-semibold"
                  style={{ width: "15%" }}
                >
                  File Status
                </th>
                <th
                  key={4}
                  className="border-b bg-gray-200 p-2 text-sm text-left text-semibold"
                  style={{ width: "25%" }}
                >
                  Finetune Model
                </th>
                <th
                  key={0}
                  className="border-b bg-gray-200 p-2 text-sm text-left text-semibold"
                  style={{ width: "25%" }}
                >
                  Finetune Base Model
                </th>
                <th
                  key={3}
                  className="border-b bg-gray-200 p-2 text-sm text-left text-semibold"
                  style={{ width: "15%" }}
                >
                  Finetune Status
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={row.selected ? "bg-green-100" : ""}
                  onClick={() => handleRowSelect(rowIndex)}
                >
                  <td className="border-b border-gray-300 p-1 text-sm pl-2">
                    {row.file_name}
                  </td>
                  <td className="border-b border-gray-300 p-1 text-sm pl-2">
                    {row.file_status || "NA"}{" "}
                    {row.file_status && row.file_status !== "processed" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRefresh(row.file_id, row.id, "FILE_STATUS");
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                      >
                        <RefreshIcon className="w-4 h-4" />
                      </button>
                    )}
                  </td>

                  <td className="border-b border-gray-300 p-1 text-sm pl-2">
                    {row.finetune_model || "NA"}
                  </td>
                  <td className="border-b border-gray-300 p-1 text-sm pl-2">
                    {row.finetune_base_model || "NA"}
                  </td>
                  <td className="border-b border-gray-300 p-1 text-sm pl-2">
                    {row.finetune_status || "NA"}{" "}
                    {row.finetune_status &&
                      row.finetune_status !== "processed" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRefresh(
                              row.finetune_model_id,
                              row.id,
                              "FINETUNE_STATUS"
                            );
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <RefreshIcon className="w-4 h-4" />
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <ToastContainer />
    </>
  );
};

export default FineTune;
