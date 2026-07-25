import mongoose from "mongoose";

const ServiceTestimonialSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    name: { type: String, required: true },
    designation: { type: String, default: "" },
    company: { type: String, default: "" },
    photo: { type: String, default: "" },
    rating: { type: Number, default: 5 },
    review: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceTestimonial || mongoose.model("ServiceTestimonial", ServiceTestimonialSchema);
