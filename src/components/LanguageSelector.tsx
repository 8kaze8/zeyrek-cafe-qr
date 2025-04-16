import React, { useState, useRef, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = {
    tr: "Türkçe",
    en: "English",
    ar: "العربية",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (language: Language) => {
    onLanguageChange(language);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-[#2a4c7d]/20 hover:bg-[#2a4c7d]/30 rounded-xl px-4 py-2.5 border border-[#4fa3e3]/30 backdrop-blur-sm transition-colors duration-200"
      >
        <Globe className="w-4 h-4 text-[#4fa3e3]" />
        <span className="text-[#4fa3e3] text-sm font-medium min-w-[80px] text-left">
          {languages[selectedLanguage]}
        </span>
        <svg
          className={`w-4 h-4 text-[#4fa3e3] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1f35] border border-[#4fa3e3]/30 rounded-xl shadow-lg overflow-hidden z-50">
          {(Object.entries(languages) as [Language, string][]).map(
            ([code, name]) => (
              <button
                key={code}
                onClick={() => handleLanguageSelect(code)}
                className={`w-full px-4 py-3 text-left text-sm hover:bg-[#2a4c7d] transition-colors duration-200 ${
                  selectedLanguage === code
                    ? "bg-[#2a4c7d] text-white font-medium"
                    : "text-[#4fa3e3]"
                }`}
              >
                {name}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
