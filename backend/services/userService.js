import User from '../models/User.js';
import cloudinary from '../configs/cloudinary.js';
import mongoose from 'mongoose';
import { isSameObject } from '../utils/compare.js';
import { publicUserDTO } from '../dtos/userDto.js';

class UserService {
  /**
   * Validate MongoDB ObjectId
   * @throws Error if invalid
   */
  static validateObjectId(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid user id');
    }
  }

  /**
   * Validate MongoDB ObjectId for game
   * @throws Error if invalid
   */
  static validateGameId(gameId) {
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      throw new Error('Invalid game id');
    }
  }

  /**
   * Get user info (basic fields)
   */
  static async getUserInfo(userId) {
    const user = await User.findById(userId).select('-password');
    console.log('getUserInfo - userId:', userId, 'found:', !!user);
    return user;
  }

  /**
   * Get user with populated friends
   */
  static async getUserWithFriends(userId) {
    return await User.findById(userId)
      .populate('friends', 'username email profilePicture')
      .select('friends')
      .lean();
  }

  /**
   * Get user with populated friend requests
   */
  static async getUserWithFriendRequests(userId) {
    return await User.findById(userId)
      .populate('incomingFriendRequests', 'username email profilePicture')
      .populate('outgoingFriendRequests', 'username email profilePicture')
      .select('incomingFriendRequests outgoingFriendRequests')
      .lean();
  }

  /**
   * Get public user info by ID
   * @throws Error if user not found
   */
  static async getPublicUserById(userId) {
    this.validateObjectId(userId);

    const user = await this.getUserInfo(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return publicUserDTO(user);
  }

  /**
   * Update user's non-credential fields
   * @throws Error if user not found
   */
  static async updateUser(userId, updates) {
    if (!updates || Object.keys(updates).length === 0) {
      return null; // No changes
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (isSameObject(user.toObject(), updates)) {
      return null; // No actual changes
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select('-password');

    return updatedUser;
  }

  /**
   * Update user credentials (email/username)
   * @throws Error for validation failures
   */
  static async updateCredentials(userId, { email, username }) {
    const user = await this.getUserInfo(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updates = {};
    if (email) updates.email = email;
    if (username) updates.username = username;

    if (
      Object.keys(updates).length === 0 ||
      isSameObject(user.toObject(), updates)
    ) {
      return null; // No changes
    }

    if (email) {
      const emailExists = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    if (username) {
      const usernameExists = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (usernameExists) {
        throw new Error('Username already in use');
      }
    }

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select('-password');

    return updated;
  }

  /**
   * Update user's profile picture
   * @throws Error if user not found
   */
  static async updateProfilePicture(userId, file) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old profile picture from cloudinary
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    user.profilePicture = file.path;
    user.profilePicturePublicId = file.filename;
    await user.save();

    return { url: user.profilePicture };
  }

  /**
   * Delete user's profile picture
   * @throws Error if user not found
   */
  static async deleteProfilePicture(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Delete from cloudinary
    if (user.profilePicturePublicId) {
      await cloudinary.uploader.destroy(user.profilePicturePublicId);
    }

    user.profilePicture = '/guest.png';
    user.profilePicturePublicId = null;
    await user.save();
  }

  /**
   * Add game to user's favourites
   * Uses $addToSet to prevent duplicates atomically
   * @throws Error if user not found or invalid gameId
   * @returns Updated favourites array
   */
  static async addToFavourites(userId, gameId) {
    this.validateGameId(gameId);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Use $addToSet to atomically add gameId if not already present
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favourites: gameId } },
      { new: true }
    ).select('favourites');

    return updatedUser.favourites;
  }

  /**
   * Remove game from user's favourites
   * Uses $pull to atomically remove gameId
   * @throws Error if user not found or invalid gameId
   * @returns Updated favourites array
   */
  static async removeFromFavourites(userId, gameId) {
    this.validateGameId(gameId);

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Use $pull to atomically remove gameId
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { favourites: gameId } },
      { new: true }
    ).select('favourites');

    return updatedUser.favourites;
  }
}

export default UserService;
