import { createModuleFederationConfig } from '@module-federation/enhanced/rspack';

export default createModuleFederationConfig({
  name: 'mf_provider_angular',
  exposes: {
    './AngularWidget': './src/app/angular-widget/angular-widget.component.ts',
    './AngularRoutes': './src/app/angular-routes/angular-routes-entry.component.ts',

    './mountAngularComponent': './src/bootstrap-mfe.ts',
    './unmountAngularComponent': './src/bootstrap-mfe.ts',
  },
  shared: {
    '@angular/core': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    '@angular/common': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    '@angular/router': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    '@angular/platform-browser': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    'rxjs': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    'zone.js': {
      singleton: true,
      strictVersion: true,
      eager: true,
    },
    'zustand': {
      singleton: true,
      strictVersion: true,
    },
    'i18next': {
      singleton: true,
      strictVersion: true,
    },
  },
  dts: false,
});

