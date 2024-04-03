import e from "express";
import { isValidObjectId } from "mongoose";
import * as yup from "yup";
import { categories } from "./ecomm_category";

export const CreateUserSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required("Name is missing !")
    .min(3, "Name is too short !")
    .max(20, "Name is too long !"),
  email: yup
    .string()
    .email("Invalid email Id !")
    .required("Email is missing !"),
  password: yup
    .string()
    .trim()
    .required("Password is missing !")
    .min(8, "Password is too short")
    .max(24, "Password is too long !")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple !"
    ),
});

export const TokenAndIDValidation = yup.object().shape({
  token: yup.string().required("Invalid token !"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid User ID"),
});

export const UpdatePasswordSchema = yup.object().shape({
  token: yup.string().required("Invalid token !"),
  userId: yup
    .string()
    .transform(function (value) {
      if (this.isType(value) && isValidObjectId(value)) {
        return value;
      }
      return "";
    })
    .required("Invalid User ID"),
  password: yup
    .string()
    .trim()
    .required("Password is missing !")
    .min(8, "Password is too short")
    .max(24, "Password is too long !")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
      "Password is too simple, please use alphanumeric with special characters !"
    ),
});

export const SignInValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email Id !")
    .required("Email is missing !"),
  password: yup.string().trim().required("Password is missing !"),
});

export const ProductValidationSchema = yup.object().shape({
  name: yup.string().required("Title is missing !"),
  description: yup.string().required("About is missing !"),
  brand: yup.string().required("brand is missing !"),
  category: yup
    .string()
    .oneOf(categories, "Invalid category !")
    .required("Category is missing !"),
  price: yup.number().required("price is missing !"),
  stock: yup.number().required("stock is missing !"),
  weight: yup.number().required("weight is missing !"),
});

export const CartValidationSchema = yup.object().shape({
  count: yup.number().required("count is missing !"),
});

export const PaymentValidator = yup.object().shape({
  amount: yup.number().required("amount is missing !"),
  products: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup
          .string()
          .transform(function (value) {
            if (this.isType(value) && isValidObjectId(value)) {
              return value;
            }
            return "";
          })
          .required("Product ID is required"),
        count: yup.number().required("count is missing !"),
      })
    )
    .required("Products array is required"),
});

export const RatingValiationSchema = yup.object().shape({
  rating: yup
    .number()
    .required("Rating is required")
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be no more than 10"),
});
