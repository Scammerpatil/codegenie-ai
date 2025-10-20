import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: { type: String },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
