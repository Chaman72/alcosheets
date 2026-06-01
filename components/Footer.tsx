import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 pt-16 pb-6 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-yellow-500 tracking-widest mb-3">ALCO<span className="text-gray-800 dark:text-white text-sm font-light ml-1">SHEETS</span></h2>
          <p className="text-sm leading-relaxed">Premium Aluminium Composite Panel manufacturer delivering quality facade solutions worldwide.</p>
        </div>

        <div>
          <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-4 uppercase tracking-wide text-sm">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[["Home", "/"], ["Products", "/products"], ["About", "/about"], ["Contact", "/contact"]].map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-yellow-500 transition">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-4 uppercase tracking-wide text-sm">Products</h3>
          <ul className="space-y-2 text-sm">
            {["ACP Panels", "Cladding Sheets", "Bond Panels", "Fire Rated Panels", "Mirror Finish"].map((p) => (
              <li key={p}><Link href="/products" className="hover:text-yellow-500 transition">{p}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 dark:text-gray-100 font-semibold mb-4 uppercase tracking-wide text-sm">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2 items-start"><MapPin size={16} className="text-yellow-500 mt-0.5 shrink-0" /> Al Asmawi Warehouses Building - Block A, Warehouse A5, Plot No. 103-0, Saih Shuaib 4, PO Box: 18984, Dubai Industrial City, Dubai, UAE</li>
            <li className="flex gap-2 items-center"><Phone size={16} className="text-yellow-500 shrink-0" /> +971 54 580 4047</li>
            <li className="flex gap-2 items-center"><Mail size={16} className="text-yellow-500 shrink-0" /> info@alcosheets.com</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Alco Sheets. All rights reserved.
      </div>
    </footer>
  );
}
