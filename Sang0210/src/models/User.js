import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true
    },
    fullName: {
      type: String,
      default: ""
    },
    avatarUrl: {
      type: String,
      default: ""
    },
    status: {
      type: Boolean,
      default: false
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    },
    loginCount: {
      type: Number,
      default: 0,
      min: 0
    },
    isDelete: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Indexes
//userSchema.index({ username: 1 }, { unique: true });
//userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
