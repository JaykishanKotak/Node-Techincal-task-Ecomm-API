import { categories } from "#/utils/ecomm_category";
import { compare, hash } from "bcrypt";
import mongoose, { Model, ObjectId, Schema, model } from "mongoose";

//interface (TS)
export interface ProductDocument {
  _id: ObjectId;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  stock: number;
  attributes?: object;
  dimensions?: object;
  poster?: { url: string; publicId: string };
  image?: { url: string; publicId: string };
  weight?: number;
  reviews?: ObjectId[];
}

const productSchema = new Schema<ProductDocument>(
  {
    // Basic product information
    name: {
      type: String,
      required: true,
      trim: true, // Remove leading/trailing whitespaces
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: categories,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // Pricing and inventory
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
    },

    // Additional product details (optional)
    image: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    attributes: {
      // Key-value pairs for product variations (e.g., size, color)
      type: Object,
    },
    weight: {
      type: Number,
      required: true,
    },
    dimensions: {
      type: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
      },
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Product", productSchema) as Model<ProductDocument>;
