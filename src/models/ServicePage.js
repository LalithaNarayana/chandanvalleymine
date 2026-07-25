import mongoose from "mongoose";

const ServicePageSchema = new mongoose.Schema(
  {
    hero: {
      backgroundImage: { type: String, default: "" },
      badge: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      primaryButton: {
        text: { type: String, default: "" },
        url: { type: String, default: "" }
      },
      secondaryButton: {
        text: { type: String, default: "" },
        url: { type: String, default: "" }
      }
    },
    statistics: [
      {
        title: { type: String, default: "" },
        value: { type: String, default: "" },
        icon: { type: String, default: "" }
      }
    ],
    coreServices: [
      {
        image: { type: String, default: "" },
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        displayOrder: { type: Number, default: 0 },
        features: [{ type: String }],
        highlight: { type: String, default: "" }
      }
    ],
    additionalServices: [
      {
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        displayOrder: { type: Number, default: 0 }
      }
    ],
    investmentProcess: [
      {
        stepNumber: { type: String, default: "" },
        icon: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        displayOrder: { type: Number, default: 0 }
      }
    ],
    ctaSection: {
      backgroundImage: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      buttonText: { type: String, default: "" },
      buttonUrl: { type: String, default: "" }
    },
    visibility: {
      showHero: { type: Boolean, default: true },
      showStats: { type: Boolean, default: true },
      showCoreServices: { type: Boolean, default: true },
      showAdditionalServices: { type: Boolean, default: true },
      showProcess: { type: Boolean, default: true },
      showCTA: { type: Boolean, default: true }
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      keywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      twitterCard: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      schemaMarkup: { type: String, default: "" },
      slug: { type: String, default: "services" }
    }
  },
  { timestamps: true }
);

export default mongoose.models.ServicePage || mongoose.model("ServicePage", ServicePageSchema);
