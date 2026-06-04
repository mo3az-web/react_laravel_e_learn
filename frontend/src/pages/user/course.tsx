import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiPlayCircle,
  FiLock,
  FiCheckCircle,
  FiTrendingUp,
  FiVideo
} from "react-icons/fi";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type User = {
  id: number;
  name: string;
  isSubscribed: boolean;
};

type Lesson = {
  id: number;
  title: string;
  video_url: string;
  duration: number;
  is_free: boolean;
  last_second?: number | null;
  watched?: boolean;
};

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);

    if (u.hostname.includes("youtu.be")) {
      return u.pathname.slice(1);
    }

    if (u.hostname.includes("youtube.com")) {
      return u.searchParams.get("v") || u.pathname.split("/embed/")[1];
    }
  } catch {}
  return null;
}

const CoursePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  // USER
  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data.user))
      .catch(() => navigate("/login"));
  }, [navigate]);

  // LESSONS
  useEffect(() => {
    if (!id) return;

    api.get(`/courses/${id}/lessons`)
      .then(res => {
        const data: Lesson[] = (res.data.lessons || []).map((l: Lesson) => ({
          ...l,
          watched: !!l.watched, // 🔥 مهم جداً
        }));

        setLessons(data);
        setSelected(data[0] || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const canWatch = (lesson: Lesson) =>
    lesson.is_free || user?.isSubscribed;

  // SELECT LESSON
  const handleSelectLesson = async (lesson: Lesson) => {
    setSelected(lesson);

    if (lesson.watched) return;

    try {
      await api.post(`/lessons/${lesson.id}/watched`);

      setLessons(prev =>
        prev.map(l =>
          l.id === lesson.id ? { ...l, watched: true } : l
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        جاري التحميل...
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        لا توجد دروس
      </div>
    );
  }

  const startTime = selected.last_second ?? 0;

  const videoId = extractYouTubeId(selected.video_url);

  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?start=${startTime}`
    : null;

  // 🔥 FIXED PROGRESS
  const watchedCount = lessons.filter(l => l.watched).length;

  const progressPercent = lessons.length
    ? Math.round((watchedCount / lessons.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-6">

        {/* VIDEO */}
        <div className="lg:col-span-3 space-y-4">

          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">

            {!canWatch(selected) ? (
              <div className="h-[420px] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <FiLock className="text-4xl text-gray-400" />
              </div>

            ) : embedUrl ? (
              <iframe
                className="w-full h-[420px]"
                src={embedUrl}
                title="video"
                allowFullScreen
              />

            ) : (
              <div className="h-[420px] flex items-center justify-center bg-red-900">
                رابط غير صالح
              </div>
            )}

          </div>

          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FiVideo className="text-emerald-400" />
            {selected.title}
          </h2>

          <p className="text-gray-400 text-sm">
            {canWatch(selected)
              ? "ابدأ المشاهدة"
              : "هذا الدرس للمشتركين فقط"}
          </p>

        </div>

        {/* SIDEBAR */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">

          <h3 className="font-bold mb-4 flex items-center gap-2">
            <FiPlayCircle className="text-emerald-400" />
            المحتوى
          </h3>

          {/* PROGRESS */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-1">
                <FiTrendingUp /> التقدم
              </span>
              <span className="text-emerald-400">
                {progressPercent}%
              </span>
            </div>

            <div className="h-2 bg-gray-800 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* LESSONS */}
          <div className="space-y-2">
            {lessons.map((lesson) => {
              const locked = !canWatch(lesson);
              const active = selected?.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  onClick={() => !locked && handleSelectLesson(lesson)}
                  className={`p-3 rounded-xl flex justify-between items-center cursor-pointer
                    ${active ? "bg-emerald-500/20" : "hover:bg-white/10"}
                    ${locked ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {locked ? (
                      <FiLock />
                    ) : lesson.watched ? (
                      <FiCheckCircle className="text-emerald-400" />
                    ) : (
                      <FiPlayCircle />
                    )}

                    <span className="truncate">{lesson.title}</span>
                  </div>

                  {lesson.is_free && (
                    <span className="text-xs text-emerald-400">
                      مجاني
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CoursePage;