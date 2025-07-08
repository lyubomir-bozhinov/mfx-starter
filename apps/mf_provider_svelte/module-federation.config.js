import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'mf_provider_svelte',
  exposes: {
    './SvelteWidget': './src/lib/SvelteWidget.svelte',
    './SvelteRoutes': './src/routes/SvelteRoutes.svelte',
  },
  shared: {
    svelte: {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    zustand: {
      singleton: true,
      strictVersion: true,
    },
    i18next: {
      singleton: true,
      strictVersion: true,
    },
  },
  dts: false,
});
