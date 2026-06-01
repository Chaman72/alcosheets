"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed."); return; }
      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-gray-950 flex-col items-center justify-center px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(234,179,8,0.15),_transparent_60%)]" />
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-extrabold text-yellow-500 tracking-widest mb-2">ALCO</h1>
          <p className="text-white text-lg font-light tracking-widest mb-8">SHEETS ADMIN</p>
          <div className="w-16 h-0.5 bg-yellow-500 mx-auto mb-8" />
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Manage your products, inquiries, and business operations from one place.
          </p>
        </div>
        <div className="absolute bottom-8 text-gray-700 text-xs">
          © {new Date().getFullYear()} Alco Sheets. All rights reserved.
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-6 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-extrabold text-yellow-500 tracking-widest">
              ALCO<span className="text-gray-800 text-lg font-light ml-1">SHEETS</span>
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1">Sign in to your admin panel</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm">
                <AlertCircle size={16} className="shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="admin@alcosheets.com"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-yellow-500 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <Link href="/" className="text-sm text-gray-400 hover:text-yellow-500 transition">
                ← Back to Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
