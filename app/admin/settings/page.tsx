"use client";
import { useState, useEffect } from "react";
import { Bell, BellOff, Save, Check } from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ email: true, inquiry: true, newsletter: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("adminNotifications");
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  const handleSave = () => {
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your admin preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-5">
        <h2 className="text-white font-bold mb-1">Notifications</h2>
        <p className="text-gray-500 text-sm mb-4">Control what alerts you receive</p>
        <div className="space-y-3">
          {([
            { key: "email", label: "Email Notifications", desc: "Receive alerts via email" },
            { key: "inquiry", label: "New Inquiry Alerts", desc: "Notify when a new inquiry arrives" },
            { key: "newsletter", label: "Newsletter Signups", desc: "Notify on new newsletter subscriptions" },
          ] as { key: keyof typeof notifications; label: string; desc: string }[]).map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  {notifications[key] ? <Bell size={15} className="text-yellow-500" /> : <BellOff size={15} className="text-gray-500" />}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
              <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[key] ? "bg-yellow-500" : "bg-gray-700"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-5">
        <h2 className="text-white font-bold mb-4">Admin Account</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">Email</span>
            <span className="text-white">admin@alcosheets.com</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">Role</span>
            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className="flex items-center gap-2 bg-yellow-500 text-black px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition">
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
      </button>
    </div>
  );
}
