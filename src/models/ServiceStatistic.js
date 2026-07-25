import mongoose from "mongoose";

const ServiceStatisticSchema = new mongoose.Schema(
  {
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    title: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.ServiceStatistic || mongoose.model("ServiceStatistic", ServiceStatisticSchema);
