import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { AppButton } from './AppButton';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'This is a Modal',
    children: (
      <div>
        <p>This is the content of the modal. It can be any React node.</p>
        <div className="modal-actions">
            <AppButton variant="secondary" onClick={() => alert('Cancelled')}>Cancel</AppButton>
            <AppButton variant="primary" onClick={() => alert('Confirmed')}>Confirm</AppButton>
        </div>
      </div>
    ),
  },
};
