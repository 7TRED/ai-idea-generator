import React from 'react';
import { Sparkles, Search, Menu } from 'lucide-react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-gray-800 bg-gray-900/90 backdrop-blur-md z-50 flex items-center justify-between px-6">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-blue-600 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          IdeaFlow
        </span>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-medium">
          AI
        </div>
      </div>
    </header>
  );
};