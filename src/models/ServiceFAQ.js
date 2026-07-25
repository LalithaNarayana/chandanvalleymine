import mongoose from "mongoose";

const ServiceFAQSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceFAQ || mongoose.model("ServiceFAQ", ServiceFAQSchema);
