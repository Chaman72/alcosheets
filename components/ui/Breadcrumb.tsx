import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap" aria-label="Breadcrumb">
      <Link href="/" className="flex items-center gap-1 hover:text-yellow-500 transition">
        <Home size={14} /> Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-gray-700" />
          {item.href ? (
            <Link href={item.href} className="hover:text-yellow-500 transition">{item.label}</Link>
          ) : (
            <span className="text-gray-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
