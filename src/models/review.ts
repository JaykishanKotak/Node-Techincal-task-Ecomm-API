import mongoose, { Model, ObjectId, Schema, model } from "mongoose";

export interface ReviewDocument {
  owner: ObjectId;
  parentProduct: ObjectId;
  content: string;
  rating: number;
}

const reviewSchema = new Schema<ReviewDocument>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    content: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Review", reviewSchema) as Model<ReviewDocument>;
