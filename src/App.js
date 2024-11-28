import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Fileupload from "./pages/Fileupload";
import Files from "./pages/Files";
import ArchivedFile from "./pages/ArchivedFile";
import Faq from "./pages/Faq";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar className="w-64 bg-gray-800 text-white fixed h-screen" />
        <div className="flex-1 overflow-y-auto p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Fileupload />} />
            <Route path="/files" element={<Files />} />
            <Route path="/archive-files" element={<ArchivedFile />} />
            <Route path="/faqs" element={<Faq />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
