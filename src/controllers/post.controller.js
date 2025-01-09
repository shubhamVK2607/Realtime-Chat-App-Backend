import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";

export const addPost = async (req, res) => {
  try {
    const { text, image } = req.body;

    const fromId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Post({
      fromId,
      text,
      image: imageUrl,
    });

    newMessage.populate("fromId", ["fullName", "photoURL"]);

    await newMessage.save();
    res
      .status(200)
      .json({ message: "Post Uploaded Successfully", data: newMessage });
  } catch (error) {
    console.log("Error in addPost controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("fromId", ["fullName", "photoURL"])
      .sort({ createdAt: -1 });

    res
      .status(200)
      .json({ data: posts, message: "Posts Fetched Successfully" });
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
