import React, { useEffect, useState } from "react";
import { NavIcon } from "./components/ui";
import { Sun, Moon } from "lucide-react";
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

  // 🌙 Dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // 🚪 Logout
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

  // 🎯 active route
  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + "/");

  return (
    <nav className="w-full bg-white dark:bg-gray-900 border-b px-6 py-3 flex items-center justify-between">

      {/* Logo */}
      <div
        onClick={() => navigate("/admin")}
        className="text-emerald-600 font-semibold cursor-pointer"
      >
        EduAdmin
      </div>

      {/* Links */}
      <div className="flex items-center gap-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`text-[13px] px-3 py-1.5 rounded-lg transition
              ${
                isActive(item.path)
                  ? "bg-emerald-100 text-emerald-700 font-medium"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Dark mode */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-red-500 text-[13px]"
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default AdminNavbar;