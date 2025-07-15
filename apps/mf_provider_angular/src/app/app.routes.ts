import { Routes } from '@angular/router';
import { AngularWidgetComponent } from './angular-widget/angular-widget.component';
import { angularRoutes } from './angular-routes/angular-routes.routes';

export const routes: Routes = [
  { path: 'widget', component: AngularWidgetComponent },
  ...angularRoutes,
  { path: '**', redirectTo: '' },
];
