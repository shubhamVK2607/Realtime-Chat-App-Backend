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


export const updateLikes = async (req, res) => {
  try {
    const { postId } = req.params; // Get postId from params
    const loggedInUser = req.user._id; // Logged-in user's ID

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user ID already exists in the likes array
    const userIndex = post.likes.indexOf(loggedInUser);

    if (userIndex === -1) {
      // If the user is not in the likes array, add them
      post.likes.push(loggedInUser);
    } else {
      // If the user is already in the likes array, remove them
      post.likes.splice(userIndex, 1);
    }


    // Save the updated post
    await post.save();
    const populatedPost = await post.populate("fromId", ["fullName", "photoURL"]);

    res.status(200).json({ message: "Likes updated", data: populatedPost });
    
  } catch (error) {
    console.error("Error in updateLikes controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
