import mongoose from "mongoose";

const AboutPageSchema = new mongoose.Schema(
  {
    hero: {
      bgImage: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      btnText: { type: String, default: "" },
      btnUrl: { type: String, default: "" },
      secondaryBtnText: { type: String, default: "" },
      secondaryBtnUrl: { type: String, default: "" },
    },
    ourStory: {
      image: { type: String, default: "" },
      smallTitle: { type: String, default: "" },
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      badgeTitle: { type: String, default: "" },
      badgeSubtitle: { type: String, default: "" },
    },
    founder: {
      image: { type: String, default: "" },
      quote: { type: String, default: "" },
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
    },
    coreValuesSection: {
      title: { type: String, default: "" },
    },
    coreValues: [
      {
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        icon: { type: String, default: "" },
      },
    ],
    journeySection: {
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
    },
    journeyTimeline: [
      {
        year: { type: String, default: "" },
        image: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    whyChooseUs: {
      smallTitle: { type: String, default: "" },
      heading: { type: String, default: "" },
      checklist: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      images: [{ type: String }],
    },
    cta: {
      heading: { type: String, default: "" },
      description: { type: String, default: "" },
      primaryBtnText: { type: String, default: "" },
      primaryBtnUrl: { type: String, default: "/contact" },
    },
    visibility: {
      showHero: { type: Boolean, default: true },
      showStory: { type: Boolean, default: true },
      showMissionVision: { type: Boolean, default: true },
      showFounder: { type: Boolean, default: true },
      showCoreValues: { type: Boolean, default: true },
      showTimeline: { type: Boolean, default: true },
      showWhyChooseUs: { type: Boolean, default: true },
      showCTA: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.models.AboutPage || mongoose.model("AboutPage", AboutPageSchema);
