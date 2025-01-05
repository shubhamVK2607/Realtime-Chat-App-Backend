import express from "express";
import {
  reviewConnectionRequest,
  sendConnectionRequest,
} from "../controllers/connectionRequest.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send/:status/:toUserId", protectedRoute, sendConnectionRequest);
router.post(
  "/review/:status/:requestedId",
  protectedRoute,
  reviewConnectionRequest
);

export default router;
