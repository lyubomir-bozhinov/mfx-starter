import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance } from '@mfx/shared-utils';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

const renderApp = () => {
  root.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18nInstance}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </React.StrictMode>
  );
};

i18nInstance.init().then(() => {
  renderApp();
}).catch(error => {
  console.error("Failed to initialize i18n:", error);
  root.render(
    <div>Error: Internationalization failed to load.</div>
  );
});

root.render(<div>Loading...</div>);

