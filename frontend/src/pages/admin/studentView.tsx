import React from "react";

const STUDENTS = [
  { n: "أحمد محمود", e: "ahmed@mail.com",   p: 75, s: "Active", i: "أح", bg: "bg-emerald-100 dark:bg-emerald-900/40", c: "text-emerald-700 dark:text-emerald-400" },
  { n: "محمد علي",   e: "mohamed@mail.com", p: 40, s: "Behind", i: "مح", bg: "bg-amber-100 dark:bg-amber-900/40",    c: "text-amber-700 dark:text-amber-400"   },
  { n: "سارة خالد", e: "sara@mail.com",     p: 91, s: "Active", i: "سا", bg: "bg-purple-100 dark:bg-purple-900/40",  c: "text-purple-700 dark:text-purple-400" },
  { n: "يوسف حسن",  e: "yousef@mail.com",  p: 58, s: "Active", i: "يو", bg: "bg-blue-100 dark:bg-blue-900/40",      c: "text-blue-700 dark:text-blue-400"     },
];

const StudentsView: React.FC = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-[13px] font-medium">All students</h2>
      <span className="text-[11px] text-gray-400">1,250 total</span>
    </div>
    <table className="w-full text-[13px] border-collapse">
      <thead>
        <tr className="border-b border-gray-100 dark:border-gray-800">
          {["Student", "Email", "Progress", "Status"].map((h) => (
            <th key={h} className="text-left font-medium text-gray-500 text-[12px] pb-2">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {STUDENTS.map((s) => (
          <tr key={s.n} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
            <td className="py-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium flex-shrink-0 ${s.bg} ${s.c}`}>
                  {s.i}
                </div>
                {s.n}
              </div>
            </td>
            <td className="py-2.5 text-gray-400">{s.e}</td>
            <td className="py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-14 h-[3px] bg-gray-100 dark:bg-gray-800 rounded">
                  <div className="h-full bg-emerald-500 rounded" style={{ width: `${s.p}%` }} />
                </div>
                <span>{s.p}%</span>
              </div>
            </td>
            <td className="py-2.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                s.s === "Active"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
              }`}>
                {s.s}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default StudentsView;