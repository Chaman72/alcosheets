import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Users, Factory, Globe } from "lucide-react";

const milestones = [
  { year: "2004", event: "Alco Sheets founded in Dubai, UAE" },
  { year: "2008", event: "Expanded manufacturing to 50,000 sq ft facility" },
  { year: "2012", event: "Achieved ISO 9001 certification" },
  { year: "2016", event: "Launched fire-rated panel product line" },
  { year: "2020", event: "Reached 50+ countries export milestone" },
  { year: "2024", event: "Introduced nano-coating & smart panel technology" },
];

const values = [
  { icon: CheckCircle, title: "Quality First", desc: "Every panel undergoes rigorous quality checks before leaving our facility." },
  { icon: Users, title: "Customer Focus", desc: "We build long-term partnerships by putting our clients first." },
  { icon: Factory, title: "Innovation", desc: "Continuously investing in R&D to bring next-gen solutions." },
  { icon: Globe, title: "Sustainability", desc: "Eco-friendly manufacturing processes and recyclable materials." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-white pt-28 pb-16 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">About Alco Sheets</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6 leading-tight">
              20 Years of <span className="text-yellow-500">Excellence</span> in ACP
            </h1>
            <p className="text-gray-500 leading-relaxed mb-4">
              Alco Sheets is a globally recognized manufacturer of Aluminium Composite Panels, serving architects, contractors, and builders across 50+ countries.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Founded in 2004, we have grown from a regional supplier to a world-class manufacturer with state-of-the-art production facilities and a commitment to innovation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["20+", "Years Experience"], ["5000+", "Projects Done"], ["50+", "Countries"], ["200+", "Products"]].map(([val, label]) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <div className="text-3xl font-extrabold text-yellow-500">{val}</div>
                <div className="text-gray-500 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Our Values</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">What Drives Us</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-yellow-500/50 hover:shadow-md transition">
                <Icon size={32} className="text-yellow-500 mb-4" />
                <h3 className="text-gray-900 font-bold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Our Journey</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Company Milestones</h2>
          </div>
          <div className="relative border-l-2 border-yellow-500/30 pl-8 space-y-10">
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-[41px] w-4 h-4 bg-yellow-500 rounded-full border-4 border-white" />
                <span className="text-yellow-500 font-bold text-sm">{m.year}</span>
                <p className="text-gray-600 mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
