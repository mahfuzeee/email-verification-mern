import { useState } from "react";
import userApi from "../api/userApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "register" && formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    console.log(
      mode === "register" ? "Register form submitted" : "Login form submitted",
      formData,
    );

    try {
      if (mode === "register") {
        const res = await userApi.post("/register", formData);
        toast.success(res.data.message);
      } else {
        const res = await userApi.post("/login", formData);
        toast.success(res.data.message);
        if (res.data.success) {
          login(res.data.user);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-300/30 lg:grid lg:grid-cols-[1fr_420px]">
        <section className="hidden bg-gradient-to-br from-sky-950 via-sky-900 to-emerald-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-wide">VerifyMe</span>
          </div>

          <div className="max-w-md">
            <div className="mb-5 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              Secure Access
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Welcome to your workspace
            </h1>
            <p className="mt-5 text-sm leading-7 text-sky-100">
              Manage your account, verify your email, and continue safely with
              your team.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-2xl font-bold">24/7</div>
              <div className="mt-1 text-xs text-sky-100">Access</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-2xl font-bold">01</div>
              <div className="mt-1 text-xs text-sky-100">Secure</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
              <div className="text-2xl font-bold">2FA</div>
              <div className="mt-1 text-xs text-sky-100">Ready</div>
            </div>
          </div>
        </section>

        <section className="flex min-h-[560px] items-center justify-center bg-white p-8 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-9 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
                  Account
                </span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {mode === "register" ? "Create account" : "Welcome back"}
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>

            <div className="mb-7 flex rounded-2xl bg-slate-100 p-1">
              <button
                type="button"
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "login"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
                className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === "register"
                    ? "bg-white text-sky-700 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="Alex Johnson"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9h4"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                  {mode === "login" && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 11h14v10H5z"
                      />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {mode === "register" && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 11h14v10H5z"
                        />
                      </svg>
                    </span>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  {mode === "register" ? "I agree to the terms" : "Remember me"}
                </label>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-sky-700 px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-sky-600/30 transition hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-200"
              >
                {mode === "register" ? "Create account" : "Login"}
              </button>
            </form>

            <div className="mt-7">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 font-semibold text-slate-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
