import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vi, Translations } from '../i18n/vi';
import { en } from '../i18n/en';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

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
  const { user, isSignedIn } = useUser();
  const [language, setLanguageState] = useState<Language>('vi');
  const [isInitialized, setIsInitialized] = useState(false);

  // Convex queries and mutations
  const convexSettings = useQuery(
    api.settings.get,
    isSignedIn && user ? { userId: user.id } : "skip"
  );
  const updateSettings = useMutation(api.settings.update);

  // Load language from Convex or localStorage on mount
  useEffect(() => {
    if (isSignedIn && user && convexSettings !== undefined) {
      // User is signed in - use Convex settings
      if (convexSettings) {
        setLanguageState(convexSettings.language as Language);
      } else {
        // No settings in Convex yet - use localStorage or browser default
        const stored = localStorage.getItem('language') as Language;
        if (stored && (stored === 'vi' || stored === 'en')) {
          setLanguageState(stored);
          // Sync to Convex
          updateSettings({ userId: user.id, language: stored });
        } else {
          // Detect browser language
          const browserLang = navigator.language.toLowerCase();
          const defaultLang = browserLang.startsWith('vi') ? 'vi' : 'en';
          setLanguageState(defaultLang);
          // Sync to Convex
          updateSettings({ userId: user.id, language: defaultLang });
        }
      }
      setIsInitialized(true);
    } else if (!isSignedIn && !isInitialized) {
      // Not signed in - use localStorage only
      const stored = localStorage.getItem('language') as Language;
      if (stored && (stored === 'vi' || stored === 'en')) {
        setLanguageState(stored);
      } else {
        // Detect browser language
        const browserLang = navigator.language.toLowerCase();
        const defaultLang = browserLang.startsWith('vi') ? 'vi' : 'en';
        setLanguageState(defaultLang);
        localStorage.setItem('language', defaultLang);
      }
      setIsInitialized(true);
    }
  }, [isSignedIn, user, convexSettings, isInitialized, updateSettings]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Sync to Convex if signed in
    if (isSignedIn && user) {
      updateSettings({ userId: user.id, language: lang });
    }
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

