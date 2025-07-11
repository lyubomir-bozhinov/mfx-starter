import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '@mfx/ui-components';

const AngularWrapper = ({
  loadAngularComponentModule,
  mountAngularComponentFn,
  unmountAngularComponentFn,
  componentExportName,
  ...props
}) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    loadAngularComponentModule()
      .then((module) => {
        const AngularComponentClass = module[componentExportName] || module.default;

        if (AngularComponentClass && typeof mountAngularComponentFn === 'function') {
          try {
            cleanupRef.current = mountAngularComponentFn(containerRef.current, AngularComponentClass, props);
            setLoading(false);
          } catch (e) {
            console.error(`[AngularWrapper] Error during Angular component mount (component: ${componentExportName}):`, e);
            setError(`Failed to mount Angular component '${componentExportName}': ${e.message}`);
            setLoading(false);
          }
        } else if (!AngularComponentClass) {
          const msg = `Angular component export '${componentExportName}' or 'default' not found in the loaded module.`;
          console.error(`[AngularWrapper] ${msg} Loaded module:`, module);
          setError(msg);
          setLoading(false);
        } else if (typeof mountAngularComponentFn !== 'function') {
          const msg = `Angular mount function ('mountAngularComponent') not provided or not a function. Cannot render '${componentExportName}'.`;
          console.error(`[AngularWrapper] ${msg}`);
          setError(msg);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(`[AngularWrapper] Failed to load Angular remote component module for ${componentExportName}:`, err);
        setError(`Failed to load Angular component module for '${componentExportName}': ${err.message}`);
        setLoading(false);
      });

    return () => {
      // Ensure cleanupRef.current is a function before calling it
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      } else if (unmountAngularComponentFn && containerRef.current) {
        unmountAngularComponentFn(containerRef.current);
      }
    };
  }, [loadAngularComponentModule, mountAngularComponentFn, unmountAngularComponentFn, componentExportName, props, containerRef]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg">
          <LoadingSpinner />
        </div>
      )}
      {error && !loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 z-10 rounded-lg p-4">
          <div className="text-red-700 text-center">
            <h4 className="font-semibold mb-2">Error Loading Angular Component</h4>
            <p>{error}</p>
            <p className="text-sm text-gray-700 mt-2">
              Please ensure the Angular microfrontend exposes the component and `mountAngularComponent`/`unmountAngularComponent` functions correctly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AngularWrapper;

