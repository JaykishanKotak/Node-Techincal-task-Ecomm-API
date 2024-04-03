import mongoose, { Model, ObjectId, Schema, model } from "mongoose";
import { number } from "yup";

export interface PaymentDocument {
  customer: ObjectId;
  cart: [{ productId: ObjectId; count: number }];
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentDetails: object;
  paymentIntentId: string;
}

const paymentSchema = new Schema<PaymentDocument>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    transactionId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    paymentDetails: {
      type: Object,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Payment", paymentSchema) as Model<PaymentDocument>;
