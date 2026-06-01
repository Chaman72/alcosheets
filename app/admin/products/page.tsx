"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: { name: string; slug: string };
  thickness: string;
  finish: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

const categories = ["ACP Panels", "Fire Rated", "Mirror & Metallic", "Wood & Stone", "Special Finish"];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "", thickness: "4mm", finish: "", isFeatured: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=100");
      const json = await res.json();
      setProducts(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to add product."); return; }
      setShowForm(false);
      setForm({ name: "", description: "", category: "", thickness: "4mm", finish: "", isFeatured: false });
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  async function handleToggleFeatured(id: number, current: boolean) {
    await fetch("/api/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isFeatured: !current }) });
    load();
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} total products</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Add Product Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-bold text-lg">Add New Product</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            {error && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                  placeholder="e.g. Standard ACP Panel"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition" />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Thickness</label>
                  <input value={form.thickness} onChange={(e) => setForm({ ...form, thickness: e.target.value })}
                    placeholder="4mm"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">Finish</label>
                  <input value={form.finish} onChange={(e) => setForm({ ...form, finish: e.target.value })}
                    placeholder="PVDF Coated"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Product description..."
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-yellow-500 transition resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm({ ...form, isFeatured: !form.isFeatured })}>
                  {form.isFeatured
                    ? <ToggleRight size={24} className="text-yellow-500" />
                    : <ToggleLeft size={24} className="text-gray-600" />}
                </button>
                <span className="text-gray-400 text-sm">Mark as Featured</span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-yellow-500 text-black py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-60 text-sm">
                  {saving ? "Saving..." : "Add Product"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2.5 rounded-lg text-sm hover:border-gray-500 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500 transition" />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 text-sm text-center py-12">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center py-12">No products found. Click "Add Product" to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Thickness</th>
                  <th className="text-left px-4 py-3">Finish</th>
                  <th className="text-left px-4 py-3">Featured</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <div className="w-4 h-4 bg-yellow-500/60 rounded" />
                        </div>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.category?.name}</td>
                    <td className="px-4 py-3 text-gray-400">{p.thickness || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">{p.finish || "—"}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleFeatured(p.id, p.isFeatured)}>
                        {p.isFeatured
                          ? <ToggleRight size={22} className="text-yellow-500" />
                          : <ToggleLeft size={22} className="text-gray-600" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
