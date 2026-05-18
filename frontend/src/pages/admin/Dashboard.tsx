import React from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge, ProgressBar } from "./components/ui";
export type Status = "published" | "draft";
export type View = "dashboard" | "courses" | "students" | "stats";

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
interface DashboardViewProps {
  courses: Course[];

}

const DashboardView: React.FC<DashboardViewProps> = ({ courses}) => {
  const totalViews = courses.reduce((a, c) => a + c.views, 0);
  const totalLessons = courses.reduce((a, c) => a + c.lessons.length, 0);
  const navigate = useNavigate();
  const statCards = [
    { label: "Students",    value: "1,250",                 badge: "+12%",              up: true, bg: "bg-emerald-50 dark:bg-emerald-900/30" },
    { label: "Courses",     value: String(courses.length),  badge: `+${courses.length}`, up: true, bg: "bg-blue-50 dark:bg-blue-900/30"     },
    { label: "Lessons",     value: String(totalLessons),    badge: "+8%",               up: true, bg: "bg-amber-50 dark:bg-amber-900/30"   },
    { label: "Total views", value: totalViews.toLocaleString(), badge: "+3%",           up: true, bg: "bg-purple-50 dark:bg-purple-900/30" },
  ];

  const topStudents = [
    { n: "سارة خالد", p: 91, i: "سا", bg: "bg-purple-100 dark:bg-purple-900/40", c: "text-purple-700 dark:text-purple-400" },
    { n: "أحمد محمود", p: 75, i: "أح", bg: "bg-emerald-100 dark:bg-emerald-900/40", c: "text-emerald-700 dark:text-emerald-400" },
    { n: "يوسف حسن",  p: 58, i: "يو", bg: "bg-blue-100 dark:bg-blue-900/40",    c: "text-blue-700 dark:text-blue-400"    },
    { n: "محمد علي",  p: 40, i: "مح", bg: "bg-amber-100 dark:bg-amber-900/40",  c: "text-amber-700 dark:text-amber-400"  },
  ];

  const completionStats = [
    ["React", 82, "#1D9E75"],
    ["UI/UX", 67, "#185FA5"],
    ["Python", 55, "#854F0B"],
    ["Node", 74, "#534AB7"],
    ["Docker", 41, "#D85A30"],
  ] as const;

  const recentActivity = [
    { t: "سارة أكملت React Advanced",      time: "5 دقائق",  dot: "#1D9E75" },
    { t: "كورس Python ML أُضيف",           time: "20 دقيقة", dot: "#185FA5" },
    { t: "يوسف سجّل في UI/UX",            time: "ساعة",      dot: "#854F0B" },
    { t: "محمد بدأ درس Context API",       time: "ساعتين",   dot: "#534AB7" },
  ];

  return (
     <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3.5">
            <div className="flex items-center justify-between mb-2.5">
              <div className={`w-6 h-6 rounded-md ${s.bg}`} />
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.up ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-50 text-red-600"}`}>
                {s.badge}
              </span>
            </div>
            <p className="text-[20px] font-medium">{s.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent courses + Top students */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-medium">Recent courses</h3>
            <button
  onClick={() => navigate("/admin")}
  className="text-[12px] text-emerald-600"
>
  See all
</button>
          </div>
          {courses.map((c) => (
            <div key={c.id} className="flex items-center gap-2 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              <span className="text-[13px] flex-1 truncate">{c.title}</span>
              <span className="text-[11px] text-gray-400">{c.lessons.length} lessons</span>
              <StatusBadge status={c.status} />
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-[13px] font-medium mb-3">Top students</h3>
          {topStudents.map((s) => (
            <div key={s.n} className="flex items-center gap-2 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 ${s.bg} ${s.c}`}>{s.i}</div>
              <span className="text-[13px] flex-1">{s.n}</span>
              <ProgressBar value={s.p} width={72} />
            </div>
          ))}
        </div>
      </div>

      {/* Completion + Activity */}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-[13px] font-medium mb-3">Completion by course</h3>
          {completionStats.map(([l, v, col]) => (
            <div key={l} className="flex items-center gap-3 mb-2 last:mb-0">
              <span className="text-[12px] text-gray-500 w-12 text-right">{l}</span>
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                <div className="h-full rounded" style={{ width: `${v}%`, background: col }} />
              </div>
              <span className="text-[12px] text-gray-400 w-8">{v}%</span>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
          <h3 className="text-[13px] font-medium mb-3">Recent activity</h3>
          {recentActivity.map((a, i, arr) => (
            <div key={i} className="flex items-start gap-2 mb-2 last:mb-0">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: a.dot }} />
                {i < arr.length - 1 && (
                  <div className="w-px flex-1 bg-gray-100 dark:bg-gray-800 min-h-[14px]" />
                )}
              </div>
              <div>
                <p className="text-[12px] text-gray-600 dark:text-gray-300">{a.t}</p>
                <p className="text-[11px] text-gray-400">منذ {a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;