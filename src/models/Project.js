import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String, default: "" },
    location: { type: String, default: "" },
    area: { type: String, default: "" },
    plotSize: { type: String, default: "" },
    price: { type: String, default: "" },
    expectedRoi: { type: String, default: "" },
    image: { type: String, default: "" },
    images: [{ type: String }],
    brochure: { type: String, default: "" },
    description: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectCategory", default: null },
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
    featured: { type: Boolean, default: false },
    btnText: { type: String, default: "Schedule Site Visit" },
    btnUrl: { type: String, default: "/contact" },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
