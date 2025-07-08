import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <div class="dashboard__header">
        <h2>Angular Dashboard</h2>
        <p>This is a routed component within the Angular microfrontend</p>
      </div>

      <div class="dashboard__content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card__icon">📊</div>
            <div class="stat-card__content">
              <h3>Analytics</h3>
              <p class="stat-value">1,234</p>
              <p class="stat-label">Total Views</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card__icon">👥</div>
            <div class="stat-card__content">
              <h3>Users</h3>
              <p class="stat-value">567</p>
              <p class="stat-label">Active Users</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card__icon">💰</div>
            <div class="stat-card__content">
              <h3>Revenue</h3>
              <p class="stat-value">$12,345</p>
              <p class="stat-label">This Month</p>
            </div>
          </div>
        </div>

        <div class="dashboard__actions">
          <button class="btn btn--primary">View Reports</button>
          <button class="btn btn--outline">Export Data</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Angular Dashboard component initialized');
  }
}
