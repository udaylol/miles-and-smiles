import User from "../models/User.js";
import mongoose from "mongoose";

class FriendService {
  /**
   * Validate MongoDB ObjectId
   * @throws Error if invalid
   */
  static validateObjectId(id, fieldName = "User id") {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid ${fieldName}`);
    }
  }

  /**
   * Get user's friends list
   * @throws Error if user not found
   */
  static async getFriends(userId) {
    const user = await User.findById(userId)
      .populate("friends", "username email profilePicture")
      .select("friends");

    if (!user) {
      throw new Error("User not found");
    }

    return user.friends;
  }

  /**
   * Get user's friend requests (incoming and outgoing)
   * @throws Error if user not found
   */
  static async getFriendRequests(userId) {
    const user = await User.findById(userId)
      .populate("incomingFriendRequests", "username email profilePicture")
      .populate("outgoingFriendRequests", "username email profilePicture")
      .select("incomingFriendRequests outgoingFriendRequests");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      incoming: user.incomingFriendRequests,
      outgoing: user.outgoingFriendRequests,
    };
  }

  /**
   * Send a friend request
   * @throws Error for validation failures
   */
  static async sendFriendRequest(senderId, receiverId) {
    this.validateObjectId(receiverId);

    if (senderId === receiverId) {
      throw new Error("You cannot add yourself");
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error("User not found");
    }

    if (sender.friends.includes(receiverId)) {
      throw new Error("Already friends");
    }

    if (receiver.incomingFriendRequests.includes(senderId)) {
      throw new Error("Request already pending");
    }

    sender.outgoingFriendRequests.push(receiverId);
    receiver.incomingFriendRequests.push(senderId);

    await sender.save();
    await receiver.save();
  }

  /**
   * Accept a friend request
   * @throws Error for validation failures
   */
  static async acceptFriendRequest(receiverId, senderId) {
    this.validateObjectId(senderId);

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      throw new Error("User not found");
    }

    if (!receiver.incomingFriendRequests.includes(senderId)) {
      throw new Error("No request from this user");
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
  }

  /**
   * Delete/cancel a friend request (from either side)
   * @throws Error for validation failures
   */
  static async deleteFriendRequest(uid1, uid2) {
    this.validateObjectId(uid2);

    const user1 = await User.findById(uid1);
    const user2 = await User.findById(uid2);

    if (!user1 || !user2) {
      throw new Error("User not found");
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
  }

  /**
   * Remove a friend
   * @throws Error for validation failures
   */
  static async deleteFriend(uid1, uid2) {
    this.validateObjectId(uid2);

    const user1 = await User.findById(uid1);
    const user2 = await User.findById(uid2);

    if (!user1 || !user2) {
      throw new Error("User not found");
    }

    user1.friends = user1.friends.filter((id) => id.toString() !== uid2);
    user2.friends = user2.friends.filter((id) => id.toString() !== uid1);

    await user1.save();
    await user2.save();
  }
}

export default FriendService;