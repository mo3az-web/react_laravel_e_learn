import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

type Plan = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration_days: number; // ✅ FIX مهم
};

const CheckoutPage: React.FC = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  // ✔️ fetch plan
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/plans");
        const response = await res.json();

        const selected = response.data.find(
          (p: Plan) => p.id === Number(planId)
        );

        if (!selected) {
          alert("الباقة غير موجودة");
          navigate("/pricing");
          return;
        }

        setPlan(selected);
      } catch (err) {
        console.error("Fetch plan error:", err);
      }
    };

    fetchPlan();
  }, [planId, navigate]);

  // ✔️ subscribe
  const handlePay = async () => {
    if (!planId) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("لازم تسجل دخول الأول");
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:8001/api/start-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json", // ✅ مهم عشان يمنع HTML response
        },
        body: JSON.stringify({
          plan_id: Number(planId),
        }),
      });

      const data = await res.json();

      // ✔️ handle backend errors properly
      if (!res.ok || !data.status) {
        alert(data.message || "فشل الاشتراك");
        return;
      }

      alert("تم الاشتراك بنجاح 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Subscribe error:", err);
      alert("حصل خطأ أثناء الاشتراك");
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="text-center mt-20 text-gray-500">
        جاري تحميل البيانات...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 md:px-20 py-20 
    bg-gradient-to-b from-emerald-50 via-white to-white
    dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">
          تأكيد الاشتراك
        </h1>
        <p className="text-gray-500 mt-2">
          راجع بيانات الباقة قبل التأكيد
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/60 
          border border-gray-200 dark:border-gray-800 backdrop-blur-xl"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            ملخص الاشتراك
          </h2>

          <div className="space-y-3 text-gray-700 dark:text-gray-300">
            <div className="flex justify-between">
              <span>الباقة</span>
              <span className="font-semibold">{plan.title}</span>
            </div>

            <div className="flex justify-between">
              <span>المدة</span>
              <span>{plan.duration_days} يوم</span> {/* ✅ FIX */}
            </div>

            <div className="flex justify-between text-emerald-600 font-bold text-lg mt-4">
              <span>الإجمالي</span>
              <span>{plan.price} ج.م</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-emerald-600">
            <FaCheckCircle />
            يمكنك الإلغاء أو التعديل لاحقًا
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl p-6 bg-white/80 dark:bg-gray-900/60 
          border border-gray-200 dark:border-gray-800 backdrop-blur-xl"
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            إتمام الاشتراك
          </h2>

          <p className="text-gray-500 text-sm">
            سيتم تفعيل الاشتراك فورًا (الدفع لاحقًا)
          </p>

          <button
            onClick={handlePay}
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-semibold 
            bg-emerald-500 hover:bg-emerald-600 text-white 
            shadow-md shadow-emerald-500/20 transition disabled:opacity-60"
          >
            {loading ? "جاري التفعيل..." : "تأكيد الاشتراك"}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;