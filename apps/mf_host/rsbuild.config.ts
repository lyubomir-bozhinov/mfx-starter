import { defineConfig, defaultAllowedOrigins } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import mfConfig from './module-federation.config';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation(mfConfig),
  ],
  server: {
    port: 3000,
    cors: {
      origin: [defaultAllowedOrigins, 'https://example.com'],
    },
  },
  html: {
    template: './public/index.html',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
});

