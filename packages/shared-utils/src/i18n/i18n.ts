import i18n, { TOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { eventDispatcher } from '../events/eventDispatcher';

/**
 * i18n configuration options
 */
interface I18nConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
  debug?: boolean;
  fallbackLng?: string;
  ns?: string | string[];
  defaultNS?: string;
  backend?: {
    loadPath: string;
  };
}

/**
 * Initializes the i18n instance with the given configuration.
 * 
 * This setup includes:
 * - Backend for loading translations from a server (e.g., JSON files).
 * - Language detector to determine user's preferred language from browser.
 * - Integration with React for hooks and HOCs.
 * - Event dispatching on language change.
 */
export const initializeI18n = (config: I18nConfig): Promise<void> => {
  const {
    defaultLanguage,
    supportedLanguages,
    debug = false,
    fallbackLng = 'en',
    ns = ['translation'],
    defaultNS = 'translation',
    backend,
  } = config;

  return i18n
    .use(Backend) // Loads translations from your server
    .use(LanguageDetector) // Detects user language
    .use(initReactI18next) // Passes i18n instance to react-i18next
    .init({
      fallbackLng: fallbackLng,
      debug: debug,
      ns: ns,
      defaultNS: defaultNS,
      supportedLngs: supportedLanguages,
      lng: defaultLanguage, // Set the initial language
      interpolation: {
        escapeValue: false, // React already escapes by default
      },
      backend: backend || {
        loadPath: '/locales/{{lng}}/{{ns}}.json', // Default path for translations
      },
      detection: {
        order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage', 'cookie'],
      },
    })
    .then(() => {
      console.log(`i18n initialized to ${i18n.language}`);
      // Dispatch initial language change event
      eventDispatcher.dispatchEvent('LANGUAGE_CHANGE', {
        language: i18n.language,
        previousLanguage: i18n.language, // On init, previous is same as current
      });

      // Listen for language changes and dispatch event
      i18n.on('languageChanged', (lng) => {
        console.log(`i18n language changed to ${lng}`);
        eventDispatcher.dispatchEvent('LANGUAGE_CHANGE', {
          language: lng,
          previousLanguage: i18n.resolvedLanguage || defaultLanguage, // Use resolvedLanguage or default
        });
      });
    })
    .catch((err) => {
      console.error('Failed to initialize i18n:', err);
      // Optionally dispatch an error event
      eventDispatcher.dispatchEvent('API_ERROR', { message: 'Failed to initialize i18n', error: err });
    });
};

/**
 * Translates a given key using the i18n instance.
 * @param key The translation key.
 * @param options Optional translation options.
 * @returns The translated string.
 */
export const translate = (key: string, options?: TOptions): string => {
  // Cast the result to string, as i18n.t can return other types like objects for complex scenarios
  return i18n.t(key, options) as string;
};

/**
 * Changes the current language.
 * @param language The language code to switch to (e.g., 'en', 'es').
 * @returns A promise that resolves when the language has been changed.
 */
export const changeLanguage = (language: string): Promise<void> => {
  // Ensure the promise resolves to void
  return i18n.changeLanguage(language).then(() => {});
};

/**
 * Gets the current language.
 * @returns The current language code.
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

/**
 * Checks if i18n is initialized.
 * @returns True if i18n is initialized, false otherwise.
 */
export const isI18nInitialized = (): boolean => {
  return i18n.isInitialized;
};

/**
 * Adds a new resource bundle.
 * @param lng The language code.
 * @param ns The namespace.
 * @param resources The resources to add.
 */
export const addResourceBundle = (lng: string, ns: string, resources: object): void => {
  i18n.addResourceBundle(lng, ns, resources);
};

/**
 * Removes a resource bundle.
 * @param lng The language code.
 * @param ns The namespace.
 */
export const removeResourceBundle = (lng: string, ns: string): void => {
  i18n.removeResourceBundle(lng, ns);
};

/**
 * Reloads resources for a given language and namespace.
 * @param lngs The language codes to reload.
 * @param nss The namespaces to reload.
 * @returns A promise that resolves when resources are reloaded.
 */
export const reloadResources = (lngs?: string | string[], nss?: string | string[]): Promise<void> => {
  return i18n.reloadResources(lngs, nss);
};

export default i18n;
