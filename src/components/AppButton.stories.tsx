import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppButton } from './AppButton';
import { HeartIcon } from './icons';

const meta: Meta<typeof AppButton> = {
  title: 'Components/AppButton',
  component: AppButton,
  argTypes: {
    onClick: { action: 'clicked' },
    children: { control: 'text' },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger', 'success', 'ghost'],
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AppButton>;

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    onClick: () => {},
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    onClick: () => {},
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
    onClick: () => {},
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
    onClick: () => {},
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    onClick: () => {},
  },
};

export const WithIcon: Story = {
  args: {
    children: 'With Icon',
    variant: 'primary',
    icon: <HeartIcon />,
    onClick: () => {},
  },
};


export const IsLoading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    isLoading: true,
    onClick: () => {},
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
    onClick: () => {},
  },
};
