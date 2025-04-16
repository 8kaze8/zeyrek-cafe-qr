import React from "react";
import { Globe } from "lucide-react";
import type { Language } from "../types/menu";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center gap-2 bg-[#2a4c7d]/20 rounded-xl px-4 py-2 border border-[#4fa3e3]/30 backdrop-blur-sm">
      <Globe className="w-4 h-4 text-[#4fa3e3]" />
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="bg-transparent text-[#4fa3e3] border-none focus:outline-none text-sm font-medium"
      >
        <option value="tr" className="bg-[#2a4c7d] text-[#4fa3e3]">
          Türkçe
        </option>
        <option value="en" className="bg-[#2a4c7d] text-[#4fa3e3]">
          English
        </option>
        <option value="ar" className="bg-[#2a4c7d] text-[#4fa3e3]">
          العربية
        </option>
      </select>
    </div>
  );
};
