import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const Navbar: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
  return localStorage.getItem("theme") === "dark";
   });
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
    className={`fixed w-[92%] left-1/2 -translate-x-1/2 top-4 z-50 rounded-2xl transition-all duration-500



${scrolled ? " scale-[0.98] bg-white/10 dark:bg-black/10 backdrop-blur-xl shadow-[0_6px_20px_rgba(0,0,0,0.08)]" : "scale-100 shadow-none"}
`}
    >
      <div className="relative flex items-center justify-between px-6 py-3">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-400">
            E-Learn
          </h1>

          {/* Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="relative w-16 h-8 flex items-center rounded-full p-1
            bg-white/10 dark:bg-black/10
            backdrop-blur-md
            border border-white/10 transition-all duration-300"
          >
            <Sun className="absolute left-2 w-4 h-4 text-yellow-400" />
            <Moon className="absolute right-2 w-4 h-4 text-gray-300" />

            <div
              className={`w-6 h-6 rounded-full shadow-md transition-all duration-300
              ${
                darkMode
                  ? "translate-x-8 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  : "translate-x-0 bg-white"
              }`}
            />
          </button>

        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-3">

          <a href="/login">
            <button className="px-4 py-2 rounded-xl text-emerald-600 dark:text-emerald-300 hover:bg-white/10 transition">
              تسجيل الدخول
            </button>
          </a>

          <a href="/register">
            <button className="px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-sm hover:scale-105">
              إنشاء حساب
            </button>
          </a>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;