import mongoose from "mongoose";

const ServiceSectionSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "Hero",
        "Text Block",
        "Image",
        "Video",
        "Gallery",
        "Timeline",
        "Feature Cards",
        "Statistics",
        "Benefits",
        "Accordion",
        "Testimonials",
        "CTA",
        "Custom Rich Text",
        "Image + Content",
        "Two Column Layout",
        "Three Column Layout",
        "Table",
        "Download Brochure",
        "Investment Calculator",
        "Custom HTML",
      ],
    },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceSection || mongoose.model("ServiceSection", ServiceSectionSchema);
