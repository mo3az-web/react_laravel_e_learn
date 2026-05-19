import React, { useState, useEffect } from "react";
import { StatusBadge, ThumbnailPlaceholder } from "./components/ui";
import { LessonForm, AddLessonButton } from "./LessonForm";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const api = axios.create({ baseURL: "http://localhost:8001/api" });

type Status = "published" | "draft";

interface Lesson {
  id: number;
  title: string;
  url: string;
  desc: string;
  free: boolean;
}

interface Course {
  id: number;
  title: string;
  desc: string;
  status: Status;
  thumb: string;
  views: number;
  lessons: Lesson[];
}

interface CourseDetailProps {
  onBack?: () => void;
  onUpdate?: (updated: Course) => void;
}

const EMPTY_LESSON = { title: "", url: "", desc: "", free: true };

const CourseDetail: React.FC<CourseDetailProps> = ({ onUpdate }) => {
  // ✅ useParams جوّا الكومبوننت
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState(EMPTY_LESSON);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loadingLesson, setLoadingLesson] = useState(true);

  // ───────── Fetch Course ─────────
  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      try {
const res = await api.get(`/courses/${id}`);
setCourse(res.data ?? null);
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setCourse(null);
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourse();
  }, [id]);

  // ───────── Fetch Lessons ─────────
useEffect(() => {
  if (!id) return;

  const fetchLessons = async () => {
    try {
      const res = await api.get(`/courses/${id}/lessons`);
      setLessons(res.data?.lessons ?? []);
    } catch (err) {
      console.error("Failed to fetch lessons:", err);
      setLessons([]);
    } finally {
      setLoadingLesson(false);
    }
  };

  fetchLessons();
}, [id]);

  // ───────── Toggle Free/Paid ─────────
  const toggleAccess = async (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    try {
      await api.patch(`/courses/${id}/lessons/${lessonId}`, {
        free: !lesson.free,
      });
      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, free: !l.free } : l))
      );
    } catch (err) {
      console.error("Failed to update lesson:", err);
    }
  };

  // ───────── Add Lesson ─────────
  const addLesson = async () => {
    if (!newLesson.title.trim()) return;
    try {
      const res = await api.post(`/courses/${id}/lessons`, newLesson);
      setLessons((prev) => [...prev, res.data.data]);
      setNewLesson(EMPTY_LESSON);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add lesson:", err);
    }
  };

  const handleBack = () => navigate("/admin/course");

  // ───────── Loading / Error States ─────────
  if (loadingCourse) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[13px] text-gray-400">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-[13px] text-gray-400">Course not found.</p>
        <button
          onClick={handleBack}
          className="text-[12px] text-emerald-600 hover:underline"
        >
          Back to courses
        </button>
      </div>
    );
  }

  const freeLessons = lessons.filter((l) => l.free).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 w-fit"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <polyline points="10,3 5,8 10,13" />
        </svg>
        Back to courses
      </button>

      {/* Course header card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex">
        <div className="w-[200px] h-[130px] flex-shrink-0">
          {course.thumb ? (
            <img
              src={course.thumb}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <ThumbnailPlaceholder className="w-full h-full" />
          )}
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2 className="text-[15px] font-medium">{course.title}</h2>
            <StatusBadge status={course.status} />
          </div>
          <p className="text-[12px] text-gray-400 mb-3 line-clamp-2">
            {course.desc || "No description"}
          </p>
          <div className="flex gap-5">
            {[
              { val: course.views?.toLocaleString() ?? 0, lbl: "Views" },
              { val: lessons.length, lbl: "Lessons" },
              { val: freeLessons, lbl: "Free" },
              { val: lessons.length - freeLessons, lbl: "Paid" },
            ].map((s) => (
              <div key={s.lbl}>
                <p className="text-[16px] font-medium">{s.val}</p>
                <p className="text-[11px] text-gray-400">{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons card */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[13px] font-medium">
            Lessons ({loadingLesson ? "..." : lessons.length})
          </h3>
        </div>

        {loadingLesson ? (
          <p className="text-[12px] text-gray-400 text-center py-4">
            Loading lessons...
          </p>
        ) : lessons.length === 0 ? (
          <p className="text-[12px] text-gray-400 text-center py-4">
            No lessons yet.
          </p>
        ) : (
          <div className="space-y-2">
            {lessons.map((l, i) => (
              <div
                key={l.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px]">{l.title}</p>
                  <p className="text-[11px] text-gray-400 truncate">
                    {l.url || "No link"}
                  </p>
                </div>
                <button
                  onClick={() => toggleAccess(l.id)}
                  className={`text-[10px] px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                    l.free
                      ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                  }`}
                >
                  {l.free ? "Free" : "Paid"}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          {showForm ? (
            <LessonForm
              value={newLesson}
              onChange={setNewLesson}
              onAdd={addLesson}
              onCancel={() => setShowForm(false)}
              submitLabel="Add lesson"
            />
          ) : (
            <AddLessonButton
              onClick={() => {
                setNewLesson(EMPTY_LESSON);
                setShowForm(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;