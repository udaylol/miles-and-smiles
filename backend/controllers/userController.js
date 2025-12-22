import UserService from '../services/userService.js';
import { sendResponse } from '../utils/response.js';

class UserController {
  // ---------------- GET USER BY ID ----------------
  static async getUserById(req, res) {
    try {
      const userId = req.params.id;

      const user = await UserService.getPublicUserById(userId);

      return sendResponse(res, 200, true, 'User fetched successfully', user);
    } catch (err) {
      console.error('getUserById error:', err);

      if (err.message === 'Invalid user id') {
        return sendResponse(res, 400, false, err.message);
      }

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- GET ME ----------------
  static async getMe(req, res) {
    try {
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }

      const user = await UserService.getUserInfo(userId);

      if (!user) {
        return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(res, 200, true, 'User fetched successfully', user);
    } catch (err) {
      console.error('getMe error:', err);
      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- UPDATE USER (non-credentials) ----------------
  static async updateUser(req, res) {
    try {
      const updates = req.body ?? {};

      const updatedUser = await UserService.updateUser(req.user.id, updates);

      if (!updatedUser) {
        // No changes were made
        const user = await UserService.getUserInfo(req.user.id);
        return sendResponse(res, 200, true, 'No changes provided', user);
      }

      return sendResponse(
        res,
        200,
        true,
        'User updated successfully',
        updatedUser
      );
    } catch (err) {
      console.error('updateUser error:', err);

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Error updating user');
    }
  }

  // ---------------- UPDATE CREDENTIALS ----------------
  static async updateCredentials(req, res) {
    try {
      const userId = req.user.id;
      const { email, username } = req.body ?? {};

      const updated = await UserService.updateCredentials(userId, {
        email,
        username,
      });

      if (!updated) {
        // No changes were made
        const user = await UserService.getUserInfo(userId);
        return sendResponse(res, 200, true, 'No changes provided', user);
      }

      return sendResponse(
        res,
        200,
        true,
        'Credentials updated successfully',
        updated
      );
    } catch (err) {
      console.error('updateCredentials error:', err);

      const errorMessages = {
        'User not found': { status: 404, message: err.message },
        'Email already in use': { status: 400, message: err.message },
        'Username already in use': { status: 400, message: err.message },
      };

      const error = errorMessages[err.message];
      if (error) {
        return sendResponse(res, error.status, false, error.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- UPDATE PROFILE PICTURE ----------------
  static async updateProfilePicture(req, res) {
    try {
      if (!req.file) {
        return sendResponse(res, 400, false, 'No file uploaded');
      }

      const result = await UserService.updateProfilePicture(
        req.user.id,
        req.file
      );

      return sendResponse(
        res,
        200,
        true,
        'Profile picture updated successfully',
        result
      );
    } catch (err) {
      console.error('updateProfilePicture error:', err);

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Failed to update profile picture');
    }
  }

  // ---------------- DELETE PROFILE PICTURE ----------------
  static async deleteProfilePicture(req, res) {
    try {
      await UserService.deleteProfilePicture(req.user.id);

      return sendResponse(res, 200, true, 'Profile picture removed');
    } catch (err) {
      console.error('deleteProfilePicture error:', err);

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Failed to remove profile picture');
    }
  }

  // ---------------- ADD TO FAVOURITES ----------------
  static async addToFavourites(req, res) {
    try {
      const userId = req.user?.id || req.user?._id;
      const { gameId } = req.params;

      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }

      const favourites = await UserService.addToFavourites(userId, gameId);

      return sendResponse(res, 200, true, 'Game added to favourites', {
        favourites,
      });
    } catch (err) {
      console.error('addToFavourites error:', err);

      if (err.message === 'Invalid game id') {
        return sendResponse(res, 400, false, err.message);
      }

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Failed to add game to favourites');
    }
  }

  // ---------------- REMOVE FROM FAVOURITES ----------------
  static async removeFromFavourites(req, res) {
    try {
      const userId = req.user?.id || req.user?._id;
      const { gameId } = req.params;

      if (!userId) {
        return sendResponse(res, 401, false, 'Unauthorized');
      }

      const favourites = await UserService.removeFromFavourites(userId, gameId);

      return sendResponse(res, 200, true, 'Game removed from favourites', {
        favourites,
      });
    } catch (err) {
      console.error('removeFromFavourites error:', err);

      if (err.message === 'Invalid game id') {
        return sendResponse(res, 400, false, err.message);
      }

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(
        res,
        500,
        false,
        'Failed to remove game from favourites'
      );
    }
  }
}

export default UserController;
