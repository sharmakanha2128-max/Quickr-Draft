import React, { useState, useEffect } from 'react';
import { LocationIcon, ChevronDownIcon, SearchIcon, UserIcon, MicrophoneIcon } from './icons';

interface HeaderProps {
    onNavigate: (view: 'account') => void;
}

const searchKeywords = [
  "milk, bread, eggs...",
  "fresh vegetables...",
  "snacks & drinks...",
  "chips, biscuits...",
];

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setKeywordIndex(prevIndex => (prevIndex + 1) % searchKeywords.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="p-4 bg-white sticky top-0 z-10 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        {/* Left side */}
        <div className="flex-1">
            <h1 className="font-extrabold text-2xl"><span className="text-[#0504c7]">Q</span><span className="text-[#00FF00]">uickr</span></h1>
            <div className="flex items-center mt-1 cursor-pointer">
              <LocationIcon className="w-4 h-4 text-red-500" />
              <div className="ml-1.5">
                <h2 className="font-semibold text-sm text-gray-800 leading-tight">Home</h2>
                <p className="text-xs text-gray-500 leading-tight">123 Market St, San Francisco...</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 ml-1 text-gray-600" />
          </div>
        </div>
        {/* Right side */}
        <button onClick={() => onNavigate('account')} className="p-2 rounded-full hover:bg-gray-100" aria-label="Account">
            <UserIcon className="w-6 h-6 text-gray-600"/>
        </button>
      </div>
      <div className="relative" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
        {!isFocused && (
            <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none text-sm text-gray-400">
                <span>Search for&nbsp;</span>
                <span key={keywordIndex} className="animate-flip-in">
                    {searchKeywords[keywordIndex]}
                </span>
            </div>
        )}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={isFocused ? "Search for groceries..." : ""}
          className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-[#00FF00] transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button className="p-1 rounded-full hover:bg-gray-200" aria-label="Voice Search">
                <MicrophoneIcon className="h-5 w-5 text-gray-600" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;