import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.upsert({
    where: { email: "admin@xyzpanels.com" },
    update: {},
    create: { name: "Admin", email: "admin@xyzpanels.com", password: hashedPassword, role: "ADMIN" },
  });
  console.log("✅ Admin user created: admin@xyzpanels.com");

  // Categories
  const categories = [
    { name: "ACP Panels", slug: "acp-panels", description: "Standard aluminium composite panels" },
    { name: "Fire Rated", slug: "fire-rated", description: "FR core certified panels" },
    { name: "Mirror & Metallic", slug: "mirror-metallic", description: "Reflective surface panels" },
    { name: "Wood & Stone", slug: "wood-stone", description: "Natural look digital print panels" },
    { name: "Special Finish", slug: "special-finish", description: "Nano, anti-bacterial & special coatings" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  console.log("✅ Categories seeded");

  // Products
  const acpCategory = await prisma.category.findUnique({ where: { slug: "acp-panels" } });
  const frCategory = await prisma.category.findUnique({ where: { slug: "fire-rated" } });

  if (acpCategory) {
    await prisma.product.upsert({
      where: { slug: "standard-acp-panel" },
      update: {},
      create: {
        slug: "standard-acp-panel",
        name: "Standard ACP Panel",
        description: "Premium quality aluminium composite panel with PVDF coating.",
        thickness: "4mm",
        size: "1220 x 2440mm",
        finish: "PVDF Coated",
        tag: "Bestseller",
        inStock: true,
        isFeatured: true,
        categoryId: acpCategory.id,
        specs: {
          create: [
            { specKey: "Weight", specValue: "5.5 kg/m²" },
            { specKey: "Fire Rating", specValue: "Class B1" },
            { specKey: "Warranty", specValue: "10 Years" },
          ],
        },
      },
    });
  }

  if (frCategory) {
    await prisma.product.upsert({
      where: { slug: "fire-rated-fr-panel" },
      update: {},
      create: {
        slug: "fire-rated-fr-panel",
        name: "Fire Rated FR Panel",
        description: "FR core panels meeting international fire safety standards.",
        thickness: "4mm",
        size: "1220 x 2440mm",
        finish: "PVDF Coated",
        tag: "Fire Safe",
        inStock: true,
        isFeatured: true,
        categoryId: frCategory.id,
      },
    });
  }
  console.log("✅ Products seeded");

  // Testimonials
  const testimonials = [
    { name: "Ahmed Al-Rashid", company: "Al Rashid Construction", role: "Project Manager", message: "XYZ Panels delivered exceptional quality on our Dubai project. The fire-rated panels exceeded our expectations.", rating: 5 },
    { name: "Sarah Johnson", company: "Johnson Architects", role: "Lead Architect", message: "The mirror finish panels transformed our building facade. Outstanding product and excellent customer support.", rating: 5 },
    { name: "Raj Patel", company: "Patel Builders", role: "Director", message: "We have been using XYZ Panels for 5 years. Consistent quality, on-time delivery, and great pricing.", rating: 5 },
  ];

  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t }).catch(() => {});
  }
  console.log("✅ Testimonials seeded");

  // Settings
  const settings = [
    { key: "site_name", value: "XYZ Panels", group: "general" },
    { key: "site_email", value: "info@xyzpanels.com", group: "general" },
    { key: "site_phone", value: "+971 50 000 0000", group: "general" },
    { key: "site_address", value: "123 Industrial Area, Al Quoz, Dubai, UAE", group: "general" },
    { key: "whatsapp_number", value: "971500000000", group: "social" },
    { key: "meta_title", value: "XYZ Panels | Premium Aluminium Composite Panels", group: "seo" },
    { key: "meta_description", value: "World-class ACP panels engineered for durability, aesthetics, and performance.", group: "seo" },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log("✅ Settings seeded");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => { console.error("❌ Seed error:", String(e).replace(/[\r\n]/g, " ")); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
