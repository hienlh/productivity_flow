'use client';

import React from 'react';
import { Sparkles, Brain, Calendar, Zap, ArrowRight, CheckCircle, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToSetup: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  isOpen, 
  onClose,
  onContinueToSetup 
}) => {
  const { t, language, setLanguage } = useLanguage();
  
  if (!isOpen) return null;

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 text-white p-6 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mt-24 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mb-24 blur-3xl"></div>
          
          {/* Language Switcher - Top Right */}
          <button
            onClick={toggleLanguage}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors"
            title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            <span className="text-xs sm:text-sm font-semibold text-white">
              {language === 'vi' ? 'EN' : 'VI'}
            </span>
          </button>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-xl sm:rounded-2xl mb-4 backdrop-blur-sm">
              <Sparkles className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
            </div>
            
            <h1 className="text-xl sm:text-3xl font-bold mb-2 leading-tight">
              {t.welcome.title}
            </h1>
            <p className="text-sm sm:text-lg text-indigo-100 max-w-xl mx-auto">
              {t.welcome.subtitle}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-5 mb-5 sm:mb-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1">
                  {t.welcome.feature1Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.welcome.feature1Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1">
                  {t.welcome.feature2Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.welcome.feature2Desc}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-violet-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1">
                  {t.welcome.feature3Title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {t.welcome.feature3Desc}
                </p>
              </div>
            </div>
          </div>

          {/* Setup Required Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
            <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-amber-900 mb-1">
                  {t.welcome.setupTitle}
                </h3>
                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                  {t.welcome.setupDesc}
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-3 sm:p-4 mb-3">
              <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2 sm:mb-3">✨ {t.welcome.whyApiKey}</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{t.welcome.reason1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{t.welcome.reason2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{t.welcome.reason3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{t.welcome.reason4}</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-amber-800">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
              <span>{t.welcome.securityNote}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-3 sm:p-5 bg-slate-50">
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              {t.welcome.laterButton}
            </button>
            <button
              onClick={onContinueToSetup}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              {t.welcome.startButton}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
