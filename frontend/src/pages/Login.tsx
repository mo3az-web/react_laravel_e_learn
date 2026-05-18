import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8001/api",
});

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      console.log("API Response:", res.data);

      
      const token = res.data?.access_token || res.data?.token;
      const user = res.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        
      }

      if (user?.role) {
        localStorage.setItem("role", user.role);

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }

      }

    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      
    }
    
  };
  

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 to-emerald-700 px-4">

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
      >

        <h1 className="text-white text-3xl font-bold text-center mb-8">
          تسجيل الدخول
        </h1>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        {error && (
          <p className="text-red-300 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {loading ? "جاري تسجيل الدخول..." : "دخول"}
        </button>

      </form>

    </div>
  );
};

export default Login;