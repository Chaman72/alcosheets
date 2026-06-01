"use client";
import Link from "next/link";
import { Package, MessageSquare, ArrowUpRight, Clock, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  product: string;
  status: "NEW" | "READ" | "REPLIED";
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-yellow-500/20 text-yellow-400",
  READ: "bg-blue-500/20 text-blue-400",
  REPLIED: "bg-green-500/20 text-green-400",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    fetch("/api/inquiry?view=pending")
      .then((r) => r.json())
      .then((d) => setInquiries(d.data ?? []));

    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => setProductCount(d.meta?.total ?? 0));
  }, []);

  const newCount = inquiries.filter((i) => i.status === "NEW").length;
  const recent = inquiries.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <Link href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-500 transition border border-gray-700 px-4 py-2 rounded-lg">
          View Website <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Total Products</span>
            <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package size={18} className="text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{productCount}</div>
          <Link href="/admin/products" className="text-xs text-yellow-500 hover:underline mt-1 inline-block">Manage products →</Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400 text-sm">Pending Inquiries</span>
            <div className="w-9 h-9 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <MessageSquare size={18} className="text-yellow-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{inquiries.length}</div>
          <p className="text-xs text-yellow-400 mt-1">{newCount} new unread</p>
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-yellow-500 text-sm hover:underline">View all</Link>
        </div>

        {recent.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-8">No pending inquiries.</p>
        ) : (
          <div className="space-y-3">
            {recent.map((inq) => (
              <div key={inq.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
                <div className="w-9 h-9 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold text-sm shrink-0 uppercase">
                  {inq.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{inq.name}</p>
                  <p className="text-gray-500 text-xs truncate">{inq.product || inq.email}</p>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[inq.status]}`}>{inq.status}</span>
                  <span className="text-gray-600 text-xs flex items-center gap-1"><Clock size={10} /> {timeAgo(inq.createdAt)}</span>
                </div>
                <a href={`mailto:${inq.email}`} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition shrink-0">
                  <Mail size={15} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
