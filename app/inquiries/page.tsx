import fs from "fs";
import path from "path";
import InquiriesList from "./InquiriesList";

export interface Inquiry {
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

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "pending.json");
const DONE_DIR = path.join(DATA_DIR, "done");

function readJSON(filePath: string): Inquiry[] {
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return []; }
}

export default function InquiriesPage() {
  const pending = readJSON(PENDING_FILE).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Read done files grouped by date (filename = YYYY-MM-DD.json)
  const doneByDay: Record<string, Inquiry[]> = {};
  if (fs.existsSync(DONE_DIR)) {
    for (const file of fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json")).sort().reverse()) {
      const date = file.replace(".json", "");
      const entries = readJSON(path.join(DONE_DIR, file)).sort(
        (a, b) => new Date(b.doneAt ?? b.createdAt).getTime() - new Date(a.doneAt ?? a.createdAt).getTime()
      );
      if (entries.length > 0) doneByDay[date] = entries;
    }
  }

  const allProducts = [
    ...new Set([
      ...pending.map((i) => i.product),
      ...Object.values(doneByDay).flat().map((i) => i.product),
    ].filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Enquiries</h1>
          <form action="/api/auth/logout" method="POST">
            <button type="submit"
              className="text-sm text-gray-500 border border-gray-200 px-4 py-1.5 rounded-full hover:border-red-300 hover:text-red-500 transition">
              Logout
            </button>
          </form>
        </div>
        <InquiriesList pending={pending} doneByDay={doneByDay} products={allProducts} />
      </div>
    </div>
  );
}
