import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'mf_host',
  remotes: {
    mf_provider_angular: `mf_provider_angular@${process.env.MF_ANGULAR_URL || 'http://localhost:3001'}/mf-manifest.json`,
    mf_provider_svelte: `mf_provider_svelte@${process.env.MF_SVELTE_URL || 'http://localhost:3002'}/mf-manifest.json`,
  },
  shared: {
    react: { singleton: true, strictVersion: true, eager: true },
    'react-dom': { singleton: true, strictVersion: true, eager: true },
    zustand: { singleton: true, strictVersion: true, eager: true },
    i18next: { singleton: true, strictVersion: true, eager: true },
    'react-router-dom': { singleton: true, strictVersion: true, eager: true },
    'react-i18next': { singleton: true, strictVersion: true, eager: true },
    'lucide-react': { singleton: true, strictVersion: true, eager: true },
  },
  dts: false,
});

