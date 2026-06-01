"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-start gap-3 mb-4">
        <Cookie size={22} className="text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-white font-bold text-sm mb-1">We use cookies</h3>
          <p className="text-gray-400 text-xs leading-relaxed">
            We use cookies to enhance your experience, analyze traffic, and personalize content.{" "}
            <Link href="/privacy-policy" className="text-yellow-500 hover:underline">Learn more</Link>
          </p>
        </div>
        <button onClick={decline} className="text-gray-600 hover:text-gray-400 shrink-0">
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-3">
        <button onClick={accept} className="flex-1 bg-yellow-500 text-black py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
          Accept All
        </button>
        <button onClick={decline} className="flex-1 border border-gray-700 text-gray-400 py-2 rounded-lg text-sm font-medium hover:border-gray-500 transition">
          Decline
        </button>
      </div>
    </div>
  );
}
