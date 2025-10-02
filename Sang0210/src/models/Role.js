import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Role name is required"],
      unique: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


//roleSchema.index({ name: 1 }, { unique: true });

export const Role = mongoose.model("Role", roleSchema);
