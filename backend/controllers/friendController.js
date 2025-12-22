import FriendService from '../services/friendService.js';
import { sendResponse } from '../utils/response.js';

class FriendController {
  // ---------------- GET FRIENDS ----------------
  static async getFriends(req, res) {
    try {
      const friends = await FriendService.getFriends(req.user.id);

      return sendResponse(
        res,
        200,
        true,
        'Friends fetched successfully',
        friends
      );
    } catch (err) {
      console.error('getFriends error:', err);

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- GET FRIEND REQUESTS ----------------
  static async getFriendRequests(req, res) {
    try {
      const requests = await FriendService.getFriendRequests(req.user.id);

      return sendResponse(
        res,
        200,
        true,
        'Friend requests fetched successfully',
        requests
      );
    } catch (err) {
      console.error('getFriendRequests error:', err);

      if (err.message === 'User not found') {
        return sendResponse(res, 404, false, err.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- SEND FRIEND REQUEST ----------------
  static async sendFriendRequest(req, res) {
    try {
      const senderId = req.user.id;
      const receiverId = req.params.id;

      await FriendService.sendFriendRequest(senderId, receiverId);

      return sendResponse(res, 200, true, 'Friend request sent');
    } catch (err) {
      console.error('sendFriendRequest error:', err);

      const errorMessages = {
        'Invalid User id': { status: 400, message: err.message },
        'You cannot add yourself': { status: 400, message: err.message },
        'User not found': { status: 404, message: err.message },
        'Already friends': { status: 400, message: err.message },
        'Request already pending': { status: 400, message: err.message },
      };

      const error = errorMessages[err.message];
      if (error) {
        return sendResponse(res, error.status, false, error.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- ACCEPT FRIEND REQUEST ----------------
  static async acceptFriendRequest(req, res) {
    try {
      const receiverId = req.user.id;
      const senderId = req.params.id;

      await FriendService.acceptFriendRequest(receiverId, senderId);

      return sendResponse(res, 200, true, 'Friend request accepted');
    } catch (err) {
      console.error('acceptFriendRequest error:', err);

      const errorMessages = {
        'Invalid User id': { status: 400, message: err.message },
        'User not found': { status: 404, message: err.message },
        'No request from this user': { status: 400, message: err.message },
      };

      const error = errorMessages[err.message];
      if (error) {
        return sendResponse(res, error.status, false, error.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- DELETE FRIEND REQUEST ----------------
  static async deleteFriendRequest(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      await FriendService.deleteFriendRequest(uid1, uid2);

      return sendResponse(res, 200, true, 'Friend request removed');
    } catch (err) {
      console.error('deleteFriendRequest error:', err);

      const errorMessages = {
        'Invalid User id': { status: 400, message: err.message },
        'User not found': { status: 404, message: err.message },
      };

      const error = errorMessages[err.message];
      if (error) {
        return sendResponse(res, error.status, false, error.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }

  // ---------------- DELETE FRIEND ----------------
  static async deleteFriend(req, res) {
    try {
      const uid1 = req.user.id;
      const uid2 = req.params.id;

      await FriendService.deleteFriend(uid1, uid2);

      return sendResponse(res, 200, true, 'Friend removed');
    } catch (err) {
      console.error('deleteFriend error:', err);

      const errorMessages = {
        'Invalid User id': { status: 400, message: err.message },
        'User not found': { status: 404, message: err.message },
      };

      const error = errorMessages[err.message];
      if (error) {
        return sendResponse(res, error.status, false, error.message);
      }

      return sendResponse(res, 500, false, 'Server error');
    }
  }
}

export default FriendController;
