import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../types/menu';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-2 bg-[#2a304d]/20 rounded-xl px-4 py-2 border border-[#2a304d]/50 backdrop-blur-sm">
      <Globe className="w-4 h-4 text-[#8892b0]" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent text-[#8892b0] border-none focus:outline-none text-sm font-medium"
      >
        <option value="tr" className="bg-[#1a1f35] text-[#8892b0]">Türkçe</option>
        <option value="en" className="bg-[#1a1f35] text-[#8892b0]">English</option>
        <option value="ar" className="bg-[#1a1f35] text-[#8892b0]">العربية</option>
      </select>
    </div>
  );
}