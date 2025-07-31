import React from 'react';
import { screen, act } from '@testing-library/react';
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { render } from '../test-utils';
import { ToastContainer } from './Toast';
import { useNotification } from '../contexts/NotificationContext';

// A helper component to trigger toasts
const ToastTrigger: React.FC<{ message: string; type: 'success' | 'error' | 'info' }> = ({ message, type }) => {
  const { addToast } = useNotification();
  return <button onClick={() => addToast(message, type)}>Add Toast</button>;
};

describe('ToastContainer and Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('renders a toast when addToast is called', async () => {
    render(
      <>
        <ToastContainer />
        <ToastTrigger message="Success!" type="success" />
      </>
    );

    const button = screen.getByText('Add Toast');
    act(() => {
      button.click();
    });

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Success!').closest('.toast')).toHaveClass('toast-success');
  });

  test('removes a toast after the timeout', async () => {
    render(
      <>
        <ToastContainer />
        <ToastTrigger message="Will Disappear" type="info" />
      </>
    );

    const button = screen.getByText('Add Toast');
    act(() => {
      button.click();
    });

    const toastMessage = screen.getByText('Will Disappear');
    expect(toastMessage).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(toastMessage).not.toBeInTheDocument();
  });

  test('renders multiple toasts', () => {
    render(
      <>
        <ToastContainer />
        <ToastTrigger message="First" type="success" />
        <ToastTrigger message="Second" type="error" />
      </>
    );

    const buttons = screen.getAllByText('Add Toast');
    act(() => {
        buttons[0].click();
    });
     act(() => {
        buttons[1].click();
    });

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
