import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonPostCard } from './SkeletonPostCard';

const meta: Meta<typeof SkeletonPostCard> = {
  title: 'Components/SkeletonPostCard',
  component: SkeletonPostCard,
};

export default meta;
type Story = StoryObj<typeof SkeletonPostCard>;

export const Default: Story = {
  render: () => (
    <ul className="posts-list" style={{ maxWidth: '600px' }}>
      <SkeletonPostCard />
    </ul>
  ),
};
