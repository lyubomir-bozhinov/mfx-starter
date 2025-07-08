<script lang="js">
  import { onMount } from 'svelte';

  /**
   * Svelte Routes Component for Module Federation
   *
   * This component encapsulates internal Svelte routing that can be consumed
   * by the host application. It demonstrates:
   * - Client-side routing within a microfrontend
   * - Shared navigation and layout components
   * - Route parameters and query handling
   */

  export let basePath = '/svelte';

  let currentRoute = 'profile';
  let routeParams = {};

  // Sample data
  let userProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Developer',
    joinDate: '2023-01-15',
    avatar: '👨‍💻'
  };

  let settings = {
    theme: 'light',
    notifications: true,
    language: 'en',
    timezone: 'UTC'
  };

  onMount(() => {
    // Initialize routing based on current URL
    const path = window.location.pathname;
    if (path.includes('/profile')) {
      currentRoute = 'profile';
    } else if (path.includes('/settings')) {
      currentRoute = 'settings';
    }
  });

  function navigateTo(route, params = {}) {
    currentRoute = route;
    routeParams = params;

    // Update URL without page reload (in a real app, you'd use a proper router)
    const newPath = `${basePath}/${route}`;
    window.history.pushState({}, '', newPath);
  }

  function updateProfile(field, value) {
    userProfile = { ...userProfile, [field]: value };
  }

  function updateSetting(setting, value) {
    settings = { ...settings, [setting]: value };
  }

  function saveChanges() {
    console.log('Saving changes...', { userProfile, settings });
    // In a real app, this would make an API call
  }
</script>

<div class="svelte-routes bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <!-- Navigation -->
  <nav class="bg-gray-50 border-b border-gray-200 px-6 py-4">
    <div class="flex space-x-1">
      <button
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors {currentRoute === 'profile' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
        on:click={() => navigateTo('profile')}
      >
        👤 Profile
      </button>
      <button
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors {currentRoute === 'settings' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
        on:click={() => navigateTo('settings')}
      >
        ⚙️ Settings
      </button>
    </div>
  </nav>

  <!-- Route Content -->
  <div class="p-6">
    {#if currentRoute === 'profile'}
      <div class="profile-route animate-fade-in">
        <div class="flex items-center space-x-4 mb-6">
          <div class="text-4xl">{userProfile.avatar}</div>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">User Profile</h2>
            <p class="text-gray-600">Manage your profile information</p>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Profile Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>

            <div>
              <label for="fullName" class="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                class="form-input"
                value={userProfile.name}
                on:input={(e) => updateProfile('name', e.target.value)}
              />
            </div>

            <div>
              <label for="emailAddress" class="form-label">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                class="form-input"
                value={userProfile.email}
                on:input={(e) => updateProfile('email', e.target.value)}
              />
            </div>

            <div>
              <label for="role" class="form-label">Role</label>
              <select
                id="role"
                class="form-input"
                value={userProfile.role}
                on:change={(e) => updateProfile('role', e.target.value)}
              >
                <option value="Developer">Developer</option>
                <option value="Designer">Designer</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <!-- Profile Stats -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Account Details</h3>

            <div class="bg-gray-50 rounded-lg p-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Member since:</span>
                <span class="text-sm font-medium">{new Date(userProfile.joinDate).toLocaleDateString()}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Account status:</span>
                <span class="status-badge status-badge-active">Active</span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm text-gray-600">Last login:</span>
                <span class="text-sm font-medium">Today, 2:30 PM</span>
              </div>
            </div>

            <div class="space-y-2">
              <h4 class="text-sm font-medium text-gray-900">Quick Actions</h4>
              <div class="flex flex-col space-y-2">
                <button class="btn btn-outline btn-small">Change Password</button>
                <button class="btn btn-outline btn-small">Download Data</button>
                <button class="btn btn-outline btn-small text-red-600 border-red-300 hover:bg-red-50">Delete Account</button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200">
          <button class="btn btn-primary" on:click={saveChanges}>
            Save Profile Changes
          </button>
        </div>
      </div>

    {:else if currentRoute === 'settings'}
      <div class="settings-route animate-fade-in">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
          <p class="text-gray-600">Customize your application preferences</p>
        </div>

        <div class="space-y-6">
          <!-- Appearance Settings -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>

            <div class="space-y-4">
              <div>
                <label for="theme" class="form-label">Theme</label>
                <select
                  id="theme"
                  class="form-input"
                  value={settings.theme}
                  on:change={(e) => updateSetting('theme', e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label for="language" class="form-label">Language</label>
                <select
                  id="language"
                  class="form-input"
                  value={settings.language}
                  on:change={(e) => updateSetting('language', e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>

            <label for="enableNotifications" class="flex items-center">
              <input
                type="checkbox"
                id="enableNotifications"
                class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                checked={settings.notifications}
                on:change={(e) => updateSetting('notifications', e.target.checked)}
              />
              <span class="ml-2 text-sm text-gray-700">Enable notifications</span>
            </label>

            <div>
              <label for="timezone" class="form-label">Timezone</label>
              <select
                id="timezone"
                class="form-input"
                value={settings.timezone}
                on:change={(e) => updateSetting('timezone', e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Advanced</h3>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Debug Mode</h4>
                  <p class="text-xs text-gray-600">Enable detailed logging</p>
                </div>
                <label for="debugMode" class="flex items-center">
                  <input
                    type="checkbox"
                    id="debugMode"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <h4 class="text-sm font-medium text-gray-900">Analytics</h4>
                  <p class="text-xs text-gray-600">Help improve the application</p>
                </div>
                <label for="enableAnalytics" class="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAnalytics"
                    class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-200 flex space-x-3">
          <button class="btn btn-primary" on:click={saveChanges}>
            Save Settings
          </button>
          <button class="btn btn-outline">
            Reset to Defaults
          </button>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <div class="bg-gray-50 border-t border-gray-200 px-6 py-3">
    <div class="flex justify-between items-center text-sm text-gray-500">
      <span>⚡ Svelte Routes • Module Federation</span>
      <span>Route: {basePath}/{currentRoute}</span>
    </div>
  </div>
</div>
