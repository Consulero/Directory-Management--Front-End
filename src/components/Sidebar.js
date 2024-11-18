import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, UploadIcon, FilesIcon } from "../icons";

const Sidebar = () => {
  return (
    <div className="w-52 h-screen bg-[#f6f5f5] text-black p-5 md:w-64">
      <h3 className="text-xl font-semibold mb-4">File Manager</h3>
      <ul className="space-y-3">
        <li>
          <Link className="flex items-center hover:text-blue-400" to="/">
            <HomeIcon className="w-5 h-5 mr-2" />
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="flex items-center hover:text-blue-400" to="/upload">
            <UploadIcon className="w-5 h-5 mr-2" />
            Upload
          </Link>
        </li>
        <li>
          <Link className="flex items-center hover:text-blue-400" to="/files">
            <FilesIcon className="w-5 h-5 mr-2" />
            Files
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
