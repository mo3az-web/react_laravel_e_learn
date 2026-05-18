import React from "react";
 export type Status = "published" | "draft";
export type View = "dashboard" | "courses" | "students" | "stats";

export interface Lesson {
  id: number;
  title: string;
  url: string;
  desc: string;
  free: boolean;
}

export interface Course {
  id: number;
  title: string;
  desc: string;
  status: Status;
  thumb: string;
  views: number;
  lessons: Lesson[];
}
interface StatsViewProps {
  courses: Course[];
}

const StatsView: React.FC<StatsViewProps> = ({ courses }) => {
  const totalViews = courses.reduce((a, c) => a + c.views, 0);

  const statCards = [
    { l: "Users",       v: "1,250",                   b: "+12%",              up: true },
    { l: "Courses",     v: String(courses.length),     b: `+${courses.length}`, up: true },
    { l: "Total views", v: totalViews.toLocaleString(), b: "+8%",              up: true },
    { l: "Engagement",  v: "78%",                      b: "+3%",              up: true },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {statCards.map((s) => (
          <div key={s.l} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3.5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] text-gray-400">{s.l}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                s.up
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 text-red-600"
              }`}>
                {s.b}
              </span>
            </div>
            <p className="text-[20px] font-medium">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
        <h3 className="text-[13px] font-medium mb-3">Views by course</h3>
        {courses.map((c) => (
          <div key={c.id} className="flex items-center gap-3 mb-2 last:mb-0">
            <span className="text-[12px] text-gray-500 w-20 truncate text-right">
              {c.title.split(" ")[0]}
            </span>
            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded">
              <div
                className="h-full rounded bg-emerald-500"
                style={{ width: `${Math.min(100, Math.round(c.views / 15))}%` }}
              />
            </div>
            <span className="text-[12px] text-gray-400 w-14">{c.views.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsView;