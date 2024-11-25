import React from "react";
import HeaderSection from "../components/HeaderSection";
import Card from "../components/Card";

const Dashboard = () => {
  const cardData = [
    { title: "Dummy 3", value: 200 },
    { title: "Dummy 2", value: 200 },
    { title: "Dummy 1", value: 200 },
  ];

  return (
    <>
      <HeaderSection title={"Dashboard"} />
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cardData.map((item, index) => (
          <Card key={index} title={item.title} value={item.value} />
        ))}
      </div>
    </>
  );
};

export default Dashboard;
