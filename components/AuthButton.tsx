import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import { Users, LogIn } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const AuthButton: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useUser();

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-xs sm:text-sm">
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.auth.signIn}</span>
            <span className="sm:hidden">{t.auth.signInShort}</span>
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">{t.auth.synced}</span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
              },
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
};

