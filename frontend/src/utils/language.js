const LANGUAGE_KEY = 'viralcut_language';

export const getStoredLanguage = () => {
  try {
    return localStorage.getItem(LANGUAGE_KEY) || 'pt-BR';
  } catch (error) {
    console.error('Error getting stored language:', error);
    return 'pt-BR';
  }
};

export const setStoredLanguage = (language) => {
  try {
    localStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.error('Error setting stored language:', error);
  }
};

export const detectBrowserLanguage = () => {
  const browserLang = navigator.language || navigator.languages[0];
  
  // Map browser languages to supported languages
  if (browserLang.startsWith('pt')) return 'pt-BR';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('en')) return 'en';
  
  return 'pt-BR'; // Default fallback
};

export const getSupportedLanguages = () => [
  { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export default {
  getStoredLanguage,
  setStoredLanguage,
  detectBrowserLanguage,
  getSupportedLanguages
};
