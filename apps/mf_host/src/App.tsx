import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore, i18nInstance } from '@mfx/shared-utils';
import { GlobalNotification, ErrorBoundary, LoadingSpinner, Button } from '@mfx/ui-components';
import { Menu, Home, User, LogOut, Globe } from 'lucide-react';
import ErrorBoundaryComponent from './components/ErrorBoundary';
import AngularWrapper from './components/AngularWrapper';
import { loadRemote } from '@module-federation/enhanced/runtime';

// Helper function for fallbacks (to keep the code cleaner)
const getFallback = (name) => () => (
  <div className="mfe-container">
    <div className="text-center py-8">
      <div className="text-red-500 mb-2">⚠️</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{name} Unavailable</h3>
      <p className="text-gray-600">The {name} microfrontend is currently unavailable. Please try again later.</p>
    </div>
  </div>
);

const SvelteWidget = React.lazy(() =>
  loadRemote('mf_provider_svelte/SvelteWidget')
    .then((module) => {
      // Check if the component exists in the loaded module.
        return { default: module.default };
console.log('svelte module', module);
      // If module.SvelteWidget is undefined, return the fallback module.
      console.error('SvelteWidget component not found in remote module.');
      return { default: getFallback('Svelte Widget') };
    })
    .catch((error) => {
      // Catch network errors or other loading failures
      console.error('Failed to load SvelteWidget remote module:', error);
      return { default: getFallback('Svelte Widget') };
    })
);

const SvelteRoutes = React.lazy(() =>
  loadRemote('mf_provider_svelte/SvelteRoutes')
    .then((module) => {
      // Check if the component exists
      if (module.SvelteRoutes) {
        return { default: module.SvelteRoutes };
      }

      console.error('SvelteRoutes component not found in remote module.');
      return { default: getFallback('Svelte Routes') };
    })
    .catch((error) => {
      console.error('Failed to load SvelteRoutes remote module:', error);
      return { default: getFallback('Svelte Routes') };
    })
);


