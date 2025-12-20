import express from "express";
import { auth } from "../middlewares/auth.js";
import FriendController from "../controllers/friendController.js";

const router = express.Router();

router.get("/", auth, FriendController.getFriends);
router.get("/requests", auth, FriendController.getFriendRequests);

router.post("/request/:id", auth, FriendController.sendFriendRequest);
router.post("/request/:id/accept", auth, FriendController.acceptFriendRequest);

router.delete("/:id", auth, FriendController.deleteFriend);
router.delete("/request/:id", auth, FriendController.deleteFriendRequest);

export default router;
