import express from "express";
import "dotenv/config";
import "express-async-errors";

import "./db";

import authRouter from "./routers/auth";
import cartRouter from "./routers/cart";
import productRouter from "./routers/product";
import paymentRouter from "./routers/payment";
import reviewRouter from "./routers/review";

import "./utils/schedule";
import { errorHandler } from "./middleware/error";

const app = express();

//Register our middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//it will visible to every one
app.use(express.static("src/public"));

app.use("/auth", authRouter);
app.use("/cart", cartRouter);
app.use("/product", productRouter);
app.use("/payment", paymentRouter);
app.use("/review", reviewRouter);

//middleware to handle internal server errors
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is running on PORT " + PORT);
});
