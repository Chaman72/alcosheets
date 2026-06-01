import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { validateInquiry, sanitizeString } from "@/lib/validation";
import { sendEmail, inquiryEmailTemplate } from "@/lib/email/sendEmail";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const PENDING_FILE = path.join(DATA_DIR, "pending.json");
const DONE_DIR = path.join(DATA_DIR, "done");

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  product: string;
  message: string;
  ipAddress: string;
  status: "NEW" | "READ" | "REPLIED";
  done: boolean;
  remark: string;
  doneAt?: string;
  createdAt: string;
}

function readJSON(filePath: string): Inquiry[] {
  if (!fs.existsSync(filePath)) return [];
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return []; }
}

function writeJSON(filePath: string, data: Inquiry[]) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function doneFilePath(date: string) {
  return path.join(DONE_DIR, `${date}.json`);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

// Move inquiry from pending → done day file
function markDone(id: number, remark: string) {
  const pending = readJSON(PENDING_FILE);
  const idx = pending.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  const [inq] = pending.splice(idx, 1);
  inq.done = true;
  inq.remark = remark;
  inq.doneAt = new Date().toISOString();
  const dayFile = doneFilePath(todayStr());
  const dayEntries = readJSON(dayFile);
  dayEntries.push(inq);
  writeJSON(dayFile, dayEntries);
  writeJSON(PENDING_FILE, pending);
  return true;
}

// Move inquiry from done day file → pending
function markPending(id: number) {
  if (!fs.existsSync(DONE_DIR)) return false;
  const dayFiles = fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json"));
  for (const file of dayFiles) {
    const filePath = path.join(DONE_DIR, file);
    const entries = readJSON(filePath);
    const idx = entries.findIndex((i) => i.id === id);
    if (idx === -1) continue;
    const [inq] = entries.splice(idx, 1);
    inq.done = false;
    inq.remark = "";
    delete inq.doneAt;
    writeJSON(filePath, entries);
    const pending = readJSON(PENDING_FILE);
    pending.push(inq);
    writeJSON(PENDING_FILE, pending);
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const { success, remaining } = rateLimit(ip, 5, 60_000);
  if (!success) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });

  let body: Record<string, string>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }

  const data = {
    name: sanitizeString(body.name ?? ""),
    email: sanitizeString(body.email ?? ""),
    phone: sanitizeString(body.phone ?? ""),
    product: sanitizeString(body.product ?? ""),
    message: sanitizeString(body.message ?? ""),
  };

  const { valid, errors } = validateInquiry(data);
  if (!valid) return NextResponse.json({ error: "Validation failed.", details: errors }, { status: 422 });

  const pending = readJSON(PENDING_FILE);

  // Generate unique ID across pending + all done files
  let maxId = pending.reduce((m, i) => Math.max(m, i.id), 0);
  if (fs.existsSync(DONE_DIR)) {
    for (const file of fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json"))) {
      const entries = readJSON(path.join(DONE_DIR, file));
      maxId = entries.reduce((m, i) => Math.max(m, i.id), maxId);
    }
  }

  const inquiry: Inquiry = {
    id: maxId + 1,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    product: data.product,
    message: data.message,
    ipAddress: ip,
    status: "NEW",
    done: false,
    remark: "",
    createdAt: new Date().toISOString(),
  };

  pending.push(inquiry);
  writeJSON(PENDING_FILE, pending);

  await sendEmail({
    to: process.env.ADMIN_EMAIL ?? "info@xyzpanels.com",
    subject: `New Inquiry from ${data.name}`,
    html: inquiryEmailTemplate(data),
  });

  await sendEmail({
    to: data.email,
    subject: "We received your inquiry — XYZ Panels",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:auto">
        <div style="background:#c9a84c;padding:24px;text-align:center">
          <h1 style="color:#000;margin:0">Thank You, ${data.name}!</h1>
        </div>
        <div style="padding:24px">
          <p>We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.</p>
          <p>Your inquiry reference: <strong>#INQ-${String(inquiry.id).padStart(5, "0")}</strong></p>
        </div>
      </div>
    `,
  });

  return NextResponse.json(
    { success: true, message: "Inquiry received. We will contact you within 24 hours.", id: inquiry.id },
    { status: 201, headers: { "X-RateLimit-Remaining": String(remaining) } }
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view") ?? "pending"; // "pending" | "done" | "all"
  const product = searchParams.get("product");

  let result: Inquiry[] = [];

  if (view === "pending" || view === "all") {
    result.push(...readJSON(PENDING_FILE));
  }

  if ((view === "done" || view === "all") && fs.existsSync(DONE_DIR)) {
    for (const file of fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json"))) {
      result.push(...readJSON(path.join(DONE_DIR, file)));
    }
  }

  if (product) result = result.filter((i) => i.product === product);
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return NextResponse.json({ data: result });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, done, remark, status } = body;

  if (done === true) {
    const ok = markDone(id, remark ?? "");
    if (!ok) return NextResponse.json({ error: "Not found in pending" }, { status: 404 });
  } else if (done === false) {
    const ok = markPending(id);
    if (!ok) return NextResponse.json({ error: "Not found in done files" }, { status: 404 });
  } else if (status !== undefined) {
    // Update status in pending file only
    const pending = readJSON(PENDING_FILE);
    const idx = pending.findIndex((i) => i.id === id);
    if (idx !== -1) { pending[idx].status = status; writeJSON(PENDING_FILE, pending); }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  // Try pending first
  const pending = readJSON(PENDING_FILE).filter((i) => i.id !== id);
  writeJSON(PENDING_FILE, pending);

  // Also check done files
  if (fs.existsSync(DONE_DIR)) {
    for (const file of fs.readdirSync(DONE_DIR).filter((f) => f.endsWith(".json"))) {
      const filePath = path.join(DONE_DIR, file);
      const entries = readJSON(filePath).filter((i) => i.id !== id);
      writeJSON(filePath, entries);
    }
  }

  return NextResponse.json({ success: true });
}
