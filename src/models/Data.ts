import mongoose, { Schema } from "mongoose";

const DataSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  codeRun: { type: Number, required: true, default: 0 },
  aiQueries: { type: Number, required: true, default: 0 },
  errorsDetected: { type: Number, required: true, default: 0 },
  voiceInteractions: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const DataModel = mongoose.models.Data || mongoose.model("Data", DataSchema);
export default DataModel;
