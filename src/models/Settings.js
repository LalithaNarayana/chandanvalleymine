import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Chandan Valley Farms" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    footerDescription: { type: String, default: "" },
    phone: { type: String, default: "" },
    phone2: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    googleMap: { type: String, default: "" },
    navLinks: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        order: { type: Number, default: 0 },
      },
    ],
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
    },
    smtp: {
      host: { type: String, default: "" },
      port: { type: Number, default: 587 },
      user: { type: String, default: "" },
      pass: { type: String, default: "" },
    },
    s3: {
      region: { type: String, default: "" },
      bucket: { type: String, default: "" },
      accessKey: { type: String, default: "" },
      secretKey: { type: String, default: "" },
      domain: { type: String, default: "" },
    },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      metaKeywords: { type: String, default: "" },
    },
    analyticsId: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
