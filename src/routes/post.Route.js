import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import { addComments, addPost, getAllPosts, updateLikes } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/addPost", protectedRoute, addPost);
router.get("/getPosts", protectedRoute, getAllPosts);
router.post("/likes/:postId",protectedRoute,updateLikes)
router.post("/comments/:postId",protectedRoute,addComments)
export default router;
