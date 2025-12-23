import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import mongoose from 'mongoose';

describe('UserService', () => {
  describe('validateObjectId', () => {
    it('should not throw for valid ObjectId', async () => {
      const UserService = await import('../../src/services/userService.js');
      const validId = new mongoose.Types.ObjectId().toString();

      expect(() => {
        UserService.default.validateObjectId(validId);
      }).not.toThrow();
    });

    it('should throw error for invalid ObjectId', async () => {
      const UserService = await import('../../src/services/userService.js');
      const invalidId = 'invalid-id';

      expect(() => {
        UserService.default.validateObjectId(invalidId);
      }).toThrow('Invalid user id');
    });

    it('should throw error for empty string', async () => {
      const UserService = await import('../../src/services/userService.js');

      expect(() => {
        UserService.default.validateObjectId('');
      }).toThrow('Invalid user id');
    });
  });

  describe('validateGameId', () => {
    it('should not throw for valid ObjectId', async () => {
      const UserService = await import('../../src/services/userService.js');
      const validId = new mongoose.Types.ObjectId().toString();

      expect(() => {
        UserService.default.validateGameId(validId);
      }).not.toThrow();
    });

    it('should throw error for invalid ObjectId', async () => {
      const UserService = await import('../../src/services/userService.js');
      const invalidId = 'invalid-game-id';

      expect(() => {
        UserService.default.validateGameId(invalidId);
      }).toThrow('Invalid game id');
    });
  });
});