function App() {
  const { t } = useTranslation(); // Removed i18n from destructuring as it's imported directly
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuthStore();

  const [angularMountFns, setAngularMountFns] = useState({
    mountAngularComponent: null,
    unmountAngularComponent: null,
  });
  const [angularFnsLoading, setAngularFnsLoading] = useState(true);
  const [angularFnsError, setAngularFnsError] = useState(null);

  // Load Angular mount/unmount functions once
  useEffect(() => {
    loadRemote('mf_provider_angular/mountAngularComponent')
      .then((module) => {
        if (typeof module.mountAngularComponent === 'function') {
          setAngularMountFns({
            mountAngularComponent: module.mountAngularComponent,
            unmountAngularComponent: module.unmountAngularComponent || null,
          });
          setAngularFnsLoading(false);
        } else {
          const msg = "Angular 'mountAngularComponent' function not found in remote module.";
          console.error(msg, module);
          setAngularFnsError(msg);
          setAngularFnsLoading(false);
        }
      })
      .catch((error) => {
        const msg = `Failed to load Angular mount functions: ${error.message}`;
        console.error(msg, error);
        setAngularFnsError(msg);
        setAngularFnsLoading(false);
      });
  }, []);

  // Use useMemo to conditionally define the lazy Angular components
  // They will only be properly defined as React.lazy components once
  // angularMountFns are loaded. Otherwise, they'll return a fallback.
  const AngularWidget = useMemo(() => {
    if (angularFnsLoading || angularFnsError) {
      // If core Angular functions are not ready, return a component that shows loading/error immediately
      return getFallback('Angular Widget');
    }

    return React.lazy(async () => {
      try {
        // Now that mount functions are ready, load the specific component module
        const componentModule = await loadRemote(`mf_provider_angular/AngularWidget`);

        if (!componentModule.AngularWidgetComponent) {
          console.error(`Component 'AngularWidgetComponent' not found in remote module 'AngularWidget'.`);
          return { default: getFallback('Angular Widget') };
        }

        return {
          default: (props) => (
            <AngularWrapper
              loadAngularComponentModule={() => Promise.resolve(componentModule)}
              mountAngularComponentFn={angularMountFns.mountAngularComponent}
              unmountAngularComponentFn={angularMountFns.unmountAngularComponent}
              componentExportName="AngularWidgetComponent"
              {...props}
            />
          ),
        };
      } catch (error) {
        console.error(`Failed to load AngularWidget remote module:`, error);
        return { default: getFallback('Angular Widget') };
      }
    });
  }, [angularFnsLoading, angularFnsError, angularMountFns]); // Dependencies for useMemo


  const AngularRoutes = useMemo(() => {
    if (angularFnsLoading || angularFnsError) {
      return getFallback('Angular Routes');
    }

    return React.lazy(async () => {
      try {
        const componentModule = await loadRemote(`mf_provider_angular/AngularRoutes`);

        if (!componentModule.AngularRoutesEntryComponent) {
          console.error(`Component 'AngularRoutesComponent' not found in remote module 'AngularRoutes'.`);
          return { default: getFallback('Angular Routes') };
        }

        return {
          default: (props) => (
            <AngularWrapper
              loadAngularComponentModule={() => Promise.resolve(componentModule)}
              mountAngularComponentFn={angularMountFns.mountAngularComponent}
              unmountAngularComponentFn={angularMountFns.unmountAngularComponent}
              componentExportName="AngularRoutesEntryComponent"
              {...props}
            />
          ),
        };
      } catch (error) {
        console.error(`Failed to load AngularRoutes remote module:`, error);
        return { default: getFallback('Angular Routes') };
      }
    });
  }, [angularFnsLoading, angularFnsError, angularMountFns]);


  const handleLanguageChange = (lang: string) => {
    i18nInstance.changeLanguage(lang); // Use i18nInstance directly
  };

  const handleLogout = () => {
    logout();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <Menu className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('mfe.host.title')}</h1>
                <p className="text-xs text-gray-500">Module Federation Starter</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-1">
              <Link
                to="/"
                className={`navigation-link ${
                  isActiveRoute('/') && location.pathname === '/'
                    ? 'navigation-link-active'
                    : 'navigation-link-inactive'
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                {t('home')}
              </Link>
              <Link
                to="/angular"
                className={`navigation-link ${
                  isActiveRoute('/angular')
                    ? 'navigation-link-active'
                    : 'navigation-link-inactive'
                }`}
              >
                {t('mfe.angular.title')}
              </Link>
              <Link
                to="/svelte"
                className={`navigation-link ${
                  isActiveRoute('/svelte')
                    ? 'navigation-link-active'
                    : 'navigation-link-inactive'
                }`}
              >
                {t('mfe.svelte.title')}
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <select
                  value={i18nInstance.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              {/* User Menu */}
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="sm">
                  {t('login')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Suspense fallback={
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600">{t('loading')}</span>
            </div>
          }>
            <Routes>
              {/* Home Page */}
              <Route path="/" element={
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Welcome to MFX Starter
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      A comprehensive microfrontends architecture demonstration using Module Federation
                      with React, Angular, and Svelte working together seamlessly.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Angular Widget */}
                    <ErrorBoundaryComponent>
                      <div className="mfe-container">
                        <h3 className="mfe-header">{t('mfe.angular.title')}</h3>
                        <Suspense fallback={<LoadingSpinner />}>
                          <AngularWidget
                            title="Angular Component"
                            data={{ message: "Hello from Angular!" }}
                            config={{ theme: 'light', size: 'medium' }}
                          />
                        </Suspense>
                      </div>
                    </ErrorBoundaryComponent>

                    {/* Svelte Widget */}
                    <ErrorBoundaryComponent>
                      <div className="mfe-container">
                        <h3 className="mfe-header">{t('mfe.svelte.title')}</h3>
                        <Suspense fallback={<LoadingSpinner />}>
                          <SvelteWidget
                            title="Svelte Component"
                            items={[
                              { id: 1, name: "Item 1", status: "active" },
                              { id: 2, name: "Item 2", status: "pending" }
                            ]}
                            config={{ theme: 'light', showHeader: true }}
                          />
                        </Suspense>
                      </div>
                    </ErrorBoundaryComponent>
                  </div>
                </div>
              } />

              {/* Angular Routes */}
              <Route path="/angular/*" element={
                <ErrorBoundaryComponent>
                  <Suspense fallback={
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  }>
                    <AngularRoutes basePath="/angular" />
                  </Suspense>
                </ErrorBoundaryComponent>
              } />

              {/* Svelte Routes */}
              <Route path="/svelte/*" element={
                <ErrorBoundaryComponent>
                  <Suspense fallback={
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" />
                    </div>
                  }>
                    <SvelteRoutes basePath="/svelte" />
                  </Suspense>
                </ErrorBoundaryComponent>
              } />

              {/* 404 Page */}
              <Route path="*" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                  <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
                  <Link to="/">
                    <Button variant="primary">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                </div>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Global Notification System */}
      <GlobalNotification position="top-right" />
    </div>
  );
}

export default App;
