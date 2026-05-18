import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
});

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      
      console.log("Register Response:", res.data);

      const token = res.data?.access_token;

      if (token) {
        localStorage.setItem("token", token);
      }

      // بعد التسجيل نوديه للهوم مباشرة
      navigate("/home");

    } catch (err: any) {
      console.log(err);
   console.log(err.response.data)

      setError(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
    
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 px-4">

      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >
        <h1 className="text-white text-3xl font-bold text-center mb-8">
          إنشاء حساب جديد
        </h1>

        {/* Email */}
      <input
  type="text"
  placeholder="اسمك الكريم؟"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
/>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {/* Confirm Password */}
        <input
          type="password"
          placeholder="تأكيد كلمة المرور"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {/* Error */}
        {error && (
          <p className="text-red-300 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>

        {/* Link */}
        <p className="text-center text-white/70 mt-5 text-sm">
          عندك حساب بالفعل؟{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-300 cursor-pointer hover:underline"
          >
            تسجيل الدخول
          </span>
        </p>
      </form>

    </div>
  );
};

export default Register;