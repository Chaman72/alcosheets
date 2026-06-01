import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

interface Credential {
  email: string;
  password: string;
  name: string;
}

function getCredentials(): Credential[] {
  const filePath = path.join(process.cwd(), "data", "credentials.json");
  try { return JSON.parse(fs.readFileSync(filePath, "utf-8")); } catch { return []; }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const { success } = rateLimit(ip, 5, 300_000);
  if (!success) return NextResponse.json({ error: "Too many login attempts. Try again in 5 minutes." }, { status: 429 });

  let body: { email?: string; password?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid body." }, { status: 400 }); }

  if (!body.email || !body.password)
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });

  const users = getCredentials();
  const user = users.find((u) => u.email.toLowerCase() === body.email!.toLowerCase().trim());

  if (!user || !(await bcrypt.compare(body.password, user.password)))
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });

  const token = signToken({ userId: 1, email: user.email, role: "admin" });

  const res = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  res.cookies.set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
