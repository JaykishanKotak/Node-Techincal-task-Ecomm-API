import Cart from "#/models/cart";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const updateCart: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  const userId = req.user.id;
  const { count } = req.body;
  if (!isValidObjectId(productId) || !isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid request !" });
  }
  const cartDetails = await Cart.findOne({
    product: productId,
    customer: userId,
  });

  //if product is alredy in cart

  await Cart.create({
    product: productId,
    customer: userId,
    count,
  });

  return res.status(200).json("Item added to cart");
};

export const removeCart: RequestHandler = async (req, res) => {
  const { cartId } = req.params;

  if (!isValidObjectId(cartId)) {
    return res.status(400).json({ message: "Invalid request !" });
  }
  const cartDetails = await Cart.findOne({
    _id: cartId,
  });

  if (!isValidObjectId(cartDetails)) {
    return res.status(404).json({ message: "Cart items not found !" });
  }
  await Cart.findOneAndDelete({
    _id: cartId,
  });
  //if product is alredy in cart

  return res.status(200).json("Item removed to cart");
};
export const getCardDetails: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  const cardDetails = await Cart.findOne({ customer: userId }).populate(
    "product customer"
  );

  return res.status(200).json({ cart: cardDetails });
};
