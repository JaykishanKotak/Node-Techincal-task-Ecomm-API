import Review from "#/models/review";
import { UserDocument } from "#/models/user";
import { ObjectId } from "mongoose";

export const genrateOTPToken = (length: number = 6) => {
  let otp = "";
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    otp += digit;
  }
  return otp;
};

export const formatProfile = (user: UserDocument) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
  };
};

export const averageRatingPipeline = (productId: ObjectId) => {
  return [
    {
      $lookup: {
        from: "Review",
        localField: "rating",
        foreignField: "_id",
        as: "avgRat",
      },
    },
    {
      $match: { parentProduct: productId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewsCount: {
          $sum: 1,
        },
      },
    },
  ];
};

type ReviewsDocument = {
  ratingAvg?: string | number;
  reviewsCount?: string | number;
};

export const getAverageRatings = async (productId: ObjectId) => {
  const [aggregatedResponse] = await Review.aggregate(
    averageRatingPipeline(productId)
  );

  const reviews: ReviewsDocument = {};

  //If we have response, becasue movie have or hav not reviews
  console.log(aggregatedResponse);
  if (aggregatedResponse) {
    const { ratingAvg, reviewsCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewsCount = reviewsCount;
  }
  return reviews;
};

type MatchOptionsDocument = {
  reviews?: object;
  status?: object;
  type?: object;
};

export const topRatedProductPipeline = (type: string) => {
  const matchOptions: MatchOptionsDocument = {
    reviews: { $exists: true },
    status: { $eq: "public" },
  };

  if (type) {
    matchOptions.type = { $eq: type };
  }

  return [
    {
      $lookup: {
        from: "Product",
        localField: "reviews",
        foreignField: "_id",
        as: "topRated",
      },
    },
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: {
          $size: "$reviews",
        },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    {
      $limit: 5,
    },
  ];
};
