import React, { useState } from "react";
import axios from "axios";
import { LessonForm, AddLessonButton } from "./LessonForm";
import { X, BookOpen, ChevronRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

interface AddCourseModalProps {
  onClose: () => void;
  onSave: (course: Omit<Course, "id" | "views">) => void;
}

const EMPTY_LESSON = { title: "", url: "", desc: "", free: true };

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  const [courseData, setCourseData] = useState({
    title: "",
    desc: "",
    status: "published" as Status,
    thumb: null as File | null,
  });

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [newLesson, setNewLesson] = useState(EMPTY_LESSON);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const addLesson = () => {
    if (!newLesson.title.trim()) return;
    setLessons((p) => [...p, { ...newLesson, id: p.length + 1 }]);
    setNewLesson(EMPTY_LESSON);
    setShowLessonForm(false);
  };

  const handleSubmit = async () => 
    {
    try {

      setLoading(true);

      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.desc);
      formData.append("status", courseData.status);

      if (courseData.thumb) {
        formData.append("thumbnail", courseData.thumb);
      }

    const token = localStorage.getItem("token");

const courseRes = await axios.post(
  "http://127.0.0.1:8001/api/admin/courses",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  }
);

      const courseId = courseRes.data.data.id;

      // رفع الدروس بعد إنشاء الكورس
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
await axios.post(
  `http://127.0.0.1:8001/api/admin/courses/${courseId}/lessons`,
  {
    title: lesson.title,
    url: lesson.url,
    desc: lesson.desc,
    is_free: lesson.free,
    order: i + 1,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);
      }

      onSave({
        title: courseData.title,
        desc: courseData.desc,
        status: courseData.status,
       thumb: courseRes.data?.data?.thumbnail ?? null,
        lessons,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    } finally {
      setLoading(false);
    }
  };

  const thumbPreview = courseData.thumb
    ? URL.createObjectURL(courseData.thumb)
    : null;




    
return (
  <div
    className="fixed inset-0 bg-black/25 backdrop-blur-md flex items-center justify-center z-50"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="w-[520px] max-h-[92vh] overflow-hidden flex flex-col
      rounded-2xl
      bg-white/80 dark:bg-gray-900/80
      backdrop-blur-2xl
      border border-white/30 dark:border-gray-700/60
      shadow-[0_30px_100px_rgba(0,0,0,0.35)]
      animate-modalEnter"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <BookOpen size={18} className="text-emerald-600" />
          </div>

          <div>
            <h2 className="text-[15px] font-semibold">Add new course</h2>
            <p className="text-[11px] text-gray-400">
              {step === 1 ? "Course information" : "Lessons management"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/course")}
          className="w-9 h-9 rounded-xl flex items-center justify-center
          hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* PROGRESS */}
      <div className="px-6 pt-4">
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
            >
              <div
                className={`h-full transition-all ${
                  step >= s ? "bg-emerald-500 w-full" : "w-0"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {step === 1 && (
          <>
            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">
                Course title
              </label>
              <input
                placeholder="e.g. React Advanced Course"
                value={courseData.title}
                onChange={(e) =>
                  setCourseData((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl text-[13px]
                bg-gray-50 dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-1 block">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="What will students learn?"
                value={courseData.desc}
                onChange={(e) =>
                  setCourseData((p) => ({ ...p, desc: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl text-[13px]
                bg-gray-50 dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-[12px] text-gray-500 mb-2 block">
                Thumbnail
              </label>

              <label className="flex items-center justify-center gap-2 w-full h-32 rounded-xl cursor-pointer
                border border-dashed border-gray-300 dark:border-gray-700
                bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    setCourseData((p) => ({
                      ...p,
                      thumb: e.target.files?.[0] || null,
                    }))
                  }
                />

                {thumbPreview ? (
                  <img
                    src={thumbPreview}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <Upload size={18} />
                    <span className="text-[12px] mt-1">
                      Upload course image
                    </span>
                  </div>
                )}
              </label>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {lessons.map((l, i) => (
              <div
                key={l.id}
                className="flex items-center gap-3 p-3 rounded-xl
                bg-gray-50 dark:bg-gray-800/60
                border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px]">
                  {i + 1}
                </div>

                <div className="flex-1">
                  <p className="text-[13px] font-medium">{l.title}</p>
                  <p className="text-[11px] text-gray-400">
                    {l.url || "No link"}
                  </p>
                </div>
              </div>
            ))}

            {showLessonForm ? (
              <LessonForm
                value={newLesson}
                onChange={setNewLesson}
                onAdd={addLesson}
                onCancel={() => setShowLessonForm(false)}
              />
            ) : (
              <AddLessonButton onClick={() => setShowLessonForm(true)} />
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={step === 1 ? onClose : () => setStep(1)}
          className="flex-1 px-4 py-2 rounded-xl border text-[13px]"
        >
          Cancel
        </button>

        <button
          onClick={
            step === 1
              ? () => {
                  if (!courseData.title.trim()) return;
                  setStep(2);
                }
              : handleSubmit
          }
          disabled={loading}
          className="flex-[2] px-4 py-2 rounded-xl bg-emerald-600 text-white text-[13px] flex items-center justify-center gap-1 disabled:opacity-60"
        >
          {step === 1 ? (
            <>
              Continue <ChevronRight size={16} />
            </>
          ) : loading ? (
            "Creating..."
          ) : (
            "Create course"
          )}
        </button>
      </div>
    </div>
  </div>
);
};

export default AddCourseModal;