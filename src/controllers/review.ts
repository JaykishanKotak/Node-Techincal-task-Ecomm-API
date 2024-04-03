import Product from "#/models/product";
import Review, { ReviewDocument } from "#/models/review";
import { getAverageRatings } from "#/utils/helper";
import { RequestHandler } from "express";
import { ObjectId, isValidObjectId } from "mongoose";

export const addReview: RequestHandler = async (req, res) => {
  const { productId } = req.params;
  const { content, rating } = req.body;

  const userId = req.user.id;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product!" });
  }

  //We don't add reviews for private movie
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(400).json({ message: "Product not found!" });
  }

  //Check if user is alredy reviewed movie
  const isAlredyReviewed = await Review.findOne({
    owner: userId,
    parentProduct: product._id,
  });
  if (isAlredyReviewed) {
    return res
      .status(400)
      .json({ message: "Invalid request, Review is alredy there!" });
  }

  //Create and Update review
  const newReview = await Review.create({
    owner: userId,
    parentProduct: product._id,
    content,
    rating,
  });

  product?.reviews?.push(newReview._id as unknown as ObjectId);
  await product.save();

  //Saving new Review
  await newReview.save();

  //We need to send average ratings so that we can update the UI With latest ratings.
  const reviews = await getAverageRatings(product._id);
  res.json({
    message: "Your review has been added.",
    reviews,
  });
};

export const updateReview: RequestHandler = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;

  const userId = req.user.id;

  //If user is not verified
  if (!req.user.verified) {
    return res
      .status(400)
      .json({ message: "Please Verify your email first !" });
  }

  if (!isValidObjectId(reviewId)) {
    return res.status(400).json({ message: "Invalid review ID !" });
  }

  //Check the review and its belong to the owner
  const review = await Review.findOne({ owner: userId, _id: reviewId });

  //If no review
  if (!review) return res.status(404).json({ message: "Invalid review !" });

  review.content = content;
  review.rating = rating;

  await review.save();

  res.json({
    message: "Your review has been updated.",
  });
};

export const deleteReview: RequestHandler = async (req, res) => {
  const { reviewId } = req.params;

  const userId = req.user.id;

  if (!isValidObjectId(reviewId)) {
    return res.status(400).json({ message: "Invalid review ID !" });
  }

  const review = await Review.findOne({ owner: userId, _id: reviewId });

  if (!review) {
    return res
      .status(404)
      .json({ message: "Invalid Request, Review not found !" });
  }
  //remove review from movie database
  const product = await Product.findById(review.parentProduct).select(
    "reviews"
  );
  //Long Form if(rid !== reviewId) return rId => Short Form  rId !== reviewId

  if (product && product?.reviews) {
    product.reviews = product?.reviews.filter(
      (rId) => rId.toString() !== reviewId
    );

    await Review.findByIdAndDelete(reviewId);

    await product.save();

    res.json({ message: "Review removed successfully!" });
  }
};

export const getReviewsByProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID!" });
  }

  const product = await Product.findById(productId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");

  if (product?.reviews) {
    const reviews = product?.reviews.map((r) => {
      const { owner, content, rating, _id: reviewId } = r as any;
      //Renameing _id as ownerId
      const { name, _id: ownerId } = owner;
      return {
        id: reviewId,
        owner: {
          id: ownerId,
          name,
        },
        content,
        rating,
      };
    });
    // res.json(movie.reviews);
    res.json({ product: { name: product.name, reviews } });
  }
};
