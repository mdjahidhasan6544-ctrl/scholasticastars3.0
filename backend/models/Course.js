import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1500
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    instructor: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free"
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    durationInHours: {
      type: Number,
      default: 0,
      min: 0
    },
    thumbnailUrl: {
      type: String,
      default: "",
      trim: true
    },
    order: {
      type: Number,
      default: 0,
      min: 0
    },
    isPublished: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

courseSchema.index({ category: 1, order: 1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });

export const Course = mongoose.model("Course", courseSchema);