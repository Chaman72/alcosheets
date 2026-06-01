import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-[120px] md:text-[180px] font-extrabold text-yellow-500/10 leading-none select-none">404</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white -mt-8 mb-4">Page Not Found</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="bg-yellow-500 text-black px-8 py-3 rounded font-bold hover:bg-yellow-400 transition">
              Back to Home
            </Link>
            <Link href="/contact" className="border border-yellow-500 text-yellow-500 px-8 py-3 rounded font-bold hover:bg-yellow-500/10 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
