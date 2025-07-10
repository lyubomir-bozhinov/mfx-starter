import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';

@Component({
  standalone: true,
  selector: 'app-angular-routes-entry',
  template: `
    <div class="angular-routes-container p-6 bg-white shadow-xl rounded-lg">
      <h3 class="text-xl font-bold mb-4 text-blue-700">Angular MFE Routes Area</h3>
      <nav class="mb-4">
        <ul class="flex space-x-4">
          <li>
            <a [routerLink]="['./dashboard']" class="text-blue-500 hover:underline">Dashboard</a>
          </li>
          <li>
            <a [routerLink]="['./settings']" class="text-blue-500[<43;43;4M hover:underline">Settings</a>
          </li>
        </ul>
      </nav>
      <!-- This router-outlet will render DashboardComponent or SettingsComponent -->
      <router-outlet></router-outlet>
    </div>
  `,
  imports: [
    RouterOutlet,
    RouterModule,
    DashboardComponent,
    SettingsComponent
  ],
  providers: []
})

export class AngularRoutesEntryComponent {}

