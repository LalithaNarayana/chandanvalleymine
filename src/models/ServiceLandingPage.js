import mongoose from "mongoose";

const ServiceLandingPageSchema = new mongoose.Schema(
  {
    hero: {
      bgImage: { type: String, default: "" },
      badgeText: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      primaryBtnText: { type: String, default: "" },
      primaryBtnLink: { type: String, default: "" },
      secondaryBtnText: { type: String, default: "" },
      secondaryBtnLink: { type: String, default: "" },
    },
    whyChooseUs: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    cta: {
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      bgImage: { type: String, default: "" },
      btnText: { type: String, default: "" },
      btnLink: { type: String, default: "" },
      btnSecondaryText: { type: String, default: "" },
      btnSecondaryLink: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceLandingPage || mongoose.model("ServiceLandingPage", ServiceLandingPageSchema);
