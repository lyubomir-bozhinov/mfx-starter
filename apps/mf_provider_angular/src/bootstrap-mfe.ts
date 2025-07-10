// In your Angular Microfrontend: src/bootstrap-mfe.ts
import { ApplicationRef, Type, ComponentRef } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';

import { AngularWidgetComponent } from './app/angular-widget/angular-widget.component';
import { AngularRoutesEntryComponent } from './app/angular-routes/angular-routes-entry.component';
import { angularRoutes } from './app/angular-routes/angular-routes.routes'; // Import your route definitions

const mountedComponentRefs = new Map<HTMLElement, ComponentRef<any>>();
const applicationRefs = new Map<HTMLElement, ApplicationRef>();

export async function mountAngularComponent(
  element: HTMLElement,
  Component: Type<any>,
  props: any = {}
): Promise<() => void> {
  console.log(`[Angular MFE] Attempting to mount standalone component:`, Component.name);
  console.log(`[Angular MFE] Host element received:`, element);
  console.log(`[Angular MFE] Type of host element:`, typeof element);
  console.log(`[Angular MFE] Is host element an instance of HTMLElement?`, element instanceof HTMLElement);

  if (!element || !(element instanceof HTMLElement)) {
    console.error(`[Angular MFE] mountAngularComponent received an invalid host element.`, element);
    throw new Error('Invalid host element provided for Angular component mounting.');
  }

  const appRef = await createApplication({
    providers: [
      // Provide the actual angularRoutes here
      provideRouter(angularRoutes),
      provideHttpClient(),
    ],
  });

  applicationRefs.set(element, appRef);

  let componentRef: ComponentRef<any>;
  let angularRootElement: HTMLElement | null = null;

  try {
    const selector = (Component as any).ɵcmp?.selectors?.[0]?.[0] || 'div';
    angularRootElement = document.createElement(selector);

    element.appendChild(angularRootElement);

    componentRef = appRef.bootstrap(Component, angularRootElement);
    mountedComponentRefs.set(element, componentRef);

    Object.assign(componentRef.instance, props);
  } catch (e) {
    console.error(`[Angular MFE] Error during appRef.bootstrap for ${Component.name}:`, e);
    if (angularRootElement && element.contains(angularRootElement)) {
      element.removeChild(angularRootElement);
    }
    appRef.destroy();
    applicationRefs.delete(element);
    throw e;
  }

  return () => {
    console.log(`[Angular MFE] Destroying Angular component in element:`, element);
    if (componentRef) {
      if (angularRootElement && element.contains(angularRootElement)) {
        element.removeChild(angularRootElement);
      }
      componentRef.destroy();
    }
    mountedComponentRefs.delete(element);
    if (appRef) {
      appRef.destroy();
    }
    applicationRefs.delete(element);
  };
}

export function unmountAngularComponent(element: HTMLElement) {
  const componentRef = mountedComponentRefs.get(element);
  if (componentRef) {
    console.log(`[Angular MFE] Unmounting Angular component from element:`, element);
    const angularRootElement = componentRef.location.nativeElement;
    if (angularRootElement && element.contains(angularRootElement)) {
      element.removeChild(angularRootElement);
    }
    componentRef.destroy();
    mountedComponentRefs.delete(element);
  }
  const appRef = applicationRefs.get(element);
  if (appRef) {
    appRef.destroy();
    applicationRefs.delete(element);
  }
}

export { AngularWidgetComponent } from './app/angular-widget/angular-widget.component';
export { AngularRoutesEntryComponent as AngularRoutesComponent } from './app/angular-routes/angular-routes-entry.component';

