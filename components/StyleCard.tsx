
import React from 'react';
import { NFTStyle } from '../types';

interface StyleCardProps {
  style: NFTStyle;
  isSelected: boolean;
  onSelect: (style: NFTStyle) => void;
  icon: string;
}

const StyleCard: React.FC<StyleCardProps> = ({ style, isSelected, onSelect, icon }) => {
  return (
    <button
      onClick={() => onSelect(style)}
      className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group ${
        isSelected 
          ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
          : 'bg-gray-900/40 border-gray-800 hover:border-gray-600'
      }`}
    >
      <div className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
        isSelected ? 'text-indigo-400' : 'text-gray-500'
      }`}>
        <i className={icon}></i>
      </div>
      <span className={`text-xs font-medium uppercase tracking-wider ${
        isSelected ? 'text-indigo-200' : 'text-gray-400'
      }`}>
        {style.split(' ')[0]}
      </span>
    </button>
  );
};

export default StyleCard;
