"use client";
import { useDarkMode } from "@/hooks";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { dark, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-700 hover:border-yellow-500 transition text-gray-600 dark:text-gray-400 hover:text-yellow-500"
      aria-label="Toggle dark mode">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
