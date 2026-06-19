import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";

// ─── API ──────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lesson {
  id: number;
  title: string;
  video_url: string;
  duration: number;
  order: number;
  is_free: boolean;
}

interface Exam {
  id: number;
  lesson_id: number;
  title: string;
}

const EMPTY_FORM = {
  title: "",
  video_url: "",
  duration: "",
  is_free: true,
};

// ─── Add Exam Button ──────────────────────────────────────────────────────────
function AddExamButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        mt-3 w-full flex items-center justify-center gap-2
        px-3 py-2 rounded-xl text-[12px] font-medium
        bg-blue-600 text-white
        hover:bg-blue-700 active:scale-[0.98]
        transition
        dark:bg-blue-500 dark:hover:bg-blue-600
        border border-transparent
        dark:border-blue-400/20
      "
    >
      <Plus size={14} />
      Add Exam
    </button>
  );
}

// ─── Lesson Form (مختصر هنا) ────────────────────────────────────────────────
function LessonForm({ value, onChange, onAdd, onCancel }: any) {
  return (
    <div className="p-4 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800 space-y-3">
      <input
        placeholder="Lesson title"
        value={value.title}
        onChange={(e) => onChange({ ...value, title: e.target.value })}
        className="w-full p-2 rounded-lg border dark:bg-gray-950 dark:border-gray-800"
      />

      <input
        placeholder="Video URL"
        value={value.video_url}
        onChange={(e) => onChange({ ...value, video_url: e.target.value })}
        className="w-full p-2 rounded-lg border dark:bg-gray-950 dark:border-gray-800"
      />

      <input
        type="number"
        placeholder="Duration"
        value={value.duration}
        onChange={(e) => onChange({ ...value, duration: e.target.value })}
        className="w-full p-2 rounded-lg border dark:bg-gray-950 dark:border-gray-800"
      />

      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="flex-1 bg-emerald-600 text-white py-2 rounded-lg"
        >
          Save
        </button>

        <button
          onClick={onCancel}
          className="flex-1 border dark:border-gray-700 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [examsMap, setExamsMap] = useState<Record<number, Exam[]>>({});

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState(EMPTY_FORM);

  // ─── Fetch Data ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    api
      .get<{ lessons: Lesson[] }>(`/courses/${id}/lessons`)
      .then(async (res) => {
        const lessonsData = res.data.lessons || [];
        setLessons(lessonsData);

        // fetch exams per lesson
        const examsData = await Promise.all(
          lessonsData.map((l) =>
            api
              .get<{ exams: Exam[] }>(`/lessons/${l.id}/exams`)
              .then((r) => ({ id: l.id, exams: r.data.exams }))
              .catch(() => ({ id: l.id, exams: [] }))
          )
        );

        const map: Record<number, Exam[]> = {};
        examsData.forEach((e) => {
          map[e.id] = e.exams;
        });

        setExamsMap(map);
      })
      .catch(() => setFetchError("Failed to load lessons"))
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Add Lesson ───────────────────────────────────────────────────────────
  const addLesson = async () => {
    if (!id) return;

    try {
      const res = await api.post<{ lesson: Lesson }>("/addLesson", {
        course_id: Number(id),
        title: newLesson.title,
        video_url: newLesson.video_url,
        duration: Number(newLesson.duration),
        is_free: newLesson.is_free,
        order: lessons.length + 1,
      });

      setLessons((p) => [...p, res.data.lesson]);
      setNewLesson(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="text-emerald-600" />
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              Course lessons
            </h1>
            <p className="text-xs text-gray-400">Course #{id}</p>
          </div>
        </div>

        {/* Container */}
        <div className="space-y-3">

          {loading && (
            <p className="text-gray-400 text-sm">Loading...</p>
          )}

          {fetchError && (
            <p className="text-red-500 text-sm">{fetchError}</p>
          )}

          {/* Lessons */}
          {!loading &&
            lessons.map((l) => {
              const exams = examsMap[l.id] || [];
              const hasExam = exams.length > 0;

              return (
                <div
                  key={l.id}
                  className="
                    p-4 rounded-2xl border
                    bg-white dark:bg-gray-900
                    border-gray-100 dark:border-gray-800
                    hover:shadow-md transition
                  "
                >
                  <div className="flex justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {l.title}
                      </p>
                      <p className="text-[11px] text-gray-400" dir="ltr">
                        {l.video_url}
                      </p>
                    </div>

                    <span
                      className={`
                        text-[10px] px-2 py-1 rounded-full
                        ${
                          l.is_free
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                        }
                      `}
                    >
                      {l.is_free ? "Free" : "Paid"}
                    </span>
                  </div>

                  {/* Exam Button OR Status */}
                  {!hasExam ? (
                    <AddExamButton
                      onClick={() =>
                        navigate(`/lessons/${l.id}/add-exam`)
                      }
                    />
                  ) : (
                    <p className="mt-3 text-[11px] text-emerald-600 dark:text-emerald-400">
                      ✓ Exam already exists
                    </p>
                  )}
                </div>
              );
            })}

          {/* Add Lesson */}
          {showForm && (
            <LessonForm
              value={newLesson}
              onChange={setNewLesson}
              onAdd={addLesson}
              onCancel={() => setShowForm(false)}
            />
          )}

          <button
            onClick={() => setShowForm(true)}
            className="
              w-full py-2 rounded-xl border border-dashed
              text-gray-500 dark:text-gray-400
              hover:border-emerald-500 hover:text-emerald-600
              dark:border-gray-800
            "
          >
            + Add Lesson
          </button>
        </div>
      </div>
    </div>
  );
}