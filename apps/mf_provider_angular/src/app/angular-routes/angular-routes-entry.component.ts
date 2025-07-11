import { Component } from '@angular/core';
import { RouterOutlet, Routes, RouterLink, RouterLinkActive } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';

// Define the routes specific to this Angular microfrontend's routing entry point
export const ANGULAR_MFE_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' } // Default child route for this MFE
];

@Component({
  standalone: true,
  selector: 'app-angular-routes-entry',
  template: `
    <div class="angular-routes-container p-6 bg-white shadow-xl rounded-lg">
      <h3 class="text-xl font-bold mb-4 text-blue-700">Angular MFE Routes Area</h3>
      <nav class="mb-4">
        <ul class="flex space-x-4">
          <li>
            <!-- routerLink paths are relative to the current activated route -->
            <a [routerLink]="['./dashboard']" routerLinkActive="text-blue-700 font-semibold" class="text-blue-500 hover:underline">Dashboard</a>
          </li>
          <li>
            <a [routerLink]="['./settings']" routerLinkActive="text-blue-700 font-semibold" class="text-blue-500 hover:underline">Settings</a>
          </li>
        </ul>
      </nav>
      <!-- This router-outlet will render DashboardComponent or SettingsComponent -->
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet,
    RouterLink,       // Explicitly import RouterLink for standalone components
    RouterLinkActive, // Explicitly import RouterLinkActive for standalone components
    DashboardComponent,
    SettingsComponent
  ],
  providers: []
})
export class AngularRoutesEntryComponent {}


