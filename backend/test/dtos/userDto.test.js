import { describe, it, expect } from '@jest/globals';
import { publicUserDTO, privateUserDTO } from '../../src/dtos/userDto.js';

describe('User DTOs', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    username: 'testuser',
    gender: 'male',
    birthday: new Date('1990-01-01'),
    friends: ['507f1f77bcf86cd799439012'],
    password: 'hashedPassword', // Should not be included
  };

  describe('publicUserDTO', () => {
    it('should return public user data without sensitive fields', () => {
      const result = publicUserDTO(mockUser);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
      });

      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('gender');
      expect(result).not.toHaveProperty('birthday');
      expect(result).not.toHaveProperty('friends');
    });

    it('should map _id to id', () => {
      const result = publicUserDTO(mockUser);

      expect(result.id).toBe(mockUser._id);
      expect(result).not.toHaveProperty('_id');
    });

    it('should handle user with minimal fields', () => {
      const minimalUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
      };

      const result = publicUserDTO(minimalUser);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
      });
    });
  });

  describe('privateUserDTO', () => {
    it('should return private user data with additional fields', () => {
      const result = privateUserDTO(mockUser);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
        gender: 'male',
        birthday: new Date('1990-01-01'),
        friends: ['507f1f77bcf86cd799439012'],
      });

      expect(result).not.toHaveProperty('password');
    });

    it('should map _id to id', () => {
      const result = privateUserDTO(mockUser);

      expect(result.id).toBe(mockUser._id);
      expect(result).not.toHaveProperty('_id');
    });

    it('should handle user with null optional fields', () => {
      const userWithNulls = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
        gender: null,
        birthday: null,
        friends: [],
      };

      const result = privateUserDTO(userWithNulls);

      expect(result).toEqual({
        id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        username: 'testuser',
        gender: null,
        birthday: null,
        friends: [],
      });
    });
  });
});

