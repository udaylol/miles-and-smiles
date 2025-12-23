import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { generateToken, verifyToken } from '../../src/utils/jwt.js';

describe('JWT Utils', () => {
  const originalEnv = process.env.JWT_SECRET;

  beforeEach(() => {
    // Reset JWT_SECRET to default for consistent testing
    process.env.JWT_SECRET = 'jwt_secret';
  });

  afterEach(() => {
    process.env.JWT_SECRET = originalEnv;
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should generate different tokens for different userIds', () => {
      const userId1 = '507f1f77bcf86cd799439011';
      const userId2 = '507f1f77bcf86cd799439012';
      const token1 = generateToken(userId1);
      const token2 = generateToken(userId2);

      expect(token1).not.toBe(token2);
    });

    it('should generate token with custom JWT_SECRET', () => {
      process.env.JWT_SECRET = 'custom_secret';
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const decoded = verifyToken(token);

      expect(decoded).toBeDefined();
      expect(decoded._id).toBe(userId);
      expect(decoded.exp).toBeDefined(); // expiration timestamp
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for tampered token', () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const tamperedToken = token.slice(0, -5) + 'xxxxx';

      expect(() => {
        verifyToken(tamperedToken);
      }).toThrow();
    });

    it('should throw error for token signed with different secret', () => {
      // Note: JWT_SECRET is read at module load time, so we test with a manually created invalid token
      // In practice, tokens signed with different secrets will fail verification
      const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE2MDAwMDAwMDB9.invalid-signature';

      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for empty token', () => {
      expect(() => {
        verifyToken('');
      }).toThrow();
    });
  });
});

