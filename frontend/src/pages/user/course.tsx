import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiPlayCircle,
  FiCheckCircle,
  FiTrendingUp,
  FiBookOpen,
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiMaximize,
  FiRotateCcw,
  FiSkipBack,
  FiSkipForward,
  FiLock,
} from "react-icons/fi";

// ── Types ────────────────────────────────────────────────────
type User = {
  id: number;
  name: string;
  isSubscribed: boolean;
  token: string;
};

type Video = {
  id: number;
  title: string;
  duration: string;
  url: string;
  isFree: boolean;
};

// ── Fake user (استبدل بـ auth context حقيقي) ────────────────
export const fakeUser: User = {
  id: 1,
  name: "معاذ",
  isSubscribed: false, // غيرها لـ true للتجربة
  token: "fake-jwt-token",
};

// ── Lock Screen Component ────────────────────────────────────
const LockScreen: React.FC<{ isLoggedIn: boolean; courseId: string }> = ({
  isLoggedIn,
  courseId,
}) => (
  <div
    className="relative w-full flex items-center justify-center"
    style={{
      aspectRatio: "16/9",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0f3460 100%)",
    }}
  >
    {/* subtle grid pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.1) 40px,rgba(255,255,255,.1) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.1) 40px,rgba(255,255,255,.1) 41px)",
      }}
    />

    <div className="relative text-center text-white px-8 max-w-sm">
      {/* Lock icon */}
      <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-5">
        <FiLock size={26} />
      </div>

      <h3 className="text-xl font-bold mb-2">هذا الدرس مقفل 🔒</h3>
      <p className="text-white/60 text-sm mb-6 leading-relaxed">
        {isLoggedIn
          ? "اشترك في الكورس للوصول لجميع الدروس"
          : "سجّل دخولك أو اشترك في الكورس للمتابعة"}
      </p>

      <button
        onClick={() => (window.location.href = `/pricing`)}
        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 px-6 rounded-xl transition-colors mb-3"
      >
        اشترك الآن
      </button>

      {!isLoggedIn && (
        <button
          onClick={() => (window.location.href = "/login")}
          className="w-full bg-white/10 hover:bg-white/20 text-white/70 text-sm py-2 px-6 rounded-xl transition-colors border border-white/10"
        >
          تسجيل الدخول
        </button>
      )}
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────
const CoursePage: React.FC = () => {
  const user = fakeUser;
const course = {
  id: "sharia-course-01",
  title: "كورس الشريعة الإسلامية من الصفر",
  description: "تعلم أساسيات الشريعة الإسلامية بأسلوب مبسط ومنظم",
  videos: [
    {
      id: 1,
      title: "أركان الإسلام - شرح مبسط",
      duration: "13:21",
      url: "https://www.youtube.com/watch?v=NCehWrBx1sA",
      isFree: true,
    },
    {
      id: 2,
      title: "شرح أركان الإسلام بالتفصيل",
      duration: "10:30",
      url: "https://www.youtube.com/watch?v=J5nQ6Uxs6Cs",
      isFree: true,
    },
    {
      id: 3,
      title: "شرح أركان الإسلام - عثمان الخميس",
      duration: "15:00",
      url: "https://www.youtube.com/watch?v=RVcYngFyU3I",
      isFree: false,
    },
    {
      id: 4,
      title: "الإسلام والإيمان والإحسان",
      duration: "20:00",
      url: "https://www.youtube.com/watch?v=4XoZ10jz7Pc",
      isFree: false,
    },
    {
      id: 5,
      title: "ما هي أركان الإسلام للأطفال",
      duration: "8:00",
      url: "https://www.youtube.com/watch?v=qq9_fBxguzo",
      isFree: false,
    },
  ] as Video[],
};

  // ── State ──────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video>(course.videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem("completedVideos");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ── Access control ─────────────────────────────────────────
  // يقدر يشوف لو: الفيديو مجاني أو المستخدم مشترك
  const canWatch = (video: Video) => video.isFree || user.isSubscribed;
  const currentCanWatch = canWatch(selectedVideo);

  // ── Refs ───────────────────────────────────────────────────
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerWrapRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simTimeRef = useRef(0);
  const simDurRef = useRef(600);

  // ── Derived ────────────────────────────────────────────────
  const total = course.videos.length;
  const progressPercent = Math.round((completed.length / total) * 100);

  // ── Helpers ────────────────────────────────────────────────
  const getEmbedUrl = (url: string) => {
    const id = url.split("v=")[1]?.split("&")[0];
    return (
      `https://www.youtube.com/embed/${id}` +
      `?enablejsapi=1&rel=0&modestbranding=1&controls=0` +
      `&disablekb=1&iv_load_policy=3&showinfo=0&fs=0&playsinline=1` +
      `&origin=${encodeURIComponent(window.location.origin)}`
    );
  };

  const sendCommand = useCallback((func: string, args: unknown[] = []) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func, args }),
        "*"
      );
    } catch (_) {}
  }, []);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const startProgressSim = useCallback((dur: number) => {
    clearInterval(progressTimerRef.current!);
    simDurRef.current = dur;
    progressTimerRef.current = setInterval(() => {
      simTimeRef.current = Math.min(simTimeRef.current + 1, simDurRef.current);
      setCurrentTime(simTimeRef.current);
      setProgress((simTimeRef.current / simDurRef.current) * 100);
      if (simTimeRef.current >= simDurRef.current) {
        clearInterval(progressTimerRef.current!);
        setIsPlaying(false);
      }
    }, 1000);
  }, []);

  const stopProgressSim = useCallback(() => {
    clearInterval(progressTimerRef.current!);
  }, []);

  const parseDuration = (dur: string): number => {
    const [m, s] = dur.split(":").map(Number);
    return (m || 0) * 60 + (s || 0);
  };

  const formatTime = (secs: number): string => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // ── Player actions ─────────────────────────────────────────
  const handlePlay = () => {
    if (!hasStarted) setHasStarted(true);
    sendCommand("playVideo");
    setIsPlaying(true);
    const dur = parseDuration(selectedVideo.duration);
    setDuration(dur);
    startProgressSim(dur);
    resetControlsTimer();
  };

  const handlePause = () => {
    sendCommand("pauseVideo");
    setIsPlaying(false);
    stopProgressSim();
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
  };

  const togglePlay = () => (isPlaying ? handlePause() : handlePlay());

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const ratio = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
    const newTime = Math.round(ratio * simDurRef.current);
    simTimeRef.current = newTime;
    setCurrentTime(newTime);
    setProgress(ratio * 100);
    sendCommand("seekTo", [newTime, true]);
  };

  const skipBack = () => {
    const newTime = Math.max(0, simTimeRef.current - 10);
    simTimeRef.current = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / simDurRef.current) * 100);
    sendCommand("seekTo", [newTime, true]);
  };

  const skipForward = () => {
    const newTime = Math.min(simDurRef.current, simTimeRef.current + 10);
    simTimeRef.current = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / simDurRef.current) * 100);
    sendCommand("seekTo", [newTime, true]);
  };

  const handleVolumeChange = (val: number) => {
    setVolume(val);
    setIsMuted(val === 0);
    sendCommand("setVolume", [val]);
  };

  const toggleMute = () => {
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", [volume]);
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  const goFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        playerWrapRef.current?.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (_) {}
  };

  const handleSelectVideo = (video: Video) => {
    stopProgressSim();
    simTimeRef.current = 0;
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
    setHasStarted(false);
    setShowControls(true);
    setSelectedVideo(video);

    // mark as completed only if user can watch it
    if (canWatch(video)) {
      setCompleted((prev) => {
        if (prev.includes(video.id)) return prev;
        const updated = [...prev, video.id];
        try {
          localStorage.setItem("completedVideos", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    }
  };

  // ── Effects ────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(() => {
    return () => {
      clearInterval(progressTimerRef.current!);
      clearTimeout(controlsTimerRef.current!);
    };
  }, []);

  useEffect(() => {
    if (hasStarted) sendCommand("setVolume", [isMuted ? 0 : volume]);
  }, [selectedVideo, hasStarted, sendCommand, isMuted, volume]);

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-28 px-6 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center gap-3">
        <FiBookOpen className="text-emerald-500 text-2xl" />
        <div>
          <h1 className="text-3xl font-bold text-emerald-500">{course.title}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{course.description}</p>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Video section */}
        <div className="lg:col-span-3">
          <div
            ref={playerWrapRef}
            className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 group"
            onMouseMove={resetControlsTimer}
            onMouseLeave={() => isPlaying && setShowControls(false)}
          >
            {currentCanWatch ? (
              // ── Player ──────────────────────────────────────
              <>
                {/* "Current lesson" badge */}
                <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 pointer-events-none">
                  الدرس الحالي
                </div>

                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/9", overflow: "hidden" }}
                >
                  <iframe
                    key={selectedVideo.id}
                    ref={iframeRef}
                    src={getEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    style={{
                      position: "absolute",
                      top: "-60px",
                      left: "-2px",
                      width: "calc(100% + 4px)",
                      height: "calc(100% + 120px)",
                      border: "none",
                      pointerEvents: hasStarted ? "auto" : "none",
                    }}
                  />

                  {/* Big play overlay */}
                  {!hasStarted && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
                      onClick={handlePlay}
                    >
                      <div className="w-20 h-20 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg hover:bg-emerald-400 transition-colors duration-200">
                        <FiPlay className="text-white text-4xl ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Controls bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 z-20 transition-opacity duration-300 ${
                    showControls || !isPlaying ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                    padding: "32px 16px 14px",
                  }}
                >
                  {/* Progress bar */}
                  <div
                    className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-3 relative group/prog"
                    onClick={handleSeek}
                  >
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300 group-hover/prog:bg-emerald-400"
                      style={{ width: `${progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow opacity-0 group-hover/prog:opacity-100 transition-opacity pointer-events-none"
                      style={{ left: `calc(${progress}% - 6px)` }}
                    />
                  </div>

                  {/* Buttons row */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={skipBack}
                      className="text-white/70 hover:text-white transition-colors"
                      title="رجوع 10 ثواني"
                    >
                      <FiSkipBack size={18} />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white transition-colors shadow"
                    >
                      {isPlaying ? (
                        <FiPause size={16} />
                      ) : (
                        <FiPlay size={16} className="ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={skipForward}
                      className="text-white/70 hover:text-white transition-colors"
                      title="تقديم 10 ثواني"
                    >
                      <FiSkipForward size={18} />
                    </button>

                    <button
                      onClick={() => {
                        simTimeRef.current = 0;
                        setCurrentTime(0);
                        setProgress(0);
                        sendCommand("seekTo", [0, true]);
                        handlePlay();
                      }}
                      className="text-white/70 hover:text-white transition-colors"
                      title="إعادة"
                    >
                      <FiRotateCcw size={17} />
                    </button>

                    <button
                      onClick={toggleMute}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <FiVolumeX size={18} />
                      ) : (
                        <FiVolume2 size={18} />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={isMuted ? 0 : volume}
                      onChange={(e) => handleVolumeChange(Number(e.target.value))}
                      className="w-20 accent-emerald-500 cursor-pointer"
                    />

                    <span className="text-white/60 text-xs tabular-nums ml-1">
                      {formatTime(currentTime)} /{" "}
                      {duration ? formatTime(duration) : "--:--"}
                    </span>

                    <span className="ml-auto text-white/50 border border-white/20 rounded text-xs px-1.5 py-0.5">
                      HD
                    </span>

                    <button
                      onClick={goFullscreen}
                      className="text-white/70 hover:text-white transition-colors"
                      title="ملء الشاشة"
                    >
                      <FiMaximize size={18} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // ── Lock Screen ──────────────────────────────────
              <LockScreen isLoggedIn={!!user.token} courseId={course.id} />
            )}
          </div>

          {/* Video title */}
          <div className="mt-5 px-1">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {selectedVideo.title}
              {!currentCanWatch && (
                <FiLock className="text-gray-400 text-lg" />
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {currentCanWatch
                ? "شاهد الدرس وطبق الخطوات عمليًا"
                : "هذا الدرس متاح للمشتركين فقط"}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-lg">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FiPlayCircle />
              محتوى الكورس
            </h3>

            {/* Progress */}
            <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center text-sm mb-2">
                <div className="flex items-center gap-1">
                  <FiTrendingUp />
                  <span>التقدم</span>
                </div>
                <span className="text-emerald-500 font-semibold">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {completed.length} / {total} دروس مكتملة
              </p>
            </div>

            {/* Video list */}
            <div className="space-y-2 max-h-[500px] overflow-auto pr-1">
              {course.videos.map((video) => {
                const active = selectedVideo.id === video.id;
                const isDone = completed.includes(video.id);
                const videoLocked = !canWatch(video);

                return (
                  <div
                    key={video.id}
                    onClick={() => handleSelectVideo(video)}
                    className={`rounded-xl p-3 transition-all duration-300 border flex items-center justify-between
                      ${videoLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                      ${
                        active
                          ? "bg-emerald-500/20 border-emerald-500 shadow-md"
                          : "hover:bg-white/10 border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {videoLocked ? (
                        <FiLock className="text-gray-400 flex-shrink-0" size={15} />
                      ) : isDone ? (
                        <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                      ) : (
                        <FiPlayCircle className="text-gray-400 flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium truncate">{video.title}</p>
                      {video.isFree && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          مجاني
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {video.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;