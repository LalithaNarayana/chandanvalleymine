import mongoose from "mongoose";

const ProjectCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ProjectCategory || mongoose.model("ProjectCategory", ProjectCategorySchema);
