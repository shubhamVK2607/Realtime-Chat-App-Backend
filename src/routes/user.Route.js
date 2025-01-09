import express from "express";

import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  getAllConnectionRequests,
  getAllConnections,
  getUsersForFeed,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/requests/received", protectedRoute, getAllConnectionRequests);
router.get("/connections", protectedRoute, getAllConnections);
router.get("/connect", protectedRoute, getUsersForFeed);

export default router;
