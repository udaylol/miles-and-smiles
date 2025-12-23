import { describe, it, expect } from '@jest/globals';
import { isSameObject } from '../../src/utils/compare.js';

describe('Compare Utils', () => {
  describe('isSameObject', () => {
    it('should return true when objects are the same', () => {
      const original = { name: 'John', age: 30 };
      const updates = { name: 'John', age: 30 };

      expect(isSameObject(original, updates)).toBe(true);
    });

    it('should return false when objects differ', () => {
      const original = { name: 'John', age: 30 };
      const updates = { name: 'Jane', age: 30 };

      expect(isSameObject(original, updates)).toBe(false);
    });

    it('should return true when updates are empty', () => {
      const original = { name: 'John', age: 30 };
      const updates = {};

      expect(isSameObject(original, updates)).toBe(true);
    });

    it('should ignore undefined values in updates', () => {
      const original = { name: 'John', age: 30 };
      const updates = { name: 'John', age: undefined };

      expect(isSameObject(original, updates)).toBe(true);
    });

    it('should handle Date objects correctly', () => {
      const date1 = new Date('2023-01-01');
      const date2 = new Date('2023-01-01');
      const date3 = new Date('2023-01-02');

      const original = { birthday: date1 };
      const updates1 = { birthday: date2 };
      const updates2 = { birthday: date3 };

      expect(isSameObject(original, updates1)).toBe(true);
      expect(isSameObject(original, updates2)).toBe(false);
    });

    it('should handle mixed Date and string dates', () => {
      const original = { birthday: new Date('2023-01-01') };
      const updates = { birthday: '2023-01-01' };

      // Should compare as dates
      expect(isSameObject(original, updates)).toBe(true);
    });

    it('should handle numeric string comparisons', () => {
      const original = { age: 30 };
      const updates1 = { age: '30' };
      const updates2 = { age: '31' };

      expect(isSameObject(original, updates1)).toBe(true);
      expect(isSameObject(original, updates2)).toBe(false);
    });

    it('should handle partial updates', () => {
      const original = { name: 'John', age: 30, city: 'NYC' };
      const updates = { name: 'John' };

      expect(isSameObject(original, updates)).toBe(true);
    });

    it('should return false for partial updates with changes', () => {
      const original = { name: 'John', age: 30, city: 'NYC' };
      const updates = { name: 'Jane' };

      expect(isSameObject(original, updates)).toBe(false);
    });

    it('should handle boolean values', () => {
      const original = { active: true };
      const updates1 = { active: true };
      const updates2 = { active: false };

      expect(isSameObject(original, updates1)).toBe(true);
      expect(isSameObject(original, updates2)).toBe(false);
    });

    it('should handle null values', () => {
      const original = { value: null };
      const updates = { value: null };

      expect(isSameObject(original, updates)).toBe(true);
    });
  });
});

