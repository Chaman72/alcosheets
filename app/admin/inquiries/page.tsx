"use client";
import { useState, useEffect } from "react";
import { Search, Eye, Trash2, Mail, CheckCircle, RotateCcw } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  product: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED";
  done: boolean;
  remark: string;
  createdAt: string;
  doneAt?: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  READ: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  REPLIED: "bg-green-500/20 text-green-400 border-green-500/30",
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(view: "pending" | "done", keepSelection = false) {
    setLoading(true);
    try {
      const res = await fetch(`/api/inquiry?view=${view}`);
      const json = await res.json();
      setInquiries(json.data ?? []);
      if (!keepSelection) setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(tab); }, [tab]);

  async function handleDelete(id: number) {
    await fetch("/api/inquiry", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
    setSelected(null);
    load(tab);
  }

  async function handleStatus(id: number, status: string) {
    await fetch("/api/inquiry", { method: "PATCH", body: JSON.stringify({ id, status }), headers: { "Content-Type": "application/json" } });
    load(tab, true);
  }

  async function handleMarkDone(id: number) {
    await fetch("/api/inquiry", { method: "PATCH", body: JSON.stringify({ id, done: true, remark }), headers: { "Content-Type": "application/json" } });
    setRemark("");
    setSelected(null);
    load(tab);
  }

  async function handleMarkPending(id: number) {
    await fetch("/api/inquiry", { method: "PATCH", body: JSON.stringify({ id, done: false }), headers: { "Content-Type": "application/json" } });
    setSelected(null);
    load(tab);
  }

  const filtered = inquiries.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    (i.product ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">
            {tab === "pending"
              ? `${inquiries.filter((i) => i.status === "NEW").length} new · ${inquiries.length} total pending`
              : `${inquiries.length} completed`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["pending", "done"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition capitalize ${tab === t ? "bg-yellow-500 text-black" : "bg-gray-900 border border-gray-700 text-gray-400 hover:border-yellow-500"}`}>
            {t === "pending" ? "⏳ Pending" : "✅ Done"}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or product..."
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-3">
          {loading && <p className="text-gray-600 text-sm text-center py-10">Loading...</p>}
          {!loading && filtered.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-10">No inquiries found.</p>
          )}
          {filtered.map((inq) => (
            <div key={inq.id}
              onClick={() => {
                setSelected(inq);
                if (tab === "pending" && inq.status === "NEW") handleStatus(inq.id, "READ");
              }}
              className={`bg-gray-900 border rounded-xl p-4 cursor-pointer transition ${selected?.id === inq.id ? "border-yellow-500" : "border-gray-800 hover:border-gray-700"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold shrink-0 uppercase">
                    {inq.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{inq.name}</p>
                    <p className="text-gray-500 text-xs">{inq.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {tab === "pending" && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[inq.status]}`}>{inq.status}</span>
                  )}
                  {tab === "done" && (
                    <span className="text-xs px-2 py-0.5 rounded-full border font-medium bg-green-500/20 text-green-400 border-green-500/30">DONE</span>
                  )}
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3 line-clamp-2">{inq.message}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span>{inq.product || "—"}</span>
                <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-fit sticky top-8">
          {selected ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-500 font-bold text-lg uppercase">
                  {selected.name[0]}
                </div>
                <div>
                  <p className="text-white font-bold">{selected.name}</p>
                  <p className="text-gray-500 text-xs">{selected.email}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm mb-5">
                {([
                  ["Phone", selected.phone ?? "—"],
                  ["Product", selected.product ?? "—"],
                  ["Submitted", new Date(selected.createdAt).toLocaleString()],
                  ...(selected.doneAt ? [["Completed", new Date(selected.doneAt).toLocaleString()]] : []),
                  ...(selected.remark ? [["Remark", selected.remark]] : []),
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-gray-600 text-xs block">{k}</span>
                    <span className="text-gray-300 text-sm">{v}</span>
                  </div>
                ))}
                <div>
                  <span className="text-gray-600 text-xs block mb-1">Message</span>
                  <p className="text-gray-300 leading-relaxed bg-gray-800 p-3 rounded-lg text-xs">{selected.message}</p>
                </div>
              </div>

              {/* Mark Done (only in pending tab) */}
              {tab === "pending" && (
                <div className="mb-3">
                  <input
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Add remark (optional)..."
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-yellow-500 transition mb-2"
                  />
                  <button onClick={() => handleMarkDone(selected.id)}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition mb-2">
                    <CheckCircle size={14} /> Mark as Done
                  </button>
                </div>
              )}

              {/* Move back to pending (only in done tab) */}
              {tab === "done" && (
                <button onClick={() => handleMarkPending(selected.id)}
                  className="w-full flex items-center justify-center gap-2 border border-gray-700 text-gray-300 py-2 rounded-lg text-sm font-medium hover:border-yellow-500 hover:text-yellow-500 transition mb-2">
                  <RotateCcw size={14} /> Move to Pending
                </button>
              )}

              <div className="flex gap-2">
                <a href={`mailto:${selected.email}`}
                  onClick={() => tab === "pending" && handleStatus(selected.id, "REPLIED")}
                  className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-black py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
                  <Mail size={14} /> Reply
                </a>
                <button onClick={() => handleDelete(selected.id)}
                  className="w-10 h-10 flex items-center justify-center border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-600">
              <Eye size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
