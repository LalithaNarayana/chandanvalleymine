import mongoose from "mongoose";

const HomePageSchema = new mongoose.Schema(
  {
    hero: {
      bgImage: { type: String, default: "" },
      bgImages: [{ type: String }],
      smallHeading: { type: String, default: "" },
      mainHeading: { type: String, default: "" },
      description: { type: String, default: "" },
      primaryBtnText: { type: String, default: "" },
      primaryBtnUrl: { type: String, default: "" },
      secondaryBtnText: { type: String, default: "" },
      secondaryBtnUrl: { type: String, default: "" },
    },
    stats: [
      {
        title: { type: String, default: "" },
        value: { type: String, default: "" },
        icon: { type: String, default: "" },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    trustCards: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    aboutPreview: {
      image: { type: String, default: "" },
      smallTitle: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      mission: { type: String, default: "" },
      vision: { type: String, default: "" },
      btnText: { type: String, default: "" },
      btnUrl: { type: String, default: "" },
    },
    whyInvest: {
      smallTitle: { type: String, default: "Sustainable Returns" },
      heading: { type: String, default: "Why Invest in Sandalwood?" },
    },
    investmentBenefits: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    featuredProjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", default: null },
    featuredProject: {
      image: { type: String, default: "" },
      title: { type: String, default: "" },
      tagline: { type: String, default: "" },
      location: { type: String, default: "" },
      area: { type: String, default: "" },
      plotSize: { type: String, default: "" },
      price: { type: String, default: "" },
      expectedRoi: { type: String, default: "" },
      btnText: { type: String, default: "" },
      btnUrl: { type: String, default: "" },
    },
    highlightsSection: {
      smallTitle: { type: String, default: "World-Class Amenities" },
      heading: { type: String, default: "Estate Highlights & Infrastructure" },
    },
    highlights: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        sortOrder: { type: Number, default: 0 },
      },
    ],
    processSection: {
      smallTitle: { type: String, default: "Step-by-Step" },
      heading: { type: String, default: "Our Investment Process" },
    },
    processSteps: [
      {
        step: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        details: { type: String, default: "" },
      },
    ],
    testimonials: [
      {
        name: { type: String, default: "" },
        role: { type: String, default: "" },
        location: { type: String, default: "" },
        avatar: { type: String, default: "" },
        rating: { type: Number, default: 5 },
        quote: { type: String, default: "" },
        plotOwned: { type: String, default: "" },
      },
    ],
    visibility: {
      showHero: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true },
      showTrust: { type: Boolean, default: true },
      showAbout: { type: Boolean, default: true },
      showWhyInvest: { type: Boolean, default: true },
      showFeatured: { type: Boolean, default: true },
      showHighlights: { type: Boolean, default: true },
      showProcess: { type: Boolean, default: true },
      showTestimonials: { type: Boolean, default: true },
      showBlogs: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.HomePage || mongoose.model("HomePage", HomePageSchema);
