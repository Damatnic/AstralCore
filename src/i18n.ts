import { I18n } from 'i18n-js';
import { en, es } from './translations';

// Set the key-value pairs for the different languages by creating an I18n instance
const i18n = new I18n({
  en,
  es,
});

// Function to set the current language
export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

// Set the initial locale
// In a real app, you might get this from the user's device settings or a language selector
// For now, we default to English.
setLocale('en');

export default i18n;