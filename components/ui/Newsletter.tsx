"use client";
import { useState } from "react";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Subscription failed."); return; }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-yellow-500 py-14 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Mail size={36} className="text-black mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-2">Stay Updated</h2>
        <p className="text-black/70 mb-6">Subscribe to get the latest product launches, project showcases, and industry news.</p>

        {done ? (
          <div className="flex items-center justify-center gap-2 text-black font-bold text-lg">
            <CheckCircle size={24} /> Subscribed successfully!
          </div>
        ) : (
          <>
            {error && (
              <div className="flex items-center justify-center gap-2 text-red-700 bg-red-100 rounded-lg px-4 py-2 mb-4 text-sm max-w-md mx-auto">
                <AlertCircle size={14} /> {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                required placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-sm bg-black/10 border border-black/20 text-black placeholder-black/50 focus:outline-none focus:border-black" />
              <button type="submit" disabled={loading}
                className="bg-black text-yellow-500 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-900 transition disabled:opacity-60">
                {loading ? "..." : "Subscribe"}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
