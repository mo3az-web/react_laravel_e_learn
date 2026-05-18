import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Plan = {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: number;
};

const PricingPage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ fetch plans
 useEffect(() => {
  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/plans");
      const response = await res.json();

      if (response.status) {
        setPlans(response.data);
      } else {
        alert(response.message);
      }

    } catch (error) {
      console.error("something went wrong");
    } finally {
      setLoading(false); // ✅ الحل هنا
    }
  };

  fetchPlans();
}, []);

  // ✅ go to checkout
  const handleGoToCheckout = () => {
    if (!selectedPlan) {
      alert("اختار خطة الأول");
      return;
    }

    navigate(`/checkout/${selectedPlan}`);
  };

  // ✅ Card
  const PlanCard = ({
    plan,
    selected,
    onSelect,
  }: {
    plan: Plan;
    selected: boolean;
    onSelect: () => void;
  }) => (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      onClick={onSelect}
      className={`cursor-pointer rounded-3xl p-6 border transition relative backdrop-blur-xl
        ${
          selected
            ? "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-900/20 shadow-lg shadow-emerald-500/10"
            : "border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/60"
        }`}
    >
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {plan.title}
      </h2>

      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
        {plan.description}
      </p>

      {/* Duration */}
      <div className="mt-3 inline-flex items-center gap-2 text-xs 
        bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full 
        text-gray-600 dark:text-gray-300">
        <FaCalendarAlt />
        {plan.duration} يوم
      </div>

      {/* Price */}
      <div className="text-2xl font-bold mt-4 text-emerald-600 dark:text-emerald-400">
        {plan.price} ج.م
      </div>

      {/* Button */}
      <button
        className={`w-full mt-6 py-2 rounded-xl font-semibold transition
          ${
            selected
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : "bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200"
          }`}
      >
        {selected ? "تم الاختيار" : "اشترك الآن"}
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen px-6 md:px-20 py-20 
      bg-gradient-to-b from-emerald-50 via-white to-white
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">
          اختر مدة الاشتراك المناسبة
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-3">
          خطط مرنة تناسب وقتك وطريقة تعلمك
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          جاري تحميل الخطط...
        </p>
      ) : (
        <div className="grid md:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-16">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          يمكنك الترقية أو الإلغاء في أي وقت
        </p>

        <button
          onClick={handleGoToCheckout}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 transition"
        >
          المتابعة إلى الدفع
        </button>
      </div>
    </div>
  );
};

export default PricingPage;