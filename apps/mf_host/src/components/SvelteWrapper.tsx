// src/components/SvelteWrapper.tsx
import React, { useEffect, useRef, useState } from 'react';
import { LoadingSpinner } from '@mfx/ui-components';

// Explicitly destructure the props that SvelteComponent expects
const SvelteWrapper = ({
  SvelteComponent,
  mountSvelteComponentFn,
  title,
  items,
  config,
  ...restProps
}) => {
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Combine all relevant props for the Svelte component into a single object
  // This object will be passed to the Svelte mount function.
  const svelteComponentProps = { title, items, config, ...restProps };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (typeof mountSvelteComponentFn !== 'function') {
      const msg =
        'Svelte mount function is not available or not a function. Ensure Svelte MFE exposes "mountSvelteComponent".';
      console.error(`[SvelteWrapper] ${msg}`, mountSvelteComponentFn);
      setError(msg);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let destroySvelteComponent: (() => void) | null = null;

    try {
      // Call the mount function provided by the Svelte microfrontend.
      // Pass the combined props.
      destroySvelteComponent = mountSvelteComponentFn(SvelteComponent, {
        target: containerRef.current,
        props: svelteComponentProps, // Pass the combined props object
      });

      setLoading(false);
    } catch (e) {
      console.error('[SvelteWrapper] Error mounting Svelte component via mount function:', e);
      setError(`Failed to mount Svelte component: ${e.message}`);
      setLoading(false);
    }

    return () => {
      if (destroySvelteComponent) {
        destroySvelteComponent();
      }
    };
  }, [
    SvelteComponent,
    mountSvelteComponentFn,
    title, // Individual prop dependencies
    items, // Individual prop dependencies
    config, // Individual prop dependencies
    // Do NOT include 'restProps' directly here if it contains non-primitive/non-memoized values
    // If 'restProps' is guaranteed to be stable (e.g., only contains primitive route props from React Router),
    // you could include it, but it's safer to be explicit.
  ]);

  return (
    <div ref={containerRef} className='w-full h-full relative'>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10 rounded-lg'>
          <LoadingSpinner />
        </div>
      )}
      {error && !loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90 z-10 rounded-lg p-4'>
          <div className='text-red-700 text-center'>
            <h4 className='font-semibold mb-2'>Error Loading Svelte Component</h4>
            <p>{error}</p>
            <p className='text-sm text-gray-700 mt-2'>
              Please ensure the Svelte microfrontend is correctly exposed and compatible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SvelteWrapper;
