import User from "../models/User.js";

class UserService {
  // Basic user fetch (no password)
  static getUserInfo(id) {
    return User.findById(id).select("-password");
  }

  // User with incoming + outgoing friend requests (read-only)
  static getUserWithFriendRequests(id) {
    return User.findById(id)
      .populate("incomingFriendRequests", "username profilePicture")
      .populate("outgoingFriendRequests", "username profilePicture")
      .lean();
  }

  // User with populated friends list (read-only)
  static getUserWithFriends(id) {
    return User.findById(id)
      .populate("friends", "username email profilePicture")
      .lean();
  }
}

export default UserService;
