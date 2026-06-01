"use client";
import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

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
  doneAt?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-700",
  READ: "bg-blue-100 text-blue-700",
  REPLIED: "bg-green-100 text-green-700",
};

async function patchInquiry(body: object) {
  await fetch("/api/inquiry", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function InquiriesList({
  pending: initialPending,
  doneByDay: initialDoneByDay,
  products,
}: {
  pending: Inquiry[];
  doneByDay: Record<string, Inquiry[]>;
  products: string[];
}) {
  const [pending, setPending] = useState(initialPending);
  const [doneByDay, setDoneByDay] = useState(initialDoneByDay);
  const [tab, setTab] = useState<"pending" | "done">("pending");
  const [selectedProduct, setSelectedProduct] = useState("All");
  const [remarkModal, setRemarkModal] = useState<{ id: number; remark: string } | null>(null);

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  async function markDone(id: number, remark: string) {
    const inq = pending.find((i) => i.id === id);
    if (!inq) return;
    const updated = { ...inq, done: true, remark, doneAt: new Date().toISOString() };
    const today = todayStr();

    setPending((prev) => prev.filter((i) => i.id !== id));
    setDoneByDay((prev) => ({
      [today]: [updated, ...(prev[today] ?? [])],
      ...Object.fromEntries(Object.entries(prev).filter(([k]) => k !== today)),
    }));

    await patchInquiry({ id, done: true, remark });
  }

  async function markPending(id: number) {
    let inq: Inquiry | undefined;
    const newDoneByDay = { ...doneByDay };
    for (const [day, entries] of Object.entries(newDoneByDay)) {
      const idx = entries.findIndex((i) => i.id === id);
      if (idx !== -1) {
        inq = { ...entries[idx], done: false, remark: "", doneAt: undefined };
        newDoneByDay[day] = entries.filter((i) => i.id !== id);
        if (newDoneByDay[day].length === 0) delete newDoneByDay[day];
        break;
      }
    }
    if (!inq) return;
    setDoneByDay(newDoneByDay);
    setPending((prev) => [inq!, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    await patchInquiry({ id, done: false });
  }

  async function submitRemark() {
    if (!remarkModal) return;
    await markDone(remarkModal.id, remarkModal.remark);
    setRemarkModal(null);
  }

  // Filter pending by product
  const filteredPending = pending.filter(
    (i) => selectedProduct === "All" || i.product === selectedProduct
  );

  // Filter done by product
  const filteredDoneByDay: Record<string, Inquiry[]> = {};
  for (const [day, entries] of Object.entries(doneByDay)) {
    const filtered = entries.filter((i) => selectedProduct === "All" || i.product === selectedProduct);
    if (filtered.length > 0) filteredDoneByDay[day] = filtered;
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  const Card = ({ inq }: { inq: Inquiry }) => (
    <div className={`bg-white border rounded-xl p-5 shadow-sm transition ${inq.done ? "border-green-200" : "border-gray-200"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600 font-bold text-lg shrink-0">
            {inq.name[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{inq.name}</p>
            <p className="text-sm text-gray-500">{inq.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {inq.product && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{inq.product}</span>}
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[inq.status]}`}>{inq.status}</span>
          <span className="text-xs text-gray-400">{new Date(inq.createdAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
          <button
            onClick={() => inq.done ? markPending(inq.id) : setRemarkModal({ id: inq.id, remark: "" })}
            title={inq.done ? "Move back to Pending" : "Mark as Done"}
            className="flex items-center gap-1 text-xs font-medium transition">
            {inq.done
              ? <><CheckCircle2 size={18} className="text-green-500" /><span className="text-green-500">Done</span></>
              : <><Circle size={18} className="text-gray-300" /><span className="text-gray-400">Pending</span></>
            }
          </button>
        </div>
      </div>
      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{inq.message}</p>
      {inq.phone && <p className="mt-2 text-xs text-gray-400">📞 {inq.phone}</p>}
      {inq.done && inq.remark && (
        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700">
          <span className="font-semibold">Remark: </span>{inq.remark}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Live counts */}
      <p className="text-gray-500 text-sm mb-5">
        <span className="text-red-500 font-semibold">{pending.length} pending</span>
        {" · "}
        {Object.values(doneByDay).flat().length} done
      </p>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        <button onClick={() => setTab("pending")}
          className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${tab === "pending" ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}>
          Pending ({pending.length})
        </button>
        <button onClick={() => setTab("done")}
          className={`px-5 py-2 rounded-full text-sm font-semibold border transition ${tab === "done" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-600 border-gray-200 hover:border-green-300"}`}>
          Done ({Object.values(doneByDay).flat().length})
        </button>
      </div>

      {/* Product Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...products].map((p) => (
          <button key={p} onClick={() => setSelectedProduct(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              selectedProduct === p ? "bg-yellow-500 text-black border-yellow-500" : "bg-white text-gray-600 border-gray-200 hover:border-yellow-400"
            }`}>
            {p}
          </button>
        ))}
      </div>

      {/* Remark Modal */}
      {remarkModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Mark as Done</h3>
            <p className="text-sm text-gray-500 mb-4">Add a remark before closing this inquiry (optional).</p>
            <textarea rows={4} autoFocus value={remarkModal.remark}
              onChange={(e) => setRemarkModal({ ...remarkModal, remark: e.target.value })}
              placeholder="e.g. Sent quotation, customer confirmed order..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-yellow-500 resize-none" />
            <div className="flex gap-3 mt-4">
              <button onClick={submitRemark} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-green-600 transition">
                Mark as Done
              </button>
              <button onClick={() => setRemarkModal(null)} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Tab */}
      {tab === "pending" && (
        filteredPending.length === 0
          ? <div className="text-center py-20 text-gray-400">No pending enquiries.</div>
          : <div className="space-y-4">{filteredPending.map((inq) => <Card key={inq.id} inq={inq} />)}</div>
      )}

      {/* Done Tab — grouped by day */}
      {tab === "done" && (
        Object.keys(filteredDoneByDay).length === 0
          ? <div className="text-center py-20 text-gray-400">No done enquiries.</div>
          : Object.entries(filteredDoneByDay).map(([day, entries]) => (
            <div key={day} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                  {formatDate(day)}
                </span>
                <span className="text-xs text-gray-400">{entries.length} done</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-4">{entries.map((inq) => <Card key={inq.id} inq={inq} />)}</div>
            </div>
          ))
      )}
    </>
  );
}
