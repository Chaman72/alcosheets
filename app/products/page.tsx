import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

const products = [
  { name: "Standard ACP Panel", category: "ACP Panels", thickness: "4mm", size: "1220 x 2440mm", finish: "PVDF Coated", tag: "Bestseller", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80" },
  { name: "Fire Rated FR Panel", category: "Fire Rated", thickness: "4mm", size: "1220 x 2440mm", finish: "PVDF Coated", tag: "Fire Safe", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { name: "Mirror Silver Panel", category: "Mirror & Metallic", thickness: "4mm", size: "1220 x 2440mm", finish: "Mirror", tag: "Premium", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80" },
  { name: "Brushed Gold Panel", category: "Mirror & Metallic", thickness: "4mm", size: "1220 x 2440mm", finish: "Brushed", tag: "Premium", img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" },
  { name: "Wooden Oak Finish", category: "Wood & Stone", thickness: "4mm", size: "1220 x 2440mm", finish: "Digital Print", tag: "Trending", img: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80" },
  { name: "Marble Stone Finish", category: "Wood & Stone", thickness: "4mm", size: "1220 x 2440mm", finish: "Digital Print", tag: "Trending", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { name: "Nano Self-Clean Panel", category: "Special Finish", thickness: "4mm", size: "1220 x 2440mm", finish: "Nano Coating", tag: "New", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" },
  { name: "Anti-Bacterial Panel", category: "Special Finish", thickness: "4mm", size: "1220 x 2440mm", finish: "Special Coat", tag: "New", img: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80" },
];

const tagColors: Record<string, string> = {
  Bestseller: "bg-yellow-500 text-black",
  "Fire Safe": "bg-red-500 text-white",
  Premium: "bg-purple-600 text-white",
  Trending: "bg-green-600 text-white",
  New: "bg-blue-500 text-white",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-white pt-28 pb-16 px-4 text-center border-b border-gray-200">
        <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Our Catalog</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">Our Products</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Explore our wide range of premium ACP panels engineered for every architectural need.</p>
      </section>

      {/* Products Grid */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.name} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-yellow-500/50 hover:shadow-md transition group">
                <div className="relative h-48 w-full">
                  <Image
                    src={p.img}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {p.tag && (
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded z-10 ${tagColors[p.tag] || "bg-gray-200 text-gray-700"}`}>
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-gray-900 font-bold text-lg mb-3 group-hover:text-yellow-500 transition">{p.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                    <div><span className="text-gray-400">Thickness:</span> <span className="text-gray-700">{p.thickness}</span></div>
                    <div><span className="text-gray-400">Size:</span> <span className="text-gray-700">{p.size}</span></div>
                    <div><span className="text-gray-400">Finish:</span> <span className="text-gray-700">{p.finish}</span></div>
                    <div><span className="text-gray-400">Category:</span> <span className="text-gray-700">{p.category}</span></div>
                  </div>
                  <Link href="/contact" className="block text-center bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 py-2 rounded text-sm font-semibold hover:bg-yellow-500 hover:text-black transition">
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
