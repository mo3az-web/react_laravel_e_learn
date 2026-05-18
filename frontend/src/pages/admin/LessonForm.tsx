import React from "react";

interface LessonFormData {
  title: string;
  url: string;
  desc: string;
  free: boolean;
}

interface LessonFormProps {
  value: LessonFormData;
  onChange: (data: LessonFormData) => void;
  onAdd: () => void;
  onCancel: () => void;
  submitLabel?: string;
}

export const LessonForm: React.FC<LessonFormProps> = ({
  value,
  onChange,
  onAdd,
  onCancel,
  submitLabel = "Add",
}) => (
  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
    <p className="text-[12px] font-medium text-gray-500 mb-3">New lesson</p>
    <div className="space-y-2">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Title</label>
        <input
          value={value.title}
          onChange={(e) => onChange({ ...value, title: e.target.value })}
          placeholder="Lesson title"
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-[13px] bg-white dark:bg-gray-900 outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">YouTube link</label>
        <input
          value={value.url}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-[13px] bg-white dark:bg-gray-900 outline-none focus:border-emerald-500"
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1">Description</label>
        <textarea
          value={value.desc}
          onChange={(e) => onChange({ ...value, desc: e.target.value })}
          placeholder="Short description..."
          rows={2}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-[13px] bg-white dark:bg-gray-900 outline-none focus:border-emerald-500 resize-none"
        />
      </div>
      <div className="flex items-center gap-3 pt-1">
        <span className="text-[12px] text-gray-500">Access:</span>
        <div className="flex gap-1">
          {([true, false] as const).map((isFree) => (
            <button
              key={String(isFree)}
              onClick={() => onChange({ ...value, free: isFree })}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                value.free === isFree
                  ? isFree
                    ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-500"
                    : "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-500"
                  : "border-gray-200 dark:border-gray-600 text-gray-400"
              }`}
            >
              {isFree ? "Free" : "Paid"}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button
          onClick={onCancel}
          className="text-[12px] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500"
        >
          Cancel
        </button>
        <button
          onClick={onAdd}
          className="text-[12px] px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  </div>
);

// ─── ADD LESSON BUTTON ────────────────────────────────────────────────────────

export const AddLessonButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-[12px] text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="8" y1="2" x2="8" y2="14"/>
      <line x1="2" y1="8" x2="14" y2="8"/>
    </svg>
    Add lesson
  </button>
);