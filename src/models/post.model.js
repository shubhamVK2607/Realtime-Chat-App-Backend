import mongoose from "mongoose";
import User from "./user.model.js";

const { Schema } = mongoose;




const commentSchema = new Schema(
  {

    text: {
      type: String,
      required: true,
    },
    user: {
      userId:mongoose.Schema.Types.ObjectId,
      fullName: String,
      photoURL: String,
    },
  
  },
  { _id: true }
);

const postSchema = new Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
      },
    ],
    comments: [commentSchema], 
  },
  {
    timestamps: true, 
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
