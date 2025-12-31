
import React from 'react';
import { GeneratedImage } from '../types';

interface NFTDisplayProps {
  image: GeneratedImage;
  isMinting: boolean;
  onMint: (id: string) => void;
}

const NFTDisplay: React.FC<NFTDisplayProps> = ({ image, isMinting, onMint }) => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:w-1/2">
        <div className="relative group overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
          <img 
            src={image.url} 
            alt={image.prompt} 
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-300">
            {image.style}
          </div>
        </div>
      </div>
      
      <div className="lg:w-1/2 flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-heading font-bold text-white mb-2">{image.metadata.name}</h2>
            <p className="text-gray-400 leading-relaxed">{image.metadata.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {image.metadata.traits.map((trait, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 p-3 rounded-xl">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">{trait.trait_type}</p>
                <p className="text-sm font-semibold text-indigo-300">{trait.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button 
            onClick={() => onMint(image.id)}
            disabled={isMinting}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isMinting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Minting on Ethereum...
              </>
            ) : (
              <>
                <i className="fa-solid fa-cube"></i>
                Mint as NFT
              </>
            )}
          </button>
          
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold border border-white/5 transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-download"></i>
              Download
            </button>
            <button className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl text-sm font-semibold border border-white/5 transition-colors flex items-center justify-center gap-2">
              <i className="fa-solid fa-share-nodes"></i>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDisplay;
