import mongoose from "mongoose";

const ServiceSEOSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    twitterImage: { type: String, default: "" },
    schemaMarkup: { type: String, default: "" },
    robots: { type: String, default: "index, follow" },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceSEO || mongoose.model("ServiceSEO", ServiceSEOSchema);
