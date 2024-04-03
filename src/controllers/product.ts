import cloudinary from "#/cloud";
import { RequestWithFiles } from "#/middleware/fileParser ";
import { RequestHandler } from "express";
import formidable from "formidable";
import Product from "#/models/product";
import { isValidObjectId } from "mongoose";
import { paginationQuery } from "#/@types/misc";

interface CreateProductRequest extends RequestWithFiles {
  body: {
    name: string;
    description: string;
    category: string;
    sku: string;
    brand: string;
    price: number;
    stock: number;
    dimensions: object;
    attributes: object;
    weight: number;
  };
}

export const createProduct: RequestHandler = async (
  req: CreateProductRequest,
  res
) => {
  const { name, description, category, brand, price, stock, weight } = req.body;

  const poster = req.files?.poster as formidable.File;
  const image = req.files?.image as formidable.File;

  if (!image) {
    return res.status(422).json({ error: "Image is missing !" });
  }

  const imageRes = await cloudinary.uploader.upload(image.filepath);

  const newProduct = new Product({
    name,
    description,
    category,
    brand,
    price,
    stock,
    weight,
    image: {
      url: imageRes.secure_url,
      publicId: imageRes.public_id,
    },
  });

  if (poster) {
    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });
    newProduct.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
  }

  await newProduct.save();

  res.status(201).json({
    product: {
      name,
      description,
      category,
      image: newProduct.image?.url,
      poster: newProduct.poster?.url,
    },
  });
};

export const updateProduct: RequestHandler = async (
  req: CreateProductRequest,
  res
) => {
  const { name, description, category, brand, price, stock, weight } = req.body;

  const poster = req.files?.poster as formidable.File;
  const image = req.files?.image as formidable.File;

  const { productId } = req.params;

  //new: true returns updated record
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    {
      name,
      description,
      category,
      brand,
      price,
      stock,
      weight,
    },
    { new: true }
  );

  if (!product) return res.status(404).json({ error: "Record not found!" });

  if (poster) {
    if (product.poster?.publicId) {
      await cloudinary.uploader.destroy(product.poster?.publicId);
    }

    const posterRes = await cloudinary.uploader.upload(poster.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });
    product.poster = {
      url: posterRes.secure_url,
      publicId: posterRes.public_id,
    };
    await product.save();
  }

  if (image) {
    if (product.image?.publicId) {
      await cloudinary.uploader.destroy(product.image?.publicId);
    }

    const imageRes = await cloudinary.uploader.upload(image.filepath, {
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });
    product.image = {
      url: imageRes.secure_url,
      publicId: imageRes.public_id,
    };
    await product.save();
  }

  res.status(201).json({
    product: {
      name,
      description,
      category,
      image: product.image?.url,
      poster: product.poster?.url,
    },
  });
};

export const getSingleProduct: RequestHandler = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(404).json({ message: "Invalid ProductID !" });
  }

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    return res.status(404).json({ message: "Product not found !" });
  }
  res.status(201).json(product);
};

export const getLatestUploads: RequestHandler = async (req, res) => {
  const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

  const list = await Product.find()
    .sort("-createdAt")
    .limit(parseInt(limit.toString()))
    .populate("reviews");

  const products = list.map((item) => {
    return {
      id: item._id,
      name: item.name,
      description: item.description,
      categorty: item.category,
      image: item.image?.url,
      poster: item.poster?.url,
      brand: item.brand,
      reviews: item.reviews,
    };
  });

  res.json(products);
};
