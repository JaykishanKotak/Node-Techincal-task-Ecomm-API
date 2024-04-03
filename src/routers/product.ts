import {
  createProduct,
  getLatestUploads,
  getSingleProduct,
  updateProduct,
} from "#/controllers/product";
import { isVerified, mustAuth } from "#/middleware/auth";
import { fileParser } from "#/middleware/fileParser ";
import { validate } from "#/middleware/validate";
import { ProductValidationSchema } from "#/utils/validationSchema";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(ProductValidationSchema),
  createProduct
);

router.patch(
  "/:productId",
  mustAuth,
  isVerified,
  fileParser,
  validate(ProductValidationSchema),
  updateProduct
);

router.get("/:productId", mustAuth, isVerified, getSingleProduct);

router.get("/latest", getLatestUploads);

export default router;
