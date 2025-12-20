import User from "../models/User.js";
import UserService from "../services/userService.js";
import { sendResponse } from "../utils/response.js";
import mongoose from "mongoose";

class FriendController {
  // ---------------- GET FRIENDS ----------------
  static async getFriends(req, res) {
    try {
      const user = await UserService.getUserWithFriends(req.user.id);

      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      return sendResponse(
        res,
        200,
        true,
        "Friends fetched successfully",
        user.friends
      );
    } catch (err) {
      console.error("getFriends error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- GET FRIEND REQUESTS ----------------
  static async getFriendRequests(req, res) {
    try {
      const user = await UserService.getUserWithFriendRequests(req.user.id);

      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      return sendResponse(
        res,
        200,
        true,
        "Friend requests fetched successfully",
        {
          incoming: user.incomingFriendRequests,
          outgoing: user.outgoingFriendRequests,
        }
      );
    } catch (err) {
      console.error("getFriendRequests error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- SEND FRIEND REQUEST ----------------
  static async sendFriendRequest(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.id;

      if (senderId === receiverId) {
        return sendResponse(res, 400, false, "You cannot add yourself");
      }

      const sender = await User.findById(senderId);
      const receiver = await User.findById(receiverId);

      if (!sender || !receiver) {
        return sendResponse(res, 404, false, "User not found");
      }

      if (sender.friends.includes(receiverId)) {
        return sendResponse(res, 400, false, "Already friends");
      }

      if (receiver.incomingFriendRequests.includes(senderId)) {
        return sendResponse(res, 400, false, "Request already pending");
      }

      sender.outgoingFriendRequests.push(receiverId);
      receiver.incomingFriendRequests.push(senderId);

      await sender.save();
      await receiver.save();

      return sendResponse(res, 200, true, "Friend request sent");
    } catch (err) {
      console.error("sendFriendRequest error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- ACCEPT FRIEND REQUEST ----------------
  static async acceptFriendRequest(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(senderId)) {
        return sendResponse(res, 400, false, "Invalid user id");
      }

      const receiver = await User.findById(receiverId);
      const sender = await User.findById(senderId);

      if (!receiver || !sender) {
        return sendResponse(res, 404, false, "User not found");
      }

      if (!receiver.incomingFriendRequests.includes(senderId)) {
        return sendResponse(res, 400, false, "No request from this user");
      }

      receiver.incomingFriendRequests = receiver.incomingFriendRequests.filter(
        (id) => id.toString() !== senderId
      );
      sender.outgoingFriendRequests = sender.outgoingFriendRequests.filter(
        (id) => id.toString() !== receiverId
      );

      receiver.friends.push(senderId);
      sender.friends.push(receiverId);

      await receiver.save();
      await sender.save();

      return sendResponse(res, 200, true, "Friend request accepted");
    } catch (err) {
      console.error("acceptFriendRequest error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- DELETE FRIEND REQUEST ----------------
  static async deleteFriendRequest(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(uid2)) {
        return sendResponse(res, 400, false, "Invalid user id");
      }

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

      if (!user1 || !user2) {
        return sendResponse(res, 404, false, "User not found");
      }

      user1.incomingFriendRequests = user1.incomingFriendRequests.filter(
        (id) => id.toString() !== uid2
      );
      user1.outgoingFriendRequests = user1.outgoingFriendRequests.filter(
        (id) => id.toString() !== uid2
      );
      user2.incomingFriendRequests = user2.incomingFriendRequests.filter(
        (id) => id.toString() !== uid1
      );
      user2.outgoingFriendRequests = user2.outgoingFriendRequests.filter(
        (id) => id.toString() !== uid1
      );

      await user1.save();
      await user2.save();

      return sendResponse(res, 200, true, "Friend request removed");
    } catch (err) {
      console.error("deleteFriendRequest error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- DELETE FRIEND ----------------
  static async deleteFriend(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      if (!user1 || !user2) {
        return sendResponse(res, 404, false, "User not found");
      }

      const user1 = await User.findById(uid1);
      const user2 = await User.findById(uid2);

      if (!user1 || !user2) {
        return sendResponse(res, 404, false, "User not found");
      }

      user1.friends = user1.friends.filter((id) => id.toString() !== uid2);
      user2.friends = user2.friends.filter((id) => id.toString() !== uid1);

      await user1.save();
      await user2.save();

      return sendResponse(res, 200, true, "Friend removed");
    } catch (err) {
      console.error("deleteFriend error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }
}

export default FriendController;
