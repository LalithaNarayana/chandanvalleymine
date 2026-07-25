import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    project: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, default: "Contact Us" },
    status: { type: String, enum: ["Unread", "Read", "Replied", "Closed"], default: "Unread" },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
