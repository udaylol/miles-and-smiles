import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";
import { isSameObject } from "../utils/compare.js";
import UserService from "../services/userService.js";
import { sendResponse } from "../utils/response.js";
import { publicUserDTO } from "../dtos/userDto.js";

class UserController {
  // ---------------- GET USER BY ID ----------------
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return sendResponse(res, 400, false, "Invalid user id");
      }

      const user = await UserService.getUserInfo(userId);

      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      return sendResponse(
        res,
        200,
        true,
        "User fetched successfully",
        publicUserDTO(user)
      );
    } catch (err) {
      console.error("getUserById error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- GET ME ----------------
  static async getMe(req, res) {
    try {
      const user = await UserService.getUserInfo(req.user.id);

      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      return sendResponse(res, 200, true, "User fetched successfully", user);
    } catch (err) {
      console.error("getMe error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- UPDATE USER (non-credentials) ----------------
  static async updateUser(req, res) {
    try {
      const updates = req.body ?? {};

      if (Object.keys(updates).length === 0) {
        console.log("1");
        return sendResponse(res, 200, true, "No changes provided");
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      if (isSameObject(user.toObject(), updates)) {
        console.log("3");
        return sendResponse(res, 200, true, "No changes provided", user);
      }

      const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
        new: true,
      }).select("-password");

      return sendResponse(
        res,
        200,
        true,
        "User updated successfully",
        updatedUser
      );
    } catch (err) {
      console.error("updateUser error:", err);
      return sendResponse(res, 500, false, "Error updating user");
    }
  }

  // ---------------- UPDATE CREDENTIALS ----------------
  static async updateCredentials(req, res) {
    try {
      const userId = req.user.id;
      const { email, username } = req.body ?? {};

      const user = await UserService.getUserInfo(userId);
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      const updates = {};
      if (email) updates.email = email;
      if (username) updates.username = username;

      if (Object.keys(updates).length === 0 || isSameObject(user, updates)) {
        return sendResponse(res, 200, true, "No changes provided", user);
      }

      if (email) {
        const emailExists = await User.findOne({
          email,
          _id: { $ne: userId },
        });
        if (emailExists) {
          return sendResponse(res, 400, false, "Email already in use");
        }
      }

      if (username) {
        const usernameExists = await User.findOne({
          username,
          _id: { $ne: userId },
        });
        if (usernameExists) {
          return sendResponse(res, 400, false, "Username already in use");
        }
      }

      const updated = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      }).select("-password");

      return sendResponse(
        res,
        200,
        true,
        "Credentials updated successfully",
        updated
      );
    } catch (err) {
      console.error("updateCredentials error:", err);
      return sendResponse(res, 500, false, "Server error");
    }
  }

  // ---------------- UPDATE PROFILE PICTURE ----------------
  static async updateProfilePicture(req, res) {
    try {
      if (!req.file) {
        return sendResponse(res, 400, false, "No file uploaded");
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      user.profilePicture = req.file.path;
      user.profilePicturePublicId = req.file.filename;
      await user.save();

      return sendResponse(
        res,
        200,
        true,
        "Profile picture updated successfully",
        { url: user.profilePicture }
      );
    } catch (err) {
      console.error("updateProfilePicture error:", err);
      return sendResponse(res, 500, false, "Failed to update profile picture");
    }
  }

  // ---------------- DELETE PROFILE PICTURE ----------------
  static async deleteProfilePicture(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return sendResponse(res, 404, false, "User not found");
      }

      if (user.profilePicturePublicId) {
        await cloudinary.uploader.destroy(user.profilePicturePublicId);
      }

      user.profilePicture = "/guest.png";
      user.profilePicturePublicId = null;
      await user.save();

      return sendResponse(res, 200, true, "Profile picture removed");
    } catch (err) {
      console.error("deleteProfilePicture error:", err);
      return sendResponse(res, 500, false, "Failed to remove profile picture");
    }
  }
}

export default UserController;
