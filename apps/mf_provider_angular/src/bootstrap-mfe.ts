// In your Angular Microfrontend: src/bootstrap-mfe.ts
import { ApplicationRef, Type, ComponentRef } from '@angular/core';
import { provideRouter, Routes } from '@angular/router'; // Import Routes as well
import { provideHttpClient } from '@angular/common/http';
import { createApplication } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';

import { AngularWidgetComponent } from './app/angular-widget/angular-widget.component';
import { AngularRoutesEntryComponent } from './app/angular-routes/angular-routes-entry.component';
import { ANGULAR_MFE_ROUTES } from './app/angular-routes/angular-routes-entry.component'; // Import ANGULAR_MFE_ROUTES

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

  const providers = [
    provideHttpClient(),
  ];

  // If mounting AngularRoutesEntryComponent, provide its specific routes and base href
  if (Component === AngularRoutesEntryComponent) {
    providers.push(provideRouter(ANGULAR_MFE_ROUTES)); // Provide the routes at the application level
    if (props.basePath) {
      providers.push({ provide: APP_BASE_HREF, useValue: props.basePath });
    }
  }

  const appRef = await createApplication({
    providers: providers,
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

