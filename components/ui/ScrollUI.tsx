"use client";
import { useScrollProgress } from "@/hooks";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollUI() {
  const progress = useScrollProgress();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    setShowTop(progress > 20);
  }, [progress]);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-[100] h-[3px] bg-yellow-500 transition-all duration-100"
        style={{ width: `${progress}%` }} />

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-50 w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-400 transition">
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}
