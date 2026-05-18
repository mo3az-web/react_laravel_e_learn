import React, { useEffect, useState } from "react";
import { Sun, Moon, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/admin" },
  { id: "courses", label: "Courses", path: "/admin/course" },
  { id: "students", label: "Students", path: "/admin/students" },
  { id: "stats", label: "Analytics", path: "/admin/stats" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8001/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/admin");

  return (
    <nav className="sticky top-0 z-50 w-full 
      bg-white/80 dark:bg-gray-900/80 
      backdrop-blur-md 
      border-b border-gray-200 dark:border-gray-800 
      px-6 py-3 flex items-center justify-between">

      {/* Logo */}
      <div
        onClick={() => navigate("/admin")}
        className="text-emerald-600 font-bold cursor-pointer text-lg"
      >
        EduAdmin
      </div>

      {/* Links */}
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`text-[13px] px-3 py-1.5 rounded-lg transition-all duration-200
              ${
                isActive(item.path)
                  ? "bg-white dark:bg-gray-900 text-emerald-600 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Add Course Button */}
        <button
          onClick={() => navigate("/admin/courseCreate")}
          className="flex items-center gap-1 px-3 py-1.5 
          bg-emerald-600 hover:bg-emerald-700 
          text-white text-[13px] rounded-lg 
          transition"
        >
          <Plus size={16} />
          Add Course
        </button>

        {/* Dark mode */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? (
            <Moon size={18} className="text-gray-200" />
          ) : (
            <Sun size={18} className="text-gray-700" />
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-500 text-[13px] hover:text-red-600 transition"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default AdminNavbar;