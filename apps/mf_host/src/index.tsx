import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { i18nInstance, initializeI18n } from '@mfx/shared-utils';
import App from './App';
import './index.css';
import 'zone.js';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);

const renderApp = () => {
  root.render(
    <I18nextProvider i18n={i18nInstance}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </I18nextProvider>
  );
};

initializeI18n({
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'es', 'fr'],
  debug: true,
}).then(() => {
  renderApp();
}).catch((error: unknown) => {
  console.error("Failed to initialize i18n:", error);
  root.render(
    <div>Error: Internationalization failed to load.</div>
  );
});

root.render(<div>Loading...</div>);

