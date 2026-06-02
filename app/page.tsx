"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StatsSection from "@/components/ui/StatsSection";
import Newsletter from "@/components/ui/Newsletter";
import Link from "next/link";
import Image from "next/image";
import { Shield, Award, Globe, Zap, ChevronRight, CheckCircle, Star, ArrowRight } from "lucide-react";

const heroSlides = [
  {
    img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80",
    tag: "Premium ACP Solutions",
    title: "Elevate Your",
    highlight: "Architecture",
    sub: "World-class Aluminium Composite Panels engineered for durability, aesthetics, and performance.",
  },
  {
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80",
    tag: "Fire Rated & Safe",
    title: "Built for",
    highlight: "Safety",
    sub: "FR core panels meeting international fire safety standards for high-rise buildings.",
  },
  {
    img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80",
    tag: "Global Export",
    title: "Trusted in",
    highlight: "50+ Countries",
    sub: "Delivering premium facade solutions to architects and builders worldwide.",
  },
];

const products = [
  { name: "ACP Panels", desc: "High-quality aluminium composite panels for modern facades.", emoji: "🏗️" },
  { name: "Fire Rated Panels", desc: "FR core panels meeting international fire safety standards.", emoji: "🔥" },
  { name: "Mirror Finish", desc: "Reflective surface panels for premium architectural designs.", emoji: "✨" },
  { name: "Cladding Sheets", desc: "Durable exterior cladding for commercial & residential use.", emoji: "🏢" },
  { name: "Wooden Finish", desc: "Natural wood-look ACP panels for elegant interiors.", emoji: "🪵" },
];

const features = [
  { icon: Shield, title: "ISO Certified", desc: "All products meet international quality standards." },
  { icon: Award, title: "Award Winning", desc: "Recognized globally for design and innovation." },
  { icon: Globe, title: "Worldwide Export", desc: "Exporting to 50+ countries across the globe." },
  { icon: Zap, title: "Fast Delivery", desc: "On-time delivery with efficient logistics." },
];

const reviews = [
  { name: "Ahmed Al Mansoori", role: "Architect, Dubai", rating: 5, text: "Exceptional quality panels. Our facade project turned out stunning. Highly recommend Alco Sheets!" },
  { name: "Priya Sharma", role: "Interior Designer, India", rating: 5, text: "The wooden finish panels look incredibly realistic. Clients love the premium feel." },
  { name: "James Okafor", role: "Contractor, Nigeria", rating: 5, text: "Fast delivery, great packaging, and top-notch quality. Will order again for our next project." },
  { name: "Liu Wei", role: "Developer, China", rating: 4, text: "Mirror finish panels added a wow factor to our commercial building. Great product." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const current = heroSlides[slide];

  return (
    <>
      <Navbar />

      {/* Hero Slider */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={current.img}
              alt={current.tag}
              fill
              priority={slide === 0}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-6 backdrop-blur-sm">
                {current.tag}
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                {current.title} <span className="text-yellow-400">{current.highlight}</span>
              </h1>
              <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                {current.sub}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products" className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center gap-2 justify-center shadow-lg shadow-yellow-500/30">
                  Explore Products <ChevronRight size={18} />
                </Link>
                <Link href="/contact" className="border border-white/40 text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 backdrop-blur-sm transition">
                  Get Free Quote
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? "w-8 bg-yellow-400" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>

        {/* Slide Arrows */}
        <button
          onClick={() => setSlide((s) => (s - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition"
        >‹</button>
        <button
          onClick={() => setSlide((s) => (s + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition"
        >›</button>
      </section>

      <StatsSection />

      {/* Products */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Our Range</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Premium Products</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {products.map((p) => (
              <motion.div
                key={p.name}
                variants={fadeUp}
                whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(234,179,8,0.15)" }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-yellow-500/50 transition group cursor-pointer"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2 group-hover:text-yellow-500 transition">{p.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{p.desc}</p>
                <span className="inline-flex items-center gap-1 text-yellow-500 text-sm font-semibold group-hover:gap-2 transition-all">
                  Learn more <ArrowRight size={14} />
                </span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="text-center mt-10"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <Link href="/products" className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 transition shadow-lg shadow-yellow-500/20">
              View All Products <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white dark:bg-gray-950 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">Built on Trust & Quality</h2>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ scale: 1.04 }}
                className="text-center p-6 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-2xl hover:border-yellow-500/50 hover:shadow-lg transition"
              >
                <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-yellow-500" />
                </div>
                <h3 className="text-gray-900 dark:text-white font-bold mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Ratings & Reviews */}
      <section className="bg-gray-50 dark:bg-gray-900 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
          >
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Customer Reviews</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-500 fill-yellow-500" />)}
              <span className="ml-2 text-gray-500 dark:text-gray-400 text-sm">4.9 / 5 based on 200+ reviews</span>
            </div>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          >
            {reviews.map((r) => (
              <motion.div
                key={r.name}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-yellow-500/40 hover:shadow-md transition"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, i) => <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">"{r.text}"</p>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <motion.section
        className="bg-yellow-500 py-16 px-4 text-center"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">Ready to Start Your Project?</h2>
        <p className="text-black/70 mb-8 text-lg">Get a free consultation and quote from our experts today.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="bg-black text-yellow-500 px-8 py-3 rounded-lg font-bold hover:bg-gray-900 transition shadow-lg">
            Send Enquiry
          </Link>
          <Link href="/products" className="border-2 border-black text-black px-8 py-3 rounded-lg font-bold hover:bg-black/10 transition">
            Browse Products
          </Link>
        </div>
      </motion.section>

      <Newsletter />

      {/* Certifications */}
      <motion.section
        className="bg-gray-50 dark:bg-gray-900 py-12 px-4"
        initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm uppercase tracking-widest mb-6">Certified & Compliant</p>
          <div className="flex flex-wrap justify-center gap-4">
            {["ISO 9001:2015", "ISO 14001", "ASTM E84", "EN 13501", "SGS Certified"].map((cert) => (
              <div key={cert} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full shadow-sm hover:border-yellow-500/50 transition">
                <CheckCircle size={14} className="text-yellow-500" />
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}
