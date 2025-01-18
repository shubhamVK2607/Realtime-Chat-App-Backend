import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import { addPost, getAllPosts, updateLikes } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/addPost", protectedRoute, addPost);
router.get("/getPosts", protectedRoute, getAllPosts);
router.post("/likes/:postId",protectedRoute,updateLikes)

export default router;
