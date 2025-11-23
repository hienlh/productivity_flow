import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vi, Translations } from '../i18n/vi';
import { en } from '../i18n/en';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = {
  vi,
  en,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('vi');

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('language') as Language;
    if (stored && (stored === 'vi' || stored === 'en')) {
      setLanguageState(stored);
    } else {
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      const defaultLang = browserLang.startsWith('vi') ? 'vi' : 'en';
      setLanguageState(defaultLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

