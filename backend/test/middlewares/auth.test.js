import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { verifyToken } from '../../src/utils/jwt.js';
import { sendResponse } from '../../src/utils/response.js';

// Mock dependencies
jest.unstable_mockModule('../../src/utils/jwt.js', () => ({
  verifyToken: jest.fn(),
}));

jest.unstable_mockModule('../../src/utils/response.js', () => ({
  sendResponse: jest.fn(),
}));

describe('Auth Middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      cookies: {},
      headers: {},
    };

    mockRes = {
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.jsonData = data;
        return this;
      },
      statusCode: null,
      jsonData: null,
    };

    mockNext = function () {};
  });

  describe('auth middleware', () => {
    it('should authenticate user with valid token from cookies', async () => {
      const { verifyToken } = await import('../../src/utils/jwt.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      verifyToken.mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockReq.cookies.token = 'valid-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockReq.user).toEqual({ id: '507f1f77bcf86cd799439011' });
      expect(nextCalled).toBe(true);
    });

    it('should authenticate user with valid token from Authorization header', async () => {
      const { verifyToken } = await import('../../src/utils/jwt.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      verifyToken.mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockReq.headers.authorization = 'Bearer valid-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockReq.user).toEqual({ id: '507f1f77bcf86cd799439011' });
      expect(nextCalled).toBe(true);
    });

    it('should return 401 if no token provided', async () => {
      const { sendResponse } = await import('../../src/utils/response.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, false, 'Not authenticated');
      expect(nextCalled).toBe(false);
    });

    it('should return 401 if token is invalid', async () => {
      const { verifyToken } = await import('../../src/utils/jwt.js');
      const { sendResponse } = await import('../../src/utils/response.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      verifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockReq.cookies.token = 'invalid-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, false, 'Token invalid or expired');
      expect(nextCalled).toBe(false);
    });

    it('should return 401 if token is expired', async () => {
      const { verifyToken } = await import('../../src/utils/jwt.js');
      const { sendResponse } = await import('../../src/utils/response.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      verifyToken.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });
      mockReq.headers.authorization = 'Bearer expired-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, false, 'Token invalid or expired');
      expect(nextCalled).toBe(false);
    });

    it('should prefer cookie token over Authorization header', async () => {
      const { verifyToken } = await import('../../src/utils/jwt.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      verifyToken.mockReturnValue({ _id: '507f1f77bcf86cd799439011' });
      mockReq.cookies.token = 'cookie-token';
      mockReq.headers.authorization = 'Bearer header-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(verifyToken).toHaveBeenCalledWith('cookie-token');
      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(nextCalled).toBe(true);
    });

    it('should handle Authorization header without Bearer prefix', async () => {
      const { sendResponse } = await import('../../src/utils/response.js');
      const auth = (await import('../../src/middlewares/auth.js')).auth;

      mockReq.headers.authorization = 'not-bearer-token';

      let nextCalled = false;
      mockNext = () => {
        nextCalled = true;
      };

      await auth(mockReq, mockRes, mockNext);

      expect(sendResponse).toHaveBeenCalledWith(mockRes, 401, false, 'Not authenticated');
      expect(nextCalled).toBe(false);
    });
  });
});

