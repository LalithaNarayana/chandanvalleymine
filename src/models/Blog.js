import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: String, default: "" },
    tags: [{ type: String }],
    date: { type: String, default: "" },
    readTime: { type: String, default: "" },
    image: { type: String, default: "" },
    status: { type: String, enum: ["Published", "Draft"], default: "Published" },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
