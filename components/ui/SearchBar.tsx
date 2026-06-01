"use client";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "@/hooks";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "Search products, blogs..." }: { placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(query, 300);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounced.trim()) {
      router.push(`/search?q=${encodeURIComponent(debounced.trim())}`);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="text-gray-400 hover:text-yellow-500 transition" aria-label="Search">
        <Search size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur flex items-start justify-center pt-24 px-4">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
            <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4">
              <Search size={20} className="text-yellow-500 shrink-0" />
              <input
                autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-white text-lg focus:outline-none placeholder-gray-600" />
              <button type="button" onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={20} />
              </button>
            </form>
            {query.length > 0 && (
              <div className="px-5 pb-4 text-sm text-gray-500">
                Press <kbd className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">Enter</kbd> to search for &quot;{query}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
