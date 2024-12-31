import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectedRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized! No token provided" });
    }

    const decodedUser = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decodedUser) {
      return res.status(401).json({ message: "Unauthorized! Invalid token" });
    }
    const user = await User.findById(decodedUser.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error from protected route " + error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};
