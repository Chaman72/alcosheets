"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle, AlertCircle } from "lucide-react";

const countryCodes = [
  { code: "+971", label: "🇦🇪 +971" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+966", label: "🇸🇦 +966" },
  { code: "+974", label: "🇶🇦 +974" },
  { code: "+965", label: "🇰🇼 +965" },
  { code: "+968", label: "🇴🇲 +968" },
  { code: "+973", label: "🇧🇭 +973" },
  { code: "+92", label: "🇵🇰 +92" },
  { code: "+880", label: "🇧🇩 +880" },
  { code: "+20", label: "🇪🇬 +20" },
];

interface FormState {
  name: string;
  email: string;
  phoneCode: string;
  phone: string;
  product: string;
  message: string;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phoneCode: "+971", phone: "", product: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    setForm({ ...form, [name]: value });
    setErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: form.phone ? `${form.phoneCode} ${form.phone}` : "" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.details ?? [data.error ?? "Something went wrong."]);
        return;
      }

      setSubmitted(true);
    } catch {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bg-white pt-28 pb-12 px-4 text-center border-b border-gray-200">
        <span className="text-yellow-500 text-sm uppercase tracking-widest font-semibold">Get In Touch</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-4">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Send us your enquiry and our team will get back to you within 24 hours.</p>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Office</h2>
            <div className="space-y-6 mb-10">
              {[
                { icon: MapPin, label: "Address", value: "Al Asmawi Warehouses Building, Saih Shuaib 4, Dubai Industrial City, Dubai, UAE" },
                { icon: Phone, label: "Phone", value: "+971 54 580 4047" },
                { icon: Mail, label: "Email", value: "info@alcosheets.com" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-semibold">{label}</p>
                    <p className="text-gray-500 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-gray-900 font-bold mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between"><span>Monday - Friday</span><span className="text-yellow-500">8:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-yellow-500">9:00 AM - 2:00 PM</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-green-500">Open 24 Hours</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <CheckCircle size={60} className="text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enquiry Sent!</h3>
                <p className="text-gray-500">Thank you! Our team will contact you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phoneCode: "+971", phone: "", product: "", message: "" }); }}
                  className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded font-semibold hover:bg-yellow-400 transition">
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Enquiry</h2>

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">
                    {errors.map((err, i) => (
                      <div key={i} className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle size={14} /> {err}
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-sm mb-1 block">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition" />
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm mb-1 block">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Phone Number</label>
                    <div className="flex gap-2">
                      <select name="phoneCode" value={form.phoneCode} onChange={handleChange}
                        className="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-2 py-3 text-sm focus:outline-none focus:border-yellow-500 transition w-32 shrink-0">
                        {countryCodes.map(({ code, label }) => (
                          <option key={code} value={code}>{label}</option>
                        ))}
                      </select>
                      <input name="phone" value={form.phone} onChange={handleChange} placeholder="50 000 0000" type="tel"
                        maxLength={10}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition" />
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Product Interest</label>
                    <select name="product" value={form.product} onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition">
                      <option value="">Select a product</option>
                      <option>ACP Panels</option>
                      <option>Fire Rated Panels</option>
                      <option>Mirror Finish Panels</option>
                      <option>Wooden Finish Panels</option>
                      <option>Cladding Sheets</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-1 block">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={4}
                      placeholder="Tell us about your project requirements..."
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition resize-none" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? "Sending..." : "Send Enquiry"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
