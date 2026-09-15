import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const serverUser = user || {
    name: "Guest User",
    email: "guest@example.com",
    isVerified: false,
  };

  const shouldNavigate = serverUser.isVerified === true;
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-300/30">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-sky-600">
              User Dashboard
            </span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Welcome, {serverUser.name}
            </h1>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            {serverUser.isVerified ? "Verified" : "Not Verified"}
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl bg-slate-50 p-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-sm font-semibold text-slate-500">Name</span>
            <span className="text-sm font-bold text-slate-900">
              {serverUser.name}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <span className="text-sm font-semibold text-slate-500">Email</span>
            <span className="text-sm font-bold text-slate-900">
              {serverUser.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Verification
            </span>
            <span
              className={`text-sm font-bold ${
                serverUser.isVerified ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {serverUser.isVerified ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        {!serverUser.isVerified && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            please verify email for login, check your email first
          </div>
        )}

        {serverUser.isVerified && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Your account is verified and ready to access the dashboard.
            </div>
            <button
              className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700"
              onClick={() => handleLogout()}
            >
              Logout
            </button>
          </div>
        )}

        {!shouldNavigate && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            Login blocked until email is verified.
          </div>
        )}
      </div>
    </div>
  );
}
