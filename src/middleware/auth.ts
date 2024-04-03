import { RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

import { JWT_SECRET } from "#/utils/variables";
import User from "#/models/user";
import PasswordResetToken from "#/models/passwordResetToken";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await PasswordResetToken.findOne({
    owner: userId,
  });
  if (!resetToken) {
    return res
      .status(403)
      .json({ error: "Unauthorized access, Invalid token !" });
  }

  const matched = await resetToken.compareToken(token);

  if (!matched) {
    return res.status(403).json({ error: "Invalid token !" });
  }

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  console.log(req.headers);
  const { authorization } = req.headers;

  const token = authorization?.split("Bearer ")[1];
  //console.log(authorization);

  if (!token) return res.status(403).json({ error: "Unauthroized request !" });

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });

  if (!user) return res.status(403).json({ error: "Unauthroized request !" });

  req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verified,
    avatar: user.avatar?.url,
  };

  req.token = token;
  next();
};

export const isVerified: RequestHandler = async (req, res, next) => {
  if (!req.user.verified) {
    return res.status(403).json({ error: "Please verify your account  !" });
  }
  next();
};

export const isAuth: RequestHandler = async (req, res, next) => {
  //to check if user is autheticated or not
  const { authorization } = req.headers;

  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });

    if (!user) return res.status(403).json({ error: "Unauthroized request !" });

    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verified,
      avatar: user.avatar?.url,
    };

    req.token = token;
  }
  next();
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  //to check if user is autheticated or not
  const { authorization } = req.headers;

  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });

    if (!user) return res.status(403).json({ error: "Unauthroized request !" });

    if (user.role !== "admin")
      return res.status(403).json({ error: "Unauthroized request !" });

    req.token = token;
  }
  next();
};
