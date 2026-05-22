import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Plus, Video, Lock, Unlock, X, BookOpen } from "lucide-react";

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

const EMPTY_FORM = {
  title: "",
  video_url: "",
  duration: "",
  is_free: true,
};

// ─── Lesson Form ──────────────────────────────────────────────────────────────
function LessonForm({
  value,
  onChange,
  onAdd,
  onCancel,
  loading,
}: {
  value: typeof EMPTY_FORM;
  onChange: (v: typeof EMPTY_FORM) => void;
  onAdd: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 space-y-3">
      <div>
        <label className="text-[12px] text-gray-500 mb-1 block">Lesson title</label>
        <input
          placeholder="e.g. Introduction to React"
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          className="w-full px-3 py-2 rounded-xl text-[13px]
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
        />
      </div>

      <div>
        <label className="text-[12px] text-gray-500 mb-1 block">Video URL</label>
        <input
          placeholder="https://..."
          value={value.video_url}
          onChange={(e) => onChange({ ...value, video_url: e.target.value })}
          dir="ltr"
          className="w-full px-3 py-2 rounded-xl text-[13px]
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
        />
      </div>

      <div>
        <label className="text-[12px] text-gray-500 mb-1 block">Duration (seconds)</label>
        <input
          placeholder="e.g. 300"
          type="number"
          min={1}
          value={value.duration}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
          className="w-full px-3 py-2 rounded-xl text-[13px]
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={value.is_free}
            onChange={(e) => onChange({ ...value, is_free: e.target.checked })}
            className="peer sr-only"
          />
          <div className="h-5 w-9 rounded-full bg-gray-200 dark:bg-gray-700 transition peer-checked:bg-emerald-500" />
          <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition peer-checked:translate-x-4" />
        </div>
        <span className="text-[12px] text-gray-500">Free lesson</span>
      </label>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onAdd}
          disabled={!value.title.trim() || !value.video_url.trim() || !value.duration || loading}
          className="flex-[2] px-4 py-2 rounded-xl bg-emerald-600 text-white text-[13px] flex items-center justify-center gap-1 disabled:opacity-50"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Save lesson"
          )}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-[13px] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Add Button ───────────────────────────────────────────────────────────────
function AddLessonButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
        border border-dashed border-gray-300 dark:border-gray-700
        text-[13px] text-gray-400 hover:text-emerald-600 hover:border-emerald-400
        hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition"
    >
      <Plus size={15} />
      Add lesson
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [newLesson, setNewLesson] = useState(EMPTY_FORM);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<{ lessons: Lesson[] }>(`/courses/${id}/lessons`)
      .then((res) => setLessons(Array.isArray(res.data.lessons) ? res.data.lessons : []))
      .catch(() => setFetchError("Failed to load lessons."))
      .finally(() => setLoading(false));
  }, [id]);

  const addLesson = async () => {
    if (!newLesson.title.trim() || !newLesson.video_url.trim() || !newLesson.duration || !id) return;

    setSaveLoading(true);
    setSaveError("");

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
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Error saving lesson"
        : "Unexpected error";
      setSaveError(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
            <BookOpen size={18} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 dark:text-white">Course lessons</h1>
            <p className="text-[11px] text-gray-400">Course #{id}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <p className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
              {loading ? "Loading..." : `${lessons.length} lesson${lessons.length !== 1 ? "s" : ""}`}
            </p>
            {!showForm && !loading && !fetchError && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[12px] hover:bg-emerald-700 transition"
              >
                <Plus size={13} />
                Add lesson
              </button>
            )}
          </div>

          <div className="p-5 space-y-3">

            {loading && (
              <div className="flex items-center justify-center gap-2 py-10 text-[13px] text-gray-400">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                Loading lessons...
              </div>
            )}

            {fetchError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-[13px] text-red-600">
                <X size={14} /> {fetchError}
              </div>
            )}

            {!loading && !fetchError && lessons.length === 0 && !showForm && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Video size={20} className="text-gray-400" />
                </div>
                <p className="text-[13px] font-medium text-gray-600 dark:text-gray-400">No lessons yet</p>
                <p className="text-[11px] text-gray-400">Add the first lesson to this course</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-1 flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[12px] hover:bg-emerald-700 transition"
                >
                  <Plus size={13} /> Add first lesson
                </button>
              </div>
            )}

            {!loading && !fetchError && lessons.map((l, i) => (
              <div
                key={l.id}
                className="flex items-center gap-3 p-3 rounded-xl
                  bg-gray-50 dark:bg-gray-800/60
                  border border-gray-100 dark:border-gray-700"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-gray-900 dark:text-white truncate">{l.title}</p>
                  <p className="text-[11px] text-gray-400 truncate">{l.video_url || "No link"}</p>
                </div>
                {l.is_free ? (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 text-[11px]">
                    <Unlock size={11} /> Free
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 text-[11px]">
                    <Lock size={11} /> Paid
                  </div>
                )}
              </div>
            ))}

            {saveError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-[13px] text-red-600">
                <X size={14} /> {saveError}
              </div>
            )}

            {showForm && (
              <LessonForm
                value={newLesson}
                onChange={setNewLesson}
                onAdd={addLesson}
                onCancel={() => { setShowForm(false); setSaveError(""); }}
                loading={saveLoading}
              />
            )}

            {!showForm && !loading && !fetchError && lessons.length > 0 && (
              <AddLessonButton onClick={() => setShowForm(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}