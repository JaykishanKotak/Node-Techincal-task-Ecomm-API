import {
  confirmPayment,
  createPaymentIntent,
  getAllPaymentTransactions,
} from "#/controllers/payment";
import { isAdmin, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validate";
import { PaymentValidator } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/genrate",
  mustAuth,
  validate(PaymentValidator),
  createPaymentIntent
);
router.post("/approve", mustAuth, confirmPayment);
router.get("/", mustAuth, isAdmin, getAllPaymentTransactions);

export default router;
