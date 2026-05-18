import { BrowserRouter, Routes, Route, useLocation , } from "react-router-dom";
import { useEffect } from "react";

import AdminNavbar from "./pages/admin/Sidebar";
import LandingPage from "./pages/landingPage";
import Register from "./pages/register";
import Login from "./pages/Login";
import Profile from "./pages/user/profile";
import Home from "./pages/user/home";
import AddCourseModal from "./pages/admin/addCourseModal";
import AdminDashboard from "./pages/admin/Dashboard";
import DashboardView from "./pages/admin/Dashboard";
import CoursePage from "./pages/user/course";
import ProtectedRoute from "./protectedRoutes";
import PricingPage from "./pages/user/Subscription";
import CheckoutPage from "./pages/user/CheckOut";
import CoursesView from "./pages/admin/CoursesView";
import CourseDetail from "./pages/admin/courseDetail";
// NAVBARS
import Navbar from "./elements/navbar";
import UserNavbar from "./elements/navbarUser";

// 🔥 Navbar Controller
const NavbarController = () => {
  const location = useLocation();

  const role = localStorage.getItem("role");

  // ❌ no navbar on login page
  if (location.pathname === "/login") return null;
  // 👤 user navbar
  if (role === "user" && location.pathname ==='/home'   || location.pathname === '/profile' || location.pathname === '/course' || location.pathname === '/pricing'  ) return <UserNavbar />;
  // 🌐 public navbar
   if(location.pathname ==="/") return <Navbar />;

   if( role === "admin" && location.pathname ==='/admin' || location.pathname ==='/admin/course') return <AdminNavbar/>;
};

function App() {

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
        <Route path="/register" element={<Register/>} />
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
              <PricingPage/>
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
          path="admin/course"
          element={
            <ProtectedRoute role="admin">
           <CoursesView/>
            </ProtectedRoute>
          }
        />

           <Route
          path="admin/courseCreate"
          element={
            <ProtectedRoute role="admin">
            <AddCourseModal
        onClose={() => {}}
        onSave={(data) => {
          console.log(data);
        }}
      />
            </ProtectedRoute>
          }
        />
      </Routes>

    </BrowserRouter>
  );
}

export default App;

