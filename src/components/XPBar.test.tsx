import React from 'react';
import { screen } from '@testing-library/react';
import { describe, test, expect } from '@jest/globals';
import { render } from '../test-utils';
import { XPBar } from './XPBar';

describe('XPBar', () => {
  test('renders the correct level and XP text', () => {
    render(<XPBar level={5} currentXp={150} nextLevelXp={500} />);
    expect(screen.getByText('Level 5')).toBeInTheDocument();
    expect(screen.getByText('150 / 500 XP')).toBeInTheDocument();
  });

  test('calculates and applies the correct width percentage to the fill bar', () => {
    render(<XPBar level={5} currentXp={150} nextLevelXp={500} />);
    const fillElement = screen.getByTitle('Level 5 Progress').firstChild;
    // 150 / 500 = 0.3 -> 30%
    expect(fillElement).toHaveStyle('width: 30%');
  });

  test('handles zero nextLevelXp to prevent division by zero', () => {
    render(<XPBar level={1} currentXp={0} nextLevelXp={0} />);
    const fillElement = screen.getByTitle('Level 1 Progress').firstChild;
    expect(fillElement).toHaveStyle('width: 0%');
  });

  test('formats large numbers with commas', () => {
     render(<XPBar level={20} currentXp={12500} nextLevelXp={50000} />);
     expect(screen.getByText('12,500 / 50,000 XP')).toBeInTheDocument();
  });
});
