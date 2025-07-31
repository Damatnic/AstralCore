import { describe, test, expect } from '@jest/globals';
import { truncateText } from './truncateText';

describe('truncateText', () => {
  test('should truncate text longer than maxLength', () => {
    const longText = 'This is a very long text that needs to be truncated.';
    const maxLength = 20;
    const expected = 'This is a very long ...';
    expect(truncateText(longText, maxLength)).toBe(expected);
  });

  test('should not truncate text shorter than or equal to maxLength', () => {
    const shortText = 'Short text.';
    const maxLength = 20;
    expect(truncateText(shortText, maxLength)).toBe(shortText);
  });

  test('should return the full text if its length is equal to maxLength', () => {
    const text = 'This text has 20 char'; // length is 20
    const maxLength = 20;
    expect(truncateText(text, maxLength)).toBe(text);
  });
});