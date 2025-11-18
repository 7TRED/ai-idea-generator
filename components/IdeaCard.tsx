import React from 'react';
import { Idea } from '../types';
import { ArrowRight, Zap, Activity } from 'lucide-react';

interface IdeaCardProps {
  idea: Idea;
  onClick: (idea: Idea) => void;
  index: number;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onClick, index }) => {
  return (
    <div 
      className="group relative bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-brand-500/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden flex flex-col h-full animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(idea)}
    >
      {/* Hover Glow Effect */}
      <div 
        className="absolute -inset-2 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 pointer-events-none" 
      />

      <div className="relative z-10 flex justify-between items-start mb-4">
        <span className="text-4xl">{idea.emoji}</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-900/50 px-2 py-1 rounded-full">
            <Zap className="w-3 h-3 text-yellow-400" />
            {idea.impactScore}
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-900/50 px-2 py-1 rounded-full">
            <Activity className="w-3 h-3 text-green-400" />
            {idea.feasibilityScore}
          </div>
        </div>
      </div>

      <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-brand-300 transition-colors">
        {idea.title}
      </h3>
      
      <p className="relative z-10 text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
        {idea.shortDescription}
      </p>

      <div className="relative z-10 flex flex-wrap gap-2 mb-4">
        {idea.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300 border border-gray-600/50">
            #{tag}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex items-center text-brand-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
        Explore Concept <ArrowRight className="w-4 h-4 ml-2" />
      </div>
    </div>
  );
};