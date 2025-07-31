import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { XPBar } from './XPBar';

const meta: Meta<typeof XPBar> = {
  title: 'Components/XPBar',
  component: XPBar,
  argTypes: {
    level: { control: 'number' },
    currentXp: { control: 'number' },
    nextLevelXp: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof XPBar>;

export const Default: Story = {
  args: {
    level: 5,
    currentXp: 150,
    nextLevelXp: 500,
  },
};

export const NearlyLevelUp: Story = {
  args: {
    level: 12,
    currentXp: 1150,
    nextLevelXp: 1200,
  },
};

export const NewLevel: Story = {
  args: {
    level: 2,
    currentXp: 0,
    nextLevelXp: 250,
  },
};
