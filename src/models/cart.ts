import { compare, hash } from "bcrypt";
import mongoose, { Model, ObjectId, Schema, model } from "mongoose";

export interface CartDocument {
  customer: ObjectId;
  products: [ObjectId];
  count: number;
}

const cartSchema = new Schema<CartDocument>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Cart", cartSchema) as Model<CartDocument>;
