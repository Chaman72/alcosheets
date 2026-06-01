"use client";
import { useInView, useCounter } from "@/hooks";

const stats = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 5000, suffix: "+", label: "Projects Completed" },
  { value: 50, suffix: "+", label: "Countries Served" },
  { value: 200, suffix: "+", label: "Product Variants" },
];

function StatItem({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCounter(value, 2000, start);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-black">
        {count}{suffix}
      </div>
      <div className="text-black/70 font-medium mt-1 text-sm uppercase tracking-wide">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const { ref, inView } = useInView(0.3);

  return (
    <section ref={ref} className="bg-yellow-500 py-14">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <StatItem key={s.label} {...s} start={inView} />
        ))}
      </div>
    </section>
  );
}
