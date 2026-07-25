import mongoose from "mongoose";

const ServiceBenefitSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceBenefit || mongoose.model("ServiceBenefit", ServiceBenefitSchema);
