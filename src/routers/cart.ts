import { getCardDetails, removeCart, updateCart } from "#/controllers/cart";
import { mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validate";
import { CartValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/:productId",
  mustAuth,
  validate(CartValidationSchema),
  updateCart
);

router.post("/:cartId", mustAuth, removeCart);

router.get("/", mustAuth, getCardDetails);

export default router;
