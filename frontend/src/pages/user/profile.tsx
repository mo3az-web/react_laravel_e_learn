import React, { useEffect, useState } from "react";
import api from "../api/api";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);

  const [subDate, setSubDate] = useState<string | null>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  const courses = [
    { name: "HTML & CSS", progress: 90 },
    { name: "JavaScript", progress: 75 },
    { name: "React", progress: 60 },
    { name: "TypeScript", progress: 40 },
  ];


  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await api.get("/userInfo");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingUser(false);
    }
  };

  fetchUser();
}, []);

  useEffect(() => {
  const fetchSubscription = async () => {
    try {
      const res = await api.get("/me/subscription");

      console.log("subscription:", res.data);

      setHasActivePlan(res.data.hasActivePlan);
      setSubDate(res.data.startDate ?? null);
    } catch (err) {
      console.log(err);
      setHasActivePlan(false);
      setSubDate(null);
    } finally {
      setLoadingSub(false);
    }
  };

  fetchSubscription();
}, []);
  

  return (
    <div className="min-h-screen px-6 pt-32 pb-12 bg-gradient-to-br from-white via-emerald-50 to-white dark:from-black dark:via-black dark:to-black text-gray-900 dark:text-white transition">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold">
          {loadingUser ? (
            <span className="inline-block w-44 h-8 rounded-lg bg-slate-200 dark:bg-white/10 animate-pulse" />
          ) : (
            <>
              أهلاً{" "}
              <span className="text-emerald-500 dark:text-emerald-400">
                {user?.name}
              </span>
            </>
          )}
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          تابع تقدمك في الكورسات وحالة الاشتراك
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">

        {/* Subscription */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-md">
          <p className="text-sm text-gray-500">حالة الاشتراك</p>
 {subDate && (
  <p className="text-sm text-gray-500 mt-2">
    بدأ الاشتراك: {new Date(subDate).toLocaleDateString("eng-EG")}
  </p>
)}
          <p className="text-xl font-semibold mt-2">
            {loadingSub ? (
              <span className="text-gray-400">جاري التحميل...</span>
            ) : hasActivePlan ? (
              <span className="text-emerald-500">مشترك ✅</span>
            ) : (
              <span className="text-red-500">غير مشترك ❌</span>
            )}
          </p>
        </div>

        {/* Courses */}
        <div className="p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl shadow-md">
          <p className="text-sm text-gray-500">عدد الكورسات</p>
          <p className="text-xl font-semibold mt-2 text-emerald-500">
            {courses.length}
          </p>
        </div>

      </div>

      {/* Courses Progress */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-gray-200 dark:border-white/10 shadow-xl">

        <h2 className="text-xl font-semibold mb-6">
          تقدم الكورسات
        </h2>

        <div className="space-y-6">

          {courses.map((course, index) => (
            <div key={index}>

              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium">{course.name}</span>
                <span className="text-gray-500">{course.progress}%</span>
              </div>

              <div className="w-full h-3 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${course.progress}%` }}
                />
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default Profile;