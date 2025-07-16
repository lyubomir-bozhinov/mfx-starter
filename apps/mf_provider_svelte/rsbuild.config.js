import { defineConfig, defaultAllowedOrigins } from '@rsbuild/core';
import { pluginSvelte } from '@rsbuild/plugin-svelte';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import mfConfig from './module-federation.config';

export default defineConfig({
  plugins: [
    pluginSvelte(),
    pluginModuleFederation(mfConfig),
  ],
  html: {
    template: './public/index.html',
  },
  source: {
    entry: {
      index: './src/main.js',
    },
  },
  server: {
    port: 3002,
    cors: {
      origin: [defaultAllowedOrigins, 'https://example.com', process.env.MF_HOST_URL, process.env.MF_AANGULAR_URL],
    },
  },
});
