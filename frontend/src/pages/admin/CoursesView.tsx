import React, { useEffect, useState } from "react";
import { StatusBadge, ThumbnailPlaceholder } from "./components/ui";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export type Status = "published" | "draft";

export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  status?: Status;
  views?: number;
}

const IMAGE_BASE = "http://127.0.0.1:8001/storage/";

const CoursesView: React.FC = () => {
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8001/api/getCourses"
        );

        setCoursesData(res.data?.data?.data ?? []);
      } catch (err) {
        console.error(err);
        setCoursesData([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // 🔄 Loading UI
  if (loadingCourses) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse text-gray-400 dark:text-gray-500 text-sm">
          Loading courses...
        </div>
      </div>
    );
  }

  // 📭 Empty state
  if (coursesData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
        <p className="text-sm">No courses found</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {coursesData.map((c) => (
          <div
            key={c.id}
            onClick={() => navigate(`/admin/course/${c.id}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden 
            bg-white dark:bg-gray-900 
            border border-gray-100 dark:border-gray-800
            shadow-sm hover:shadow-lg 
            hover:-translate-y-1 
            transition-all duration-300"
          >
            {/* Image */}
            {c.thumbnail ? (
              <img
                src={`${IMAGE_BASE}${c.thumbnail}`}
                alt={c.title}
                className="w-full h-[140px] object-cover 
                group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <ThumbnailPlaceholder className="w-full h-[140px]" />
            )}

            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <h3 className="text-[14px] font-semibold text-gray-800 dark:text-white truncate mb-1">
                {c.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                {c.description || "No description available"}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <StatusBadge status={c.status ?? "published"} />

                {c.views !== undefined && (
                  <span className="text-[11px] text-gray-400 dark:text-gray-500">
                    👁 {c.views}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesView;