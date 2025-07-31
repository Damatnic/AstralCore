import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { AppButton } from './AppButton';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h2>This is a card</h2>
        <p>It can contain any content you want.</p>
      </div>
    ),
  },
};

export const EmptyState: Story = {
  args: {
    className: 'empty-state',
    children: (
      <div>
        <h2>Nothing to see here</h2>
        <p>This is an example of an empty state card.</p>
        <AppButton onClick={() => alert('Clicked!')}>Take Action</AppButton>
      </div>
    ),
  },
};
