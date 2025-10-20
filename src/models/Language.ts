import mongoose, { Schema } from "mongoose";

const LanguageUsageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  javaScriptUsage: { type: Number, default: 0 },
  pythonUsage: { type: Number, default: 0 },
  cppUsage: { type: Number, default: 0 },
  javaUsage: { type: Number, default: 0 },
  cUsage: { type: Number, default: 0 },
});

const LanguageUsage =
  mongoose.models.LanguageUsage ||
  mongoose.model("LanguageUsage", LanguageUsageSchema);
export default LanguageUsage;
