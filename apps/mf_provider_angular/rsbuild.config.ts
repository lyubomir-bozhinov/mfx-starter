import { createConfig } from '@nx/angular-rsbuild';
import { defaultAllowedOrigins } from '@rsbuild/core';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import mfConfig from './module-federation.config';

export default createConfig({
  options: {
    browser: './src/main.ts',
    index: './src/index.html',
    styles: [
      {
        input: './src/styles/styles.scss',
        inject: true,
        bundleName: 'styles',
      },
    ],
    stylePreprocessorOptions: {
      includePaths: ['./src/styles'],
      sass: {
        silenceDeprecations: ['import'],
      },
    },
    devServer: {
      port: 3001,
      cors: {
        origin: [defaultAllowedOrigins, 'https://example.com', process.env.MF_HOST_URL, process.env.MF_SVELTE_URL],
      },
    },
    assets: [],
  },
  rsbuildConfigOverrides: {
    plugins: [pluginModuleFederation(mfConfig)],
  },
});

