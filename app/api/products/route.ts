import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "products.json");

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
  sortOrder: number;
  createdAt: string;
}

let cache: Product[] | null = null;

function readProducts(): Product[] {
  if (cache) return cache;
  if (!fs.existsSync(FILE)) return [];
  try {
    cache = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    return cache!;
  } catch { return []; }
}

function writeProducts(data: Product[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
  cache = data;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20"));
  const category = searchParams.get("category");
  const search = searchParams.get("search")?.toLowerCase();
  const featured = searchParams.get("featured");

  let products = readProducts().filter((p) => p.isActive);

  if (category) products = products.filter((p) => p.category?.slug === category);
  if (featured === "true") products = products.filter((p) => p.isFeatured);
  if (search) products = products.filter((p) =>
    p.name.toLowerCase().includes(search) || p.description?.toLowerCase().includes(search)
  );

  products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || a.sortOrder - b.sortOrder);

  const total = products.length;
  const data = products.slice((page - 1) * limit, page * limit);

  return NextResponse.json({
    data,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, category, thickness, finish, isFeatured } = body;

  if (!name?.trim() || !category?.trim()) {
    return NextResponse.json({ error: "Name and category are required." }, { status: 400 });
  }

  const products = readProducts();
  const maxId = products.reduce((m, p) => Math.max(m, p.id), 0);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const product: Product = {
    id: maxId + 1,
    name: name.trim(),
    slug,
    description: description?.trim() ?? "",
    category: { name: category.trim(), slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    thickness: thickness?.trim() ?? "4mm",
    finish: finish?.trim() ?? "",
    isFeatured: isFeatured ?? false,
    isActive: true,
    sortOrder: maxId + 1,
    createdAt: new Date().toISOString(),
  };

  products.push(product);
  writeProducts(products);

  return NextResponse.json({ success: true, product }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const products = readProducts().filter((p) => p.id !== id);
  writeProducts(products);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const { id, isFeatured, isActive } = await req.json();
  const products = readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (isFeatured !== undefined) products[idx].isFeatured = isFeatured;
  if (isActive !== undefined) products[idx].isActive = isActive;
  writeProducts(products);
  return NextResponse.json({ success: true });
}
