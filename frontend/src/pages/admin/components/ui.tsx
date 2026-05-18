import React from "react";

type Status = "published" | "draft";

// ─── NAV ICONS ────────────────────────────────────────────────────────────────

export const NavIcon = {
  dashboard: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
      <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
    </svg>
  ),
  courses: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="12" height="12" rx="1.5"/>
      <line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/>
    </svg>
  ),
  students: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2-5 5-5s5 2 5 5"/>
      <path d="M11 3c1.5 0 3 .5 3 3s-1.5 3-3 3"/><path d="M14 14c0-2-1-4-3-4.5"/>
    </svg>
  ),
  stats: () => (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="1,12 5,7 8,9 12,4 15,6"/><line x1="1" y1="14" x2="15" y2="14"/>
    </svg>
  ),
};

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  color?: string;
  width?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "#1D9E75",
  width = 80,
}) => (
  <div style={{ width }}>
    <p className="text-[11px] text-gray-400">{value}%</p>
    <div className="h-[3px] bg-gray-100 dark:bg-gray-800 rounded mt-1">
      <div className="h-full rounded" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => (
  <span
    className={`text-[10px] px-2 py-0.5 rounded-full ${
      status === "published"
        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
        : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
    }`}
  >
    {status === "published" ? "Published" : "Draft"}
  </span>
);

// ─── THUMBNAIL PLACEHOLDER ────────────────────────────────────────────────────

export const ThumbnailPlaceholder: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}>
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="opacity-30"
    >
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21,15 16,10 5,21"/>
    </svg>
  </div>
);