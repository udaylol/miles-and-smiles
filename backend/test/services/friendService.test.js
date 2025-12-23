import { describe, it, expect, jest } from '@jest/globals';
import mongoose from 'mongoose';

describe('FriendService', () => {
  describe('validateObjectId', () => {
    it('should not throw for valid ObjectId', async () => {
      const FriendService = await import('../../src/services/friendService.js');
      const validId = new mongoose.Types.ObjectId().toString();

      expect(() => {
        FriendService.default.validateObjectId(validId);
      }).not.toThrow();
    });

    it('should throw error for invalid ObjectId', async () => {
      const FriendService = await import('../../src/services/friendService.js');
      const invalidId = 'invalid-id';

      expect(() => {
        FriendService.default.validateObjectId(invalidId);
      }).toThrow('Invalid User id');
    });

    it('should throw error with custom field name', async () => {
      const FriendService = await import('../../src/services/friendService.js');
      const invalidId = 'invalid-id';

      expect(() => {
        FriendService.default.validateObjectId(invalidId, 'Friend id');
      }).toThrow('Invalid Friend id');
    });

    it('should throw error for empty string', async () => {
      const FriendService = await import('../../src/services/friendService.js');

      expect(() => {
        FriendService.default.validateObjectId('');
      }).toThrow('Invalid User id');
    });
  });
});

