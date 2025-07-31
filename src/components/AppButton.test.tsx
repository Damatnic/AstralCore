import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, jest } from '@jest/globals';
import { render } from '../test-utils';
import { AppButton } from './AppButton';
import { HeartIcon } from './icons';

describe('AppButton', () => {
  test('renders with children', () => {
    render(<AppButton onClick={() => {}}>Click Me</AppButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<AppButton onClick={handleClick}>Click Me</AppButton>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    const handleClick = jest.fn();
    render(<AppButton onClick={handleClick} disabled>Disabled</AppButton>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('shows loading spinner when isLoading is true', () => {
    render(<AppButton onClick={() => {}} isLoading>Loading</AppButton>);
    expect(screen.getByRole('button')).toContainHTML('<div class="loading-spinner"></div>');
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
  });

  test('renders with an icon', () => {
    render(<AppButton onClick={() => {}} icon={<HeartIcon />}>Like</AppButton>);
    expect(screen.getByText('Like')).toBeInTheDocument();
    // Check if SVG is rendered
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument();
  });
});
