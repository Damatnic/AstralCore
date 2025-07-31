import React from 'react';
import { screen } from '@testing-library/react';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { render } from '../test-utils';
import { Modal } from './Modal';
import userEvent from '@testing-library/user-event';

describe('Modal', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
  });

  test('does not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={onCloseMock} title="Test Modal"><div>Content</div></Modal>);
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  test('renders with title and children when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={onCloseMock} title="Test Modal"><div>Modal Content</div></Modal>);
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('calls onClose when the close button is clicked', async () => {
    render(<Modal isOpen={true} onClose={onCloseMock} title="Test Modal"><div>Content</div></Modal>);
    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when the overlay is clicked and isDismissible is true', async () => {
    render(<Modal isOpen={true} onClose={onCloseMock} title="Test Modal"><div>Content</div></Modal>);
    // The overlay is the parent div with the specific class
    const overlay = screen.getByText('Test Modal').closest('.modal-overlay');
    await userEvent.click(overlay!);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when the overlay is clicked and isDismissible is false', async () => {
    render(<Modal isOpen={true} onClose={onCloseMock} title="Test Modal" isDismissible={false}><div>Content</div></Modal>);
    const overlay = screen.getByText('Test Modal').closest('.modal-overlay');
    await userEvent.click(overlay!);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test('does not render the close button when isDismissible is false', () => {
    render(<Modal isOpen={true} onClose={onCloseMock} title="Test Modal" isDismissible={false}><div>Content</div></Modal>);
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });
});
