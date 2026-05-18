import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8001/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ───────── Types ─────────
type Course = {
  id: number;
  title: string;
  description: string;
  image: string;
};

// ───────── Component ─────────
const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  // ───────── Fetch Courses ─────────
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.post("/getCourses");
        setCourses(res.data?.data?.data ?? []);
      } catch (err) {
        console.error(err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // ───────── Fetch User ─────────
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const res = await api.get("/me");
        setUser(res.data.user);
      } catch {
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // ───────── Search debounce ─────────
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ───────── Derived data ─────────
  const filteredCourses = useMemo(() => {
    return courses.filter((c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const heroCourses = useMemo(() => {
    return courses.slice(-3);
  }, [courses]);

  const safeHeroCourses =
    heroCourses.length > 0 ? heroCourses : courses.slice(0, 1);

  const activeCourse = safeHeroCourses[index % safeHeroCourses.length];

  const nextSlide = () => {
    setIndex((p) => (p + 1) % safeHeroCourses.length);
  };

  const prevSlide = () => {
    setIndex((p) => (p - 1 + safeHeroCourses.length) % safeHeroCourses.length);
  };

  useEffect(() => {
    if (!safeHeroCourses.length) return;

    const t = setInterval(nextSlide, 5000);
    return () => clearInterval(t);
  }, [safeHeroCourses.length]);

  const watchCourse = () => navigate("/course");

  // ───────── Loading guard ─────────
  if (loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  return (
    <div
      dir="rtl"
      className={`
        min-h-screen font-[Tajawal,sans-serif]
        bg-slate-50 dark:bg-[#0f1117]
        text-slate-800 dark:text-slate-100
        transition-colors duration-300
      `}
    >
      {/* ─── Google Font ─── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');`}</style>

      {/* ═══════════════ BODY ═══════════════ */}
      <main className="max-w-auto mx-auto px-4 sm:px-6 py-8 space-y-10">

        {/* ─── Welcome ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="mt-15">
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">مرحباً بعودتك 👋</p>
            <h1 className="text-3xl font-extrabold">
              {loadingUser ? (
                <span className="inline-block w-44 h-8 rounded-lg bg-slate-200 dark:bg-white/10 animate-pulse" />
              ) : (
                <span>
                  أهلاً{" "}
                  <span className="text-emerald-500 dark:text-emerald-400">{user?.name}</span>
                </span>
              )}
            </h1>
          </div>

          {/* Stats */}
       
        </motion.div>

        {/* ─── Hero Carousel ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/20 dark:shadow-black/50 group"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCourse.image}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={activeCourse.image}
                alt={activeCourse.title}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Content overlay */}
          <div className="absolute bottom-0 right-0 p-6 text-white z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCourse.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                
                <h2 className="text-2xl font-extrabold drop-shadow">{activeCourse.title}</h2>
                <p className="text-sm text-white/70 mt-1">{activeCourse.description}</p>
                <button
                  onClick={watchCourse}
                  className="mt-3 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-emerald-500/40 transition"
                >
                  <FaPlay className="text-xs" />
                  ابدأ الآن
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav arrows */}
          {[
            { fn: prevSlide, icon: <FaChevronRight />, side: "right-4" },
            { fn: nextSlide, icon: <FaChevronLeft />, side: "left-4" },
          ].map(({ fn, icon, side }, i) => (
            <button
              key={i}
              onClick={fn}
              className={`absolute ${side} top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition`}
            >
              {icon}
            </button>
          ))}

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroCourses.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* ─── Search ─── */}


        {/* ─── Categories ─── */}
  
     
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex gap-2 overflow-x-auto pb-1 no-scrollbar"
        >
        
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative"
        >
          <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث عن دورة..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="
              w-full py-3.5 pr-11 pl-4 rounded-2xl
              bg-white dark:bg-white/5
              border border-slate-200 dark:border-white/10
              text-slate-700 dark:text-slate-200
              placeholder-slate-400 dark:placeholder-slate-600
              focus:outline-none focus:ring-2 focus:ring-emerald-400/60
              shadow-sm transition text-sm
            "
          />
        </motion.div>
        {/* ─── Course Grid ─── */}
        <section>
          <h2 className="text-xl font-extrabold mb-5 text-slate-700 dark:text-slate-200">
            دوراتك
          </h2>

          {filteredCourses.length === 0 ? (
            <div className="text-center py-20 text-slate-400 dark:text-slate-600">
              <FaSearch className="mx-auto text-3xl mb-3 opacity-30" />
              <p className="text-sm">لا توجد نتائج</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCourses.map((course, i) => (
                <CourseCard key={i} course={course} onWatch={watchCourse} />
              ))}
            </div>
          )}
        </section>
 
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// ─────────────────────────────── Course Card ───────────────────────────────
const CourseCard: React.FC<{ course: Course; onWatch: () => void }> = ({ course, onWatch }) => {


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="
        group rounded-3xl overflow-hidden
        bg-white dark:bg-[#161b27]
        border border-slate-100 dark:border-white/5
        shadow-sm hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/40
        transition-all duration-300
      "
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Category badge */}
      

        {/* Rating */}
    
      </div>

      {/* Body */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{course.description}</p>
        </div>


        {/* Progress */}
        
      </div>
    </motion.div>
  );
};

export default Home;