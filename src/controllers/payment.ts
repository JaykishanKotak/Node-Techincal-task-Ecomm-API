import Payment from "#/models/payment";
import { STRIPE_SECRET_KEY } from "#/utils/variables";
import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import Stripe from "stripe";
const stripe = new Stripe(STRIPE_SECRET_KEY);
import Product from "#/models/product";
import User from "#/models/user";
import { paginationQuery } from "#/@types/misc";

export const createPaymentIntent: RequestHandler = async (req, res) => {
  try {
    const { amount, currency = "usd", products } = req.body;

    const userId = req.user.id;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency, // Adjust currency as needed
      payment_method_types: ["card"], // Accept card payments
    });

    console.log("Stripe", paymentIntent);

    const genratedPaymentIntent = await Payment.create({
      customer: userId,
      cart: products,
      transactionId: randomUUID(),
      amount: amount,
      currency: currency,
      status: "Intent",
      paymentDetails: paymentIntent,
      paymentIntentId: paymentIntent.id,
    });
    res.status(200).json({ payment: genratedPaymentIntent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const confirmPayment: RequestHandler = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId, transactionId } = req.body;

    const payment = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });

    await Payment.findOneAndUpdate(
      {
        transactionId,
      },
      {
        status: "Paid",
      }
    );

    res.status(200).json({ message: "Payment successful!", payment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Payment failed due to error !" });
  }
};

export const getAllPaymentTransactions: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
  const transactions = await Payment.find({})
    .sort({
      createdAt: -1,
    })
    .skip(parseInt(pageNo.toString()) * parseInt(limit.toString()))
    .limit(parseInt(limit.toString()));

  res.json(transactions);
};
