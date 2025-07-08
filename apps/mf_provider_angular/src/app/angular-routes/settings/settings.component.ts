import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="settings">
      <div class="settings__header">
        <h2>Angular Settings</h2>
        <p>Configure your Angular microfrontend preferences</p>
      </div>

      <div class="settings__content">
        <div class="settings-section">
          <h3>General Settings</h3>
          <div class="form-group">
            <label for="theme">Theme</label>
            <select id="theme" class="form-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div class="form-group">
            <label for="language">Language</label>
            <select id="language" class="form-select">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div class="settings-section">
          <h3>Notifications</h3>
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" checked>
              <span class="checkmark"></span>
              Email notifications
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox">
              <span class="checkmark"></span>
              Push notifications
            </label>
          </div>
        </div>

        <div class="settings__actions">
          <button class="btn btn--primary">Save Changes</button>
          <button class="btn btn--secondary">Reset to Defaults</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log('Angular Settings component initialized');
  }
}
