import React, { useState } from 'react';
import { Header } from './components/Header';
import { generateIdeasForTopic } from './services/geminiService';
import { Idea, ViewState } from './types';
import { IdeaCard } from './components/IdeaCard';
import { IdeaDetailModal } from './components/IdeaDetailModal';
import { Sparkles, Search, ArrowRight, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [topic, setTopic] = useState('');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideaCount, setIdeaCount] = useState(6);

  const handleSearch = async (searchTopic: string = topic) => {
    if (!searchTopic.trim()) return;
    
    setLoading(true);
    setTopic(searchTopic); // Ensure state is synced if called with arg
    
    // Slight delay to allow UI to update if transitioning views
    if (view === ViewState.LANDING) {
         // Transition logic could go here if we animated the layout change
    }

    try {
      const results = await generateIdeasForTopic(searchTopic, ideaCount);
      setIdeas(results);
      setView(ViewState.BROWSING);
    } catch (error) {
      console.error("Error generating ideas:", error);
      // Handle error UI
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const resetApp = () => {
    setView(ViewState.LANDING);
    setTopic('');
    setIdeas([]);
    setSelectedIdea(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-gray-100">
      <Header onLogoClick={resetApp} />

      <main className="pt-24 px-6 max-w-7xl mx-auto pb-12 min-h-[calc(100vh-6rem)]">
        
        {/* Landing View */}
        {view === ViewState.LANDING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-brand-500/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                <Sparkles className="w-20 h-20 text-brand-400 relative z-10" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-gray-400 tracking-tight">
              Dream. Explore. Build.
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 max-w-2xl leading-relaxed">
              IdeaFlow uses Gemini 2.5 to generate, analyze, and visualize your next big startup idea. Just enter a topic.
            </p>

            <div className="w-full max-w-xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <Search className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Sustainable Coffee, AI Lawyer, Drone Delivery..."
                  className="w-full bg-transparent border-none py-4 px-4 text-lg text-white placeholder-gray-500 focus:ring-0 outline-none"
                  autoFocus
                />
                
                {/* Separator */}
                <div className="flex items-center border-l border-gray-700 h-8 mx-2"></div>

                {/* Count Selector */}
                <select 
                    value={ideaCount}
                    onChange={(e) => setIdeaCount(Number(e.target.value))}
                    className="bg-transparent border-none text-gray-400 text-sm focus:ring-0 cursor-pointer hover:text-white pr-8 [&>option]:bg-gray-800 [&>option]:text-white"
                    title="Number of ideas to generate"
                >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                    <option value={12}>12</option>
                </select>

                <button 
                  onClick={() => handleSearch()}
                  disabled={loading}
                  className="m-2 px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-12 flex gap-4 text-sm text-gray-500">
               <span>Trending:</span>
               {['SaaS', 'EdTech', 'Green Energy', 'Web3'].map(t => (
                   <button key={t} onClick={() => handleSearch(t)} className="hover:text-brand-400 transition-colors underline decoration-dotted">{t}</button>
               ))}
            </div>
          </div>
        )}

        {/* Browsing View */}
        {view === ViewState.BROWSING && (
          <div className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
               <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Results for <span className="text-brand-400">"{topic}"</span></h2>
                  <p className="text-gray-400">Found {ideas.length} innovative concepts</p>
               </div>
               
               {/* Mini Search & Config in browsing mode */}
               <div className="hidden md:flex items-center bg-gray-800 rounded-lg border border-gray-700 px-3 py-2">
                 <Search className="w-4 h-4 text-gray-500 mr-2" />
                 <input 
                    type="text" 
                    className="bg-transparent border-none focus:ring-0 text-sm text-white w-64 outline-none"
                    placeholder="New search..."
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch(e.currentTarget.value);
                    }}
                 />
                 <div className="w-px h-4 bg-gray-600 mx-2"></div>
                 <select 
                    value={ideaCount}
                    onChange={(e) => setIdeaCount(Number(e.target.value))}
                    className="bg-transparent text-xs text-gray-400 border-none focus:ring-0 cursor-pointer hover:text-white p-0 [&>option]:bg-gray-800 [&>option]:text-white"
                    title="Number of ideas"
                 >
                    <option value={3}>3</option>
                    <option value={6}>6</option>
                    <option value={9}>9</option>
                 </select>
               </div>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: ideaCount }).map((_, i) => (
                      <div key={i} className="h-64 bg-gray-800/50 rounded-2xl border border-gray-700/50 animate-pulse" />
                  ))}
               </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ideas.map((idea, index) => (
                        <IdeaCard 
                            key={idea.id} 
                            idea={idea} 
                            index={index}
                            onClick={setSelectedIdea} 
                        />
                    ))}
                </div>
            )}
          </div>
        )}

        {/* Idea Detail Modal */}
        {selectedIdea && (
            <IdeaDetailModal 
                idea={selectedIdea} 
                onClose={() => setSelectedIdea(null)} 
                onExploreRelated={(relatedTopic) => {
                    setSelectedIdea(null);
                    handleSearch(relatedTopic);
                }}
            />
        )}

      </main>
    </div>
  );
};

export default App;