import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import AdminNavbar from "./pages/admin/Sidebar";
import LandingPage from "./pages/landingPage";
import Register from "./pages/register";
import Login from "./pages/Login";
import Profile from "./pages/user/profile";
import Home from "./pages/user/home";
import AddCourseModal from "./pages/admin/addCourseModal";
import CourseDetail from "./pages/admin/courseDetail";
import DashboardView from "./pages/admin/Dashboard";
import CoursePage from "./pages/user/course";
import ProtectedRoute from "./protectedRoutes";
import PricingPage from "./pages/user/Subscription";
import CheckoutPage from "./pages/user/CheckOut";
import CoursesView from "./pages/admin/CoursesView";

// NAVBARS
import Navbar from "./elements/navbar";
import UserNavbar from "./elements/navbarUser";

// ✅ Navbar Controller — operator precedence مصلوح
const NavbarController = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const path = location.pathname;

  // ❌ مفيش navbar على صفحة login
  if (path === "/login") return null;

  // 👤 user navbar
  if (
    role === "user" &&
    (path === "/home" ||
      path === "/profile" ||
      path === "/course" ||
      path === "/pricing")
  )
    return <UserNavbar />;

  // 🌐 public navbar
  if (path === "/") return <Navbar />;

  // 🔧 admin navbar
  if (
    role === "admin" &&
    (path === "/admin" || path === "/admin/course" || path.startsWith("/admin/course/"))
  )
    return <AdminNavbar />;

  return null;
};

function App() {
  // ✅ منع right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // ✅ منع DevTools shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "U")
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <BrowserRouter>
      {/* NAVBAR DYNAMIC */}
      <NavbarController />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER */}
        <Route
          path="/home"
          element={
            <ProtectedRoute role="user">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="user">
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course"
          element={
            <ProtectedRoute role="user">
              <CoursePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pricing"
          element={
            <ProtectedRoute role="user">
              <PricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/:planId"
          element={
            <ProtectedRoute role="user">
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardView courses={[]} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/course"
          element={
            <ProtectedRoute role="admin">
              <CoursesView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courseCreate"
          element={
            <ProtectedRoute role="admin">
              <AddCourseModal
                onClose={() => {}}
                onSave={(data) => console.log(data)}
              />
            </ProtectedRoute>
          }
        />

        {/* ✅ Course Detail — مش بيبعت course كـ prop، بياخده من الـ API */}
        <Route
          path="/admin/course/:id"
          element={
            <ProtectedRoute role="admin">
              <CourseDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;