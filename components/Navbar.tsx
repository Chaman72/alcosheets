"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import SearchBar from "@/components/ui/SearchBar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-500 tracking-widest shrink-0">
          ALCO<span className="text-gray-800 text-sm font-light ml-1">SHEETS</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-gray-600 hover:text-yellow-500 transition font-medium text-sm tracking-wide uppercase px-3 py-2">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <SearchBar />
          <Link href="/admin/login" className="border border-gray-300 text-gray-700 px-4 py-2 rounded font-semibold text-sm hover:border-yellow-500 hover:text-yellow-500 transition">
            Login
          </Link>
          <Link href="/contact" className="bg-yellow-500 text-black px-5 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition">
            Get Quote
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-gray-800">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-4 pb-4 max-h-[80vh] overflow-y-auto">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-3 text-gray-600 hover:text-yellow-500 border-b border-gray-100 text-sm uppercase tracking-wide">
              {l.label}
            </Link>
          ))}
          <Link href="/admin/login" onClick={() => setOpen(false)}
            className="block mt-3 border border-gray-300 text-gray-700 text-center py-2 rounded font-semibold text-sm hover:border-yellow-500 hover:text-yellow-500 transition">
            Login
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}
            className="block mt-3 bg-yellow-500 text-black text-center py-2 rounded font-semibold text-sm">
            Get Quote
          </Link>
        </div>
      )}
    </nav>
  );
}
