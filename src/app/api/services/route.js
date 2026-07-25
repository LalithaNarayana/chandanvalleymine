import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import ServicePage from "../../../models/ServicePage";

export async function GET(request) {
  try {
    await dbConnect();
    let page = await ServicePage.findOne();
    if (!page) {
      page = await ServicePage.create({
        hero: {
          backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
          badge: "PREMIUM CULTIVATION",
          heading: "Our Bespoke Services",
          description: "Comprehensive solutions for the modern sandalwood investor, combining sustainable plantation management with long-term wealth creation.",
          primaryButton: { text: "Explore Services", url: "#core-services" },
          secondaryButton: { text: "Contact Us", url: "/contact" }
        },
        statistics: [
          { title: "Acres Managed", value: "500+", icon: "Trees" },
          { title: "Happy Investors", value: "1200+", icon: "UserCheck" },
          { title: "Years Experience", value: "20+", icon: "TrendingUp" },
          { title: "Client Satisfaction", value: "98%", icon: "ShieldCheck" }
        ],
        coreServices: [
          {
            image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600",
            icon: "Trees",
            title: "Sandalwood Plantation",
            description: "Scientific cultivation with high-quality saplings, soil analysis, and long-term growth planning.",
            displayOrder: 1,
            features: ["Mysore Santalum Album saplings", "Rigorous soil chemistry checks", "Regular arborist inspections"],
            highlight: "Mysore Gold Standard"
          },
          {
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600",
            icon: "ShieldCheck",
            title: "Plot Management",
            description: "24x7 security, drip irrigation, manuring, weeding, and complete maintenance.",
            displayOrder: 2,
            features: ["24x7 guard patrol & CCTV cover", "Israeli drip nutrient supply", "Automated weed & pest controls"],
            highlight: "24x7 Security Cover"
          },
          {
            image: "https://images.unsplash.com/photo-1605000797439-75a1500dd707?q=80&w=600",
            icon: "Coins",
            title: "Harvest & Buyback",
            description: "Transparent harvest process with assured buyback support and fair market value.",
            displayOrder: 3,
            features: ["Government compliance clearance", "Contractual buyback guarantee", "Verified weight transparency"],
            highlight: "Assured Buyback Contracts"
          },
          {
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600",
            icon: "Compass",
            title: "Eco Farm Stays",
            description: "Weekend luxury organic farmhouse stays amidst nature with modern amenities.",
            displayOrder: 4,
            features: ["Luxury country farm cottages", "Exclusive clubhouse entries", "Organic fruit picking walks"],
            highlight: "Plot Owner Exclusive Perks"
          }
        ],
        additionalServices: [
          {
            icon: "Sparkles",
            title: "Investment Consultancy",
            description: "Expert advice to grow wealth through managed sandalwood forestry portfolios.",
            displayOrder: 1
          },
          {
            icon: "Grid",
            title: "Farm Plot Bookings",
            description: "Seamless digital and on-site booking. Select your preferred plot with ease.",
            displayOrder: 2
          },
          {
            icon: "Footprints",
            title: "Site Visits",
            description: "Guided tours of our lush plantations and farms. Experience the scale firsthand.",
            displayOrder: 3
          },
          {
            icon: "Lock",
            title: "Legal Assistance",
            description: "100% transparent and government-compliant documentation for secure property transfer.",
            displayOrder: 4
          }
        ],
        investmentProcess: [
          { stepNumber: "01", icon: "Grid", title: "Choose Plot", description: "Select your ideal plot from our verified plantation zones.", displayOrder: 1 },
          { stepNumber: "02", icon: "Trees", title: "Plantation", description: "We plant premium sandalwood saplings with scientific care.", displayOrder: 2 },
          { stepNumber: "03", icon: "ShieldCheck", title: "Maintenance", description: "Complete management including irrigation, manuring & security.", displayOrder: 3 },
          { stepNumber: "04", icon: "TrendingUp", title: "Growth Monitoring", description: "Regular inspection, reports, and updates on your plantation.", displayOrder: 4 },
          { stepNumber: "05", icon: "Zap", title: "Harvest", description: "Timely harvesting at maturity with expert supervision.", displayOrder: 5 },
          { stepNumber: "06", icon: "Coins", title: "Returns", description: "Assured buyback or market returns with transparency.", displayOrder: 6 }
        ],
        ctaSection: {
          backgroundImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
          heading: "Ready to Grow a Sustainable Legacy?",
          description: "Book a site visit today and explore how professionally managed sandalwood plantations create long-term value for your future.",
          buttonText: "Book a Site Visit Today",
          buttonUrl: "/contact"
        },
        visibility: {
          showHero: true,
          showStats: true,
          showCoreServices: true,
          showAdditionalServices: true,
          showProcess: true,
          showCTA: true
        },
        seo: {
          metaTitle: "Premium Sandalwood Services | Chandan Valley Farms",
          metaDescription: "Explore our professional managed sandalwood plantation services, scientific cultivation, secure plot monitoring, legal setups and transparent buybacks.",
          keywords: "sandalwood plantation, managed farmland, chandan valley farms, sustainable investment",
          ogImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200",
          twitterCard: "summary_large_image",
          canonicalUrl: "https://chandanvalleyfarms.com/services",
          schemaMarkup: ""
        }
      });
    }
    return NextResponse.json(page);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
