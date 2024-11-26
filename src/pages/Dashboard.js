import React, { useEffect, useState } from "react";
import HeaderSection from "../components/HeaderSection";
import Card from "../components/Card";
import { dashboardData } from "../api";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const cardData = [
    { title: "Total File", value: 0 },
    { title: "Max File Size", value: 0 },
    { title: "Storage", value: 0 },
  ];

  const [data, setData] = useState(cardData);

  const fetchDashboardData = async () => {
    const resp = await dashboardData();
    try {
      const { totalFiles, maxFile, totalSize } = resp.data;
      setData([
        { title: "Total File", value: totalFiles },
        {
          title: "Max File Size",
          value: `${(maxFile / 1048576).toFixed(2)} MB`,
        },
        { title: "Storage", value: `${(totalSize / 1048576).toFixed(2)} MB` },
      ]);
    } catch (e) {
      return toast.error("Error: Retrieving Data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <HeaderSection title={"Dashboard"} />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} />
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
