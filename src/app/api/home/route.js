import { NextResponse } from "next/server";
import dbConnect from "../../../lib/db";
import HomePage from "../../../models/HomePage";
import Project from "../../../models/Project";

const DEFAULT_HOME_DATA = {
  hero: {
    bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    bgImages: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop",
    ],
    smallHeading: "RERA & Town Planning Approved",
    mainHeading: "Own Your Premium Sandalwood Farm Plot",
    description: "Invest in nature with professionally managed sandalwood plantations that deliver high long-term ROI, tax-free agricultural returns, and generational land security.",
    primaryBtnText: "Book Site Visit",
    primaryBtnUrl: "/contact",
    secondaryBtnText: "Explore Projects",
    secondaryBtnUrl: "/projects",
  },
  stats: [
    { title: "Sandalwood Saplings", value: "40+", icon: "Trees", sortOrder: 1 },
    { title: "Compounding Growth", value: "10-12x", icon: "TrendingUp", sortOrder: 2 },
    { title: "Tax-Free ROI Potential", value: "₹2-3 Cr", icon: "Coins", sortOrder: 3 },
  ],
  trustCards: [
    {
      title: "Premium Plantation",
      description: "High-yielding Mysore Sandalwood (Santalum Album) planted alongside host trees using automated precision agronomy.",
      icon: "Trees",
    },
    {
      title: "Secure Investment",
      description: "100% clear legal title, individual clear deed registration, fencing, and round-the-clock security monitoring.",
      icon: "ShieldCheck",
    },
    {
      title: "High ROI Potential",
      description: "Sandalwood is renowned as 'Liquid Gold', offering exponential capital growth and tax-free agricultural returns.",
      icon: "TrendingUp",
    },
  ],
  aboutPreview: {
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=800&auto=format&fit=crop",
    smallTitle: "Heritage & Excellence",
    heading: "Nurturing Valued Sandalwood Legacies Across Generations",
    description: "Chandan Valley Farms offers ultra-premium managed farmland that matches secure asset class attributes with ecological sustainability. Our botanists ensure optimal plantation conditions to guarantee premium heartwood yields.",
    mission: "To deliver transparent, high-yielding green investments that empower our clients while contributing to organic agro-forestry.",
    vision: "To become the gold standard of managed farmland in India, balancing ecology with wealth generation.",
    btnText: "Learn More About Us",
    btnUrl: "/about",
  },
  whyInvest: {
    smallTitle: "Sustainable Returns",
    heading: "Why Invest in Sandalwood?",
  },
  investmentBenefits: [
    {
      icon: "Leaf",
      title: "Nature Investment",
      description: "Own physical fertile land with lush green cover while reducing your carbon footprint through sustainable forestry."
    },
    {
      icon: "Coins",
      title: "Passive Income",
      description: "Enjoy inter-crop yields (sandalwood + timber/fruits) providing dual cash flows without day-to-day effort."
    },
    {
      icon: "Globe",
      title: "Eco Friendly",
      description: "Enrich soil biodiversity, create wildlife corridors, and promote organic agro-forestry for future generations."
    },
    {
      icon: "Lock",
      title: "Secure Asset",
      description: "Land ownership is an inflation-proof tangible asset backed by legal clear-title deed registrations."
    },
    {
      icon: "BarChart3",
      title: "Growing Demand",
      description: "Global demand for sandalwood oil and heartwood far exceeds supply, ensuring premium pricing at harvest."
    },
    {
      icon: "Sparkles",
      title: "Long-Term Appreciation",
      description: "Benefit from compounding asset growth: escalating land value combined with mature heartwood valuation."
    }
  ],
  featuredProject: {
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop",
    title: "Chandan Valley Farms - Phase 1",
    tagline: "Ultra-Premium Managed Sandalwood Estate",
    location: "Chikkaballapur Highway, Bengaluru North Extension",
    area: "28 Acres",
    plotSize: "5,000 sq. ft. to 10,000 sq. ft.",
    price: "₹24.99 Lakhs onwards",
    expectedRoi: "₹2 - 3 Cr in 10-12 Years",
    btnText: "Schedule Site Visit",
    btnUrl: "/contact",
  },
  highlightsSection: {
    smallTitle: "World-Class Amenities",
    heading: "Estate Highlights & Infrastructure",
  },
  highlights: [
    { icon: "Grid", title: "196 Premium Plots", subtitle: "RERA & Town Planning Compliant Layout", sortOrder: 1 },
    { icon: "Compass", title: "28 Acres Total Estate", subtitle: "Spacious Green Gated Sanctuary", sortOrder: 2 },
    { icon: "Droplets", title: "Drip Irrigation", subtitle: "Fully Automated Israeli Drip Networks", sortOrder: 3 },
    { icon: "Road", title: "Internal Roads", subtitle: "30ft Wide Blacktop Roads with Solar Lights", sortOrder: 4 },
    { icon: "Zap", title: "Electricity Network", subtitle: "Underground Power & Solar Streetlights", sortOrder: 5 },
    { icon: "GlassWater", title: "Water Supply", subtitle: "24/7 Borewell & Water Harvesting Tanks", sortOrder: 6 },
    { icon: "Footprints", title: "Walking & Jogging Track", subtitle: "1.5 km Tree-Lined Nature Promenade", sortOrder: 7 },
    { icon: "UserCheck", title: "Professional Management", subtitle: "12-Year End-to-End Plantation Maintenance", sortOrder: 8 },
  ],
  processSection: {
    smallTitle: "Step-by-Step",
    heading: "Our Investment Process",
  },
  processSteps: [
    { step: "01", title: "Choose Plot", description: "Browse master plan layout, select your preferred plot size & direction.", details: "Choose from 5,000 to 10,000 sq. ft. prime units with optimal solar orientation." },
    { step: "02", title: "Site Visit", description: "Experience the pristine estate firsthand with our VIP luxury transport.", details: "Guided tour by senior agronomy experts and legal documentation officers." },
    { step: "03", title: "Documentation", description: "Transparent legal agreement with full title check and clear ownership deed.", details: "Government registered sale deed with 100% legal clearance & encapsulation." },
    { step: "04", title: "Ownership", description: "Receive your plot passbook, live updates, and relaxed passive ROI.", details: "Track tree growth via mobile updates, visit your farm anytime." },
  ],
  testimonials: [
    {
      name: "Rajesh V. Sharma",
      role: "Senior Tech Executive",
      location: "Bengaluru",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "Investing in Chandan Valley Farms has been my best wealth decision. The site management is world-class, and seeing 40+ healthy sandalwood trees on my plot is deeply satisfying.",
      plotOwned: "Plot #42 (10,000 sq.ft)",
    },
    {
      name: "Dr. Ananya Hegde",
      role: "Cardiologist",
      location: "Mysore",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "The legal clarity and transparent execution amazed me. Everything from drip lines to security fence is meticulously maintained. It's true peace of mind.",
      plotOwned: "Plot #18 (5,000 sq.ft)",
    },
    {
      name: "Vikram & Neha Reddy",
      role: "NRI Investors",
      location: "Singapore",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
      rating: 5,
      quote: "Living overseas, we needed a completely hands-off green asset. Chandan Valley's team provides periodic photo/video updates on tree health. Exceptional professionalism!",
      plotOwned: "Plot #88 (10,000 sq.ft)",
    },
  ],
  visibility: {
    showHero: true,
    showStats: true,
    showTrust: true,
    showAbout: true,
    showWhyInvest: true,
    showFeatured: true,
    showHighlights: true,
    showProcess: true,
    showTestimonials: true,
    showBlogs: true,
  }
};

export async function GET() {
  try {
    await dbConnect();
    let homeData = await HomePage.findOne();
    if (!homeData) {
      homeData = await HomePage.create(DEFAULT_HOME_DATA);
    }

    const result = homeData.toObject();

    // If admin has selected a project to feature, pull its live data in so the
    // Home page always reflects the current details of that project.
    if (homeData.featuredProjectId) {
      const project = await Project.findById(homeData.featuredProjectId);
      if (project) {
        result.featuredProject = {
          image: project.image || "",
          title: project.title || "",
          tagline: project.tagline || "",
          location: project.location || "",
          area: project.area || "",
          plotSize: project.plotSize || "",
          price: project.price || "",
          expectedRoi: project.expectedRoi || "",
          btnText: project.btnText || "Schedule Site Visit",
          btnUrl: project.btnUrl || "/contact",
          slug: project.slug || "",
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    if (body.featuredProjectId === "") body.featuredProjectId = null;
    let homeData = await HomePage.findOne();
    if (!homeData) {
      homeData = new HomePage(body);
    } else {
      Object.assign(homeData, body);
    }
    await homeData.save();
    return NextResponse.json(homeData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
