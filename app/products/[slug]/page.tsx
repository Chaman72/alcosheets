import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, CheckCircle, Star } from "lucide-react";
import type { Metadata } from "next";

const productImages: Record<string, string[]> = {
  default: [
    "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return { title: name, description: `${name} — Premium ACP Panel by XYZ Panels. Technical specs, finishes, and pricing.` };
}

const specs = [
  ["Thickness", "4mm (0.3mm + 3.4mm core + 0.3mm)"],
  ["Standard Size", "1220mm × 2440mm"],
  ["Core Material", "Mineral Filled / FR Core"],
  ["Coating", "PVDF (Polyvinylidene Fluoride)"],
  ["Weight", "5.5 kg/m²"],
  ["Bending Strength", "≥ 100 N/mm²"],
  ["Wind Load Resistance", "≥ 2000 Pa"],
  ["Temperature Range", "-50°C to +80°C"],
  ["Fire Rating", "Class B1 (EN 13501)"],
  ["Warranty", "10 Years"],
];

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const images = productImages[slug] ?? productImages.default;

  return (
    <>
      <Navbar />

      <section className="bg-black pt-28 pb-8 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb items={[{ label: "Products", href: "/products" }, { label: name }]} />
        </div>
      </section>

      <section className="bg-gray-950 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition mb-8 text-sm">
            <ArrowLeft size={16} /> Back to Products
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Gallery */}
            <div>
              <div className="relative h-80 w-full rounded-2xl overflow-hidden mb-4">
                <Image
                  src={images[0]}
                  alt={name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative h-20 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-yellow-500/50 transition">
                    <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="25vw" />
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">Bestseller</span>
                <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded">In Stock</span>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2">{name}</h1>
              <div className="flex items-center gap-2 mb-4">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />)}
                <span className="text-gray-400 text-sm">(48 reviews)</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Premium quality aluminium composite panel with PVDF coating for superior weather resistance and long-lasting color retention. Ideal for exterior facades, signage, and interior applications.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[["Thickness", "4mm"], ["Size", "1220×2440mm"], ["Finish", "PVDF Coated"], ["Core", "Mineral Filled"]].map(([k, v]) => (
                  <div key={k} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                    <span className="text-gray-600 text-xs block">{k}</span>
                    <span className="text-white font-semibold text-sm">{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                {["10 Year warranty on coating", "ISO 9001 certified manufacturing", "Available in 200+ colors", "Custom sizes available"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-yellow-500 shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Link href="/contact" className="flex-1 bg-yellow-500 text-black py-3 rounded-xl font-bold text-center hover:bg-yellow-400 transition">
                  Request Quote
                </Link>
                <button className="flex items-center gap-2 border border-gray-700 text-gray-300 px-5 py-3 rounded-xl hover:border-yellow-500 hover:text-yellow-500 transition text-sm font-medium">
                  <Download size={16} /> Brochure
                </button>
              </div>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-12">
            <div className="px-6 py-4 border-b border-gray-800">
              <h2 className="text-white font-bold text-lg">Technical Specifications</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {specs.map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 px-6 py-3 hover:bg-gray-800/30 transition">
                  <span className="text-gray-500 text-sm">{key}</span>
                  <span className="text-gray-200 text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Fire Rated Panel", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80" },
                { name: "Mirror Finish", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80" },
                { name: "Wooden Oak", img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80" },
                { name: "Brushed Gold", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80" },
              ].map((p) => (
                <Link key={p.name} href={`/products/${p.name.toLowerCase().replace(/ /g, "-")}`}
                  className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-500/50 transition group">
                  <div className="relative h-24 w-full">
                    <Image src={p.img} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="25vw" />
                  </div>
                  <p className="text-white text-sm font-medium group-hover:text-yellow-500 transition p-3">{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
