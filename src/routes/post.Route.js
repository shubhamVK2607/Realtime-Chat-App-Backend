import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import { addPost, getAllPosts } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/addPost", protectedRoute, addPost);
router.get("/getPosts", protectedRoute, getAllPosts);

export default router;
