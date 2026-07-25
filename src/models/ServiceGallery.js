import mongoose from "mongoose";

const ServiceGallerySchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    imageUrl: { type: String, required: true },
    title: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceGallery || mongoose.model("ServiceGallery", ServiceGallerySchema);
