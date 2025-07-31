import { describe, test, expect } from '@jest/globals';
import { formatTimeAgo } from './formatTimeAgo';

describe('formatTimeAgo', () => {
  const now = new Date();

  test('should return seconds ago', () => {
    const past = new Date(now.getTime() - 30 * 1000); // 30 seconds ago
    expect(formatTimeAgo(past.toISOString())).toBe('30s ago');
  });

  test('should return minutes ago', () => {
    const past = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago
    expect(formatTimeAgo(past.toISOString())).toBe('15m ago');
  });

  test('should return hours ago', () => {
    const past = new Date(now.getTime() - 4 * 60 * 60 * 1000); // 4 hours ago
    expect(formatTimeAgo(past.toISOString())).toBe('4h ago');
  });

  test('should return days ago', () => {
    const past = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    expect(formatTimeAgo(past.toISOString())).toBe('3d ago');
  });

  test('should return months ago', () => {
    const past = new Date(now.getTime() - 2 * 30 * 24 * 60 * 60 * 1000); // 2 months ago
    expect(formatTimeAgo(past.toISOString())).toBe('2mo ago');
  });

  test('should return years ago', () => {
    const past = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000); // 3 years ago
    expect(formatTimeAgo(past.toISOString())).toBe('3y ago');
  });

  test('should handle just now case', () => {
    const past = new Date(now.getTime() - 5 * 1000); // 5 seconds ago
    expect(formatTimeAgo(past.toISOString())).toBe('5s ago');
  });
});