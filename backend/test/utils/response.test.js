import { describe, it, expect, beforeEach } from '@jest/globals';
import { sendResponse } from '../../src/utils/response.js';

describe('Response Utils', () => {
  let mockRes;

  beforeEach(() => {
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
  });

  describe('sendResponse', () => {
    it('should send response with all parameters', () => {
      const statusCode = 200;
      const success = true;
      const message = 'Success';
      const data = { id: 1, name: 'Test' };

      sendResponse(mockRes, statusCode, success, message, data);

      expect(mockRes.statusCode).toBe(statusCode);
      expect(mockRes.jsonData).toEqual({
        success,
        message,
        data,
      });
    });

    it('should send response without data parameter', () => {
      const statusCode = 200;
      const success = true;
      const message = 'Success';

      sendResponse(mockRes, statusCode, success, message);

      expect(mockRes.statusCode).toBe(statusCode);
      expect(mockRes.jsonData).toEqual({
        success,
        message,
        data: null,
      });
    });

    it('should handle error responses', () => {
      const statusCode = 400;
      const success = false;
      const message = 'Bad Request';
      const data = { error: 'Validation failed' };

      sendResponse(mockRes, statusCode, success, message, data);

      expect(mockRes.statusCode).toBe(statusCode);
      expect(mockRes.jsonData).toEqual({
        success,
        message,
        data,
      });
    });

    it('should handle 404 responses', () => {
      const statusCode = 404;
      const success = false;
      const message = 'Not Found';

      sendResponse(mockRes, statusCode, success, message);

      expect(mockRes.statusCode).toBe(statusCode);
      expect(mockRes.jsonData).toEqual({
        success,
        message,
        data: null,
      });
    });

    it('should handle 500 responses', () => {
      const statusCode = 500;
      const success = false;
      const message = 'Internal Server Error';

      sendResponse(mockRes, statusCode, success, message);

      expect(mockRes.statusCode).toBe(statusCode);
      expect(mockRes.jsonData).toEqual({
        success,
        message,
        data: null,
      });
    });

    it('should return the response object', () => {
      const result = sendResponse(mockRes, 200, true, 'Success');

      expect(result).toBe(mockRes);
    });
  });
});

