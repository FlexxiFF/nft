
import React, { useState, useEffect, useCallback } from 'react';
import { NFTStyle, GeneratedImage, ASPECT_RATIOS } from './types';
import { generateNFTImage, generateNFTMetadata } from './services/geminiService';
import StyleCard from './components/StyleCard';
import NFTDisplay from './components/NFTDisplay';

const STYLES_CONFIG = [
  { style: NFTStyle.BORED_APE, icon: 'fa-solid fa-face-laugh-wink' },
  { style: NFTStyle.CARTOON_CREATURE, icon: 'fa-solid fa-dragon' },
  { style: NFTStyle.CUTE_ANIMAL, icon: 'fa-solid fa-kiwi-bird' },
  { style: NFTStyle.PIXEL_ART, icon: 'fa-solid fa-square' },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<NFTStyle>(NFTStyle.BORED_APE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentNFT, setCurrentNFT] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    
    try {
      const [imageUrl, metadata] = await Promise.all([
        generateNFTImage(prompt, selectedStyle, "1:1"),
        generateNFTMetadata(prompt, selectedStyle)
      ]);

      const newNFT: GeneratedImage = {
        id: Math.random().toString(36).substr(2, 9),
        url: imageUrl,
        prompt,
        style: selectedStyle,
        timestamp: Date.now(),
        metadata
      };

      setCurrentNFT(newNFT);
      setHistory(prev => [newNFT, ...prev].slice(0, 10));
    } catch (err) {
      setError("Synthesis failure. Please try a different prompt.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMint = (id: string) => {
    setIsMinting(true);
    setTimeout(() => {
      setIsMinting(false);
      alert("Artifact finalized on the blockchain!");
    }, 2000);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
              <i className="fa-solid fa-id-badge text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-heading font-bold gradient-text">PFP FORGE</h1>
          </div>
          <button className="px-5 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 text-sm font-semibold transition-all">
            Connect Wallet
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          <div className="lg:w-1/3 space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/5 space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-widest text-indigo-400">Character Concept</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A robotic pirate, a futuristic space cat, etc."
                  className="w-full h-24 bg-gray-900/50 border border-gray-800 rounded-2xl p-4 text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-bold uppercase tracking-widest text-indigo-400">Collection Style</label>
                <div className="grid grid-cols-2 gap-3">
                  {STYLES_CONFIG.map(({ style, icon }) => (
                    <StyleCard
                      key={style}
                      style={style}
                      isSelected={selectedStyle === style}
                      onSelect={setSelectedStyle}
                      icon={icon}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 group"
              >
                {isGenerating ? (
                  <>
                    <i className="fa-solid fa-dna fa-spin"></i>
                    Sequencing...
                  </>
                ) : (
                  <>
                    <span>Forge NFT</span>
                    <i className="fa-solid fa-bolt group-hover:scale-125 transition-transform"></i>
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-900/20 border border-red-900/40 rounded-xl text-red-400 text-sm flex gap-3 items-center">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-2/3">
            {!currentNFT && !isGenerating ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center space-y-6 glass rounded-3xl border border-white/5 p-12">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center text-indigo-500 animate-float border border-indigo-500/20">
                  <i className="fa-solid fa-user-astronaut text-4xl"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Create Your Avatar</h3>
                  <p className="text-gray-500 max-w-sm">Select a PFP style to generate your next unique digital identity.</p>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center glass rounded-3xl border border-white/5 p-12 space-y-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent"></div>
                <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin relative">
                   <div className="absolute inset-0 flex items-center justify-center">
                     <i className="fa-solid fa-microchip text-indigo-400 text-2xl animate-pulse"></i>
                   </div>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Generating Vector Art...</h3>
                  <p className="text-gray-500 animate-pulse">Optimizing trait layers and color palettes</p>
                </div>
              </div>
            ) : (
              currentNFT && (
                <NFTDisplay 
                  image={currentNFT} 
                  isMinting={isMinting} 
                  onMint={handleMint} 
                />
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
