import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import AboutPage from "../../../models/AboutPage";

const DEFAULT_ABOUT_DATA = {
  hero: {
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    heading: "The Legacy of Sandalwood",
    description: "We are committed to creating sustainable investment opportunities through professionally managed sandalwood plantations that combine nature, long-term value, and responsible growth.",
    btnText: "Explore Projects",
    btnUrl: "#story",
    secondaryBtnText: "Watch Video",
    secondaryBtnUrl: "",
  },
  ourStory: {
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop",
    smallTitle: "HERITAGE & EXCELLENCE",
    heading: "Our Story",
    description: "Chandan Valley Farms was founded to bridge the gap between premium land ownership and high-yielding sustainable forestry. Sandalwood has been revered for centuries as one of India's most prized natural treasures. We provide a transparent, fully-managed pathway to co-owning land that secures your financial legacy while actively restoring regional green cover.\n\nBy blending traditional farming wisdom with modern agricultural science, our expert agronomists select certified Santalum Album saplings and cultivate them alongside host trees for optimum growth. With 24/7 smart security, drip-network controls, and transparent legal packaging, your farm plot is safe and compounding in value.",
    badgeTitle: "15+ Years",
    badgeSubtitle: "OF AGRICULTURAL EXCELLENCE",
  },
  founder: {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    quote: "At Chandan Valley Farms, we don't just plant trees; we cultivate a legacy. Our focus is on the long-term health of our soil and the enduring prosperity of our partners. We invite you to be part of an investment that lives and breathes.",
    name: "Mr. Aditya Pardhan",
    designation: "Founder & Managing Director",
  },
  coreValuesSection: {
    title: "Our Core Values",
  },
  coreValues: [
    {
      title: "Integrity",
      description: "We uphold absolute transparency and clarity in land titles, registry, and contracts.",
      icon: "ShieldCheck",
    },
    {
      title: "Sustainability",
      description: "We employ eco-friendly farming practices to conserve biodiversity and soil health.",
      icon: "Leaf",
    },
    {
      title: "Excellence",
      description: "Our botany and agronomy experts ensure unmatched quality in plantation management.",
      icon: "Award",
    },
    {
      title: "Transparency",
      description: "Periodic digital growth updates and real-time support ensure complete peace of mind.",
      icon: "Eye",
    },
  ],
  journeySection: {
    title: "The Journey",
    subtitle: "SANDALWOOD OF GROWTH",
  },
  journeyTimeline: [
    {
      year: "2015",
      title: "Inception",
      description: "Founded with the acquisition of our first 50 acres. Laid the foundation for professional sandalwood farming.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2018",
      title: "Expansion & Tech Integration",
      description: "Expanded our plantation footprint to 150 acres and introduced automated drip irrigation systems.",
      image: "https://images.unsplash.com/photo-1463123081488-729f99c905b4?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2021",
      title: "Advanced Agronomy",
      description: "Collaborated with leading forestry institutes to implement scientific host-tree management protocols.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
    },
    {
      year: "2024",
      title: "A Modern Legacy",
      description: "Managing over 300+ acres of sandalwood plots, catering to a growing community of 500+ satisfied co-owners.",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop",
    },
  ],
  whyChooseUs: {
    smallTitle: "INVESTOR BENEFITS",
    heading: "Why Choose Us?",
    checklist: [
      { title: "100% Legal Documentation", description: "Individual registration with clear title deed, RERA, and town planning compliance." },
      { title: "Expert Plantation Management", description: "12-year end-to-end management by qualified agronomists and botanists." },
      { title: "High ROI Potential", description: "Mysore Sandalwood offers compounding long-term tax-free agricultural returns." },
      { title: "Eco-Friendly Investment", description: "Promoting biodiversity, local employment, and reducing the environmental footprint." },
      { title: "Professional Maintenance", description: "24/7 security surveillance, automated Israeli drip irrigation, and fencing." },
      { title: "Transparent Process", description: "Detailed progress tracking and periodic video/photo updates of your farm plot." },
    ],
    images: [
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1463123081488-729f99c905b4?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop"
    ],
  },
  cta: {
    heading: "Join the Verdant Legacy",
    description: "Book your premium sandalwood farm plot today and secure a beautiful, sustainable investment for generations.",
    primaryBtnText: "Book Site Visit",
    primaryBtnUrl: "/contact",
  },
  visibility: {
    showHero: true,
    showStory: true,
    showMissionVision: true,
    showFounder: true,
    showCoreValues: true,
    showTimeline: true,
    showWhyChooseUs: true,
    showCTA: true,
  }
};

export async function GET() {
  try {
    await dbConnect();
    let aboutData = await AboutPage.findOne();
    if (!aboutData) {
      aboutData = await AboutPage.create(DEFAULT_ABOUT_DATA);
    }
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    let aboutData = await AboutPage.findOne();
    if (!aboutData) {
      aboutData = new AboutPage(body);
    } else {
      Object.assign(aboutData, body);
    }
    await aboutData.save();
    return NextResponse.json(aboutData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
