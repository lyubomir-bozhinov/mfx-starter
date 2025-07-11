import { mount } from 'svelte';

/**
 * Mounts a Svelte 5 component into a given DOM element and returns its destroy function.
 * This function is designed to be exposed via Module Federation.
 *
 * @param Component The Svelte component constructor (e.g., imported from './App.svelte').
 * @param options An object containing:
 * - target: The DOM element where the component should be mounted.
 * - props: An object of props to pass to the Svelte component.
 * @returns A function to destroy the mounted Svelte component.
 */
export function mountSvelteComponent(Component: any, options: { target: HTMLElement; props?: Record<string, any> }): () => void {
  if (!options.target) {
    console.error('[Svelte MFE] Mount target element is missing.');
    throw new Error('Target element required to mount Svelte component.');
  }

  // Svelte 5's `mount` function returns an object with `instance` and `destroy`.
  const { destroy } = mount(Component, {
    target: options.target,
    props: options.props,
  });

  console.log(`[Svelte MFE] Mounted Svelte component into`, options.target);
  return destroy; // Return the destroy function directly for cleanup
}

// The unmountSvelteComponent function is no longer needed as mountSvelteComponent returns the destroy function.
// It is removed to simplify the API and prevent incorrect usage.
// export function unmountSvelteComponent(instance: any) { ... }

