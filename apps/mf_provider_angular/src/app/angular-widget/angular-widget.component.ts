import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { useAuthStore, AuthState, eventDispatcher, EventPayload } from '@mfx/shared-utils'; // Import eventDispatcher and EventPayload

/**
 * Angular Widget Component for Module Federation
 *
 * This component demonstrates:
 * - Integration with shared Zustand state management
 * - i18next internationalization
 * - SCSS styling with BEM methodology
 * - TypeScript interfaces for props
 * - Event emission for cross-MFE communication
 */

export interface AngularWidgetConfig {
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary';
}

@Component({
  selector: 'app-angular-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="angular-widget" [class]="getWidgetClasses()">
      <div class="angular-widget__header">
        <h3 class="angular-widget__title">{{ title || 'Angular Widget' }}</h3>
        <div class="angular-widget__status">
          <!-- Display login status and username from Zustand -->
          <span class="status-indicator" [class.status-indicator--active]="isLoggedIn"></span>
          <span class="status-text">
            {{ isLoggedIn ? 'Logged in as: ' + userName : 'Not logged in' }}
          </span>
        </div>
      </div>

      <div class="angular-widget__content">
        <div class="widget-info">
          <p class="widget-description">
            This is an Angular component loaded via Module Federation.
            It demonstrates shared state management and cross-framework communication.
          </p>

          <div class="widget-data">
            <h4>Current Internal State:</h4>
            <pre class="data-display">{{ { counter: counter, message: message } | json }}</pre>
          </div>
        </div>

        <div class="widget-controls">
          <div class="form-group">
            <label for="counter">Counter:</label>
            <div class="counter-controls">
              <button
                class="btn btn--secondary btn--small"
                (click)="decrementCounter()"
                [disabled]="counter <= 0"
              >
                -
              </button>
              <span class="counter-value">{{ counter }}</span>
              <button
                class="btn btn--secondary btn--small"
                (click)="incrementCounter()"
              >
                +
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="message">Message:</label>
            <input
              type="text"
              id="message"
              class="form-input"
              [(ngModel)]="message"
              placeholder="Enter a message..."
            >
          </div>

          <div class="widget-actions">
            <button
              class="btn btn--primary"
              (click)="handleAction('save')"
            >
              Save Changes
            </button>
            <button
              class="btn btn--outline"
              (click)="handleAction('reset')"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div class="angular-widget__footer">
        <small class="framework-info">
          🅰️ Angular {{ angularVersion }} • Module Federation
        </small>
        <small class="timestamp">
          Last updated: {{ lastUpdated | date:'short' }}
        </small>
      </div>
    </div>
  `,
  styleUrls: ['./angular-widget.component.scss']
})
export class AngularWidgetComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() data?: any; // This input will now be primarily for initial data if needed
  @Input() config?: AngularWidgetConfig;
  @Output() onAction = new EventEmitter<{ action: string; data?: any }>();

  // Component state
  counter = 0;
  message = '';
  isActive = true;
  lastUpdated = new Date();
  angularVersion = '20.0.6';

  // Zustand-related state
  isLoggedIn: boolean = false;
  userName: string = ''; // Will store userId for display

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private authStoreUnsubscribe: (() => void) | undefined;

  ngOnInit() {
    this.initializeWidget();

    // Subscribe to the Zustand store
    this.authStoreUnsubscribe = useAuthStore.subscribe(
      (state: AuthState) => {
        this.isLoggedIn = state.isLoggedIn;
        this.userName = state.userId || ''; // Use userId for display name
      }
    );

    // Set initial state from Zustand
    const initialState = useAuthStore.getState();
    this.isLoggedIn = initialState.isLoggedIn;
    this.userName = initialState.userId || '';

    // Set up periodic updates
    const updateInterval = setInterval(() => {
      this.lastUpdated = new Date();
    }, 30000);

    // Clean up interval on destroy
    this.subscriptions.push(
      new Subscription(() => clearInterval(updateInterval))
    );
  }

  ngOnDestroy() {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    // Unsubscribe from Zustand store
    if (this.authStoreUnsubscribe) {
      this.authStoreUnsubscribe();
    }
  }

  private initializeWidget() {
    // Initialize with data if provided (e.g., from host)
    if (this.data?.counter !== undefined) {
      this.counter = this.data.counter;
    }
    if (this.data?.message) {
      this.message = this.data.message;
    }
  }

  incrementCounter() {
    this.counter++;
    this.emitAction('counter_changed', { counter: this.counter });
    eventDispatcher.dispatchEvent('ANGULAR_WIDGET_ACTION', {
      action: 'counter_incremented',
      counter: this.counter,
      source: 'AngularWidget'
    });
  }

  decrementCounter() {
    if (this.counter > 0) {
      this.counter--;
      this.emitAction('counter_changed', { counter: this.counter });
      eventDispatcher.dispatchEvent('ANGULAR_WIDGET_ACTION', {
        action: 'counter_decremented',
        counter: this.counter,
        source: 'AngularWidget'
      });
    }
  }

  handleAction(action: string) {
    console.log(`[AngularWidget] handleAction called with: ${action}`);
    const actionData = {
      action,
      counter: this.counter,
      message: this.message,
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'save':
        this.emitAction('save', actionData);
        console.log('[AngularWidget] Dispatching save_changes event.');
        eventDispatcher.dispatchEvent('ANGULAR_WIDGET_ACTION', {
          action: 'save_changes',
          data: actionData,
          source: 'AngularWidget'
        });
        break;
      case 'reset':
        this.counter = 0;
        this.message = '';
        this.emitAction('reset', actionData);
        console.log('[AngularWidget] Dispatching reset_widget event.');
        eventDispatcher.dispatchEvent('ANGULAR_WIDGET_ACTION', {
          action: 'reset_widget',
          data: actionData,
          source: 'AngularWidget'
        });
        break;
      default:
        this.emitAction(action, actionData);
        console.log(`[AngularWidget] Dispatching generic action event: ${action}.`);
        eventDispatcher.dispatchEvent('ANGULAR_WIDGET_ACTION', {
          action: action,
          data: actionData,
          source: 'AngularWidget'
        });
    }
  }

  private emitAction(action: string, data?: any) {
    console.log(`[AngularWidget] Emitting onAction event: ${action}`, data);
    this.onAction.emit({ action, data });
  }

  getWidgetClasses(): string {
    const classes = ['angular-widget'];

    if (this.config?.theme) {
      classes.push(`angular-widget--${this.config.theme}`);
    }

    if (this.config?.size) {
      classes.push(`angular-widget--${this.config.size}`);
    }

    if (this.config?.variant) {
      classes.push(`angular-widget--${this.config.variant}`);
    }

    return classes.join(' ');
  }
}

