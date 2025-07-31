import React from 'react';
import type { Preview, Decorator } from "@storybook/react";
import { ThemeProvider } from '../src/contexts/ThemeContext';
import '../index.css';

const withTheme: Decorator = (Story, context) => {
  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
