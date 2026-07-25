import mongoose from "mongoose";

const LegalPageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["privacy-policy", "terms-of-service"],
      required: true,
      unique: true,
    },
    title: { type: String, default: "" },
    content: { type: String, default: "" }, // Rich HTML content managed via CKEditor
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.LegalPage || mongoose.model("LegalPage", LegalPageSchema);
