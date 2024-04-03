import {
  addReview,
  deleteReview,
  getReviewsByProduct,
  updateReview,
} from "#/controllers/review";
import { isAuth, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validate";
import { RatingValiationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/add/:productId",
  mustAuth,
  validate(RatingValiationSchema),
  addReview
);

router.patch(
  "/:reviewId",
  mustAuth,
  validate(RatingValiationSchema),
  updateReview
);

router.delete("/:reviewId", mustAuth, deleteReview);

router.get("/get-reviews-by-product/:productId", getReviewsByProduct);

export default router;
