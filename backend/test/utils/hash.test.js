import { describe, it, expect } from '@jest/globals';
import { hashPassword, comparePassword } from '../../src/utils/hash.js';

describe('Hash Utils', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);

      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should produce different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should hash empty string', async () => {
      const hashed = await hashPassword('');
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password and hash', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      const result = await comparePassword(password, hashed);

      expect(result).toBe(true);
    });

    it('should return false for non-matching password and hash', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword';
      const hashed = await hashPassword(password);
      const result = await comparePassword(wrongPassword, hashed);

      expect(result).toBe(false);
    });

    it('should return false for empty password with non-empty hash', async () => {
      const password = 'testPassword123';
      const hashed = await hashPassword(password);
      const result = await comparePassword('', hashed);

      expect(result).toBe(false);
    });

    it('should handle empty string comparison', async () => {
      const hashed = await hashPassword('');
      const result = await comparePassword('', hashed);

      expect(result).toBe(true);
    });
  });
});

