// src/components/GameOver.tsx
import React from 'react';

interface GameOverProps {
  score: number;
  onRetry: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRetry }) => {
  return (
    <button 
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/80"
      style={{ zIndex: 9999 }}
      onClick={() => onRetry()}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="text-white text-6xl font-bold mb-2">GAME OVER</div>
        <div className="text-white text-3xl mb-8">Score: {score}</div>
        <div className="bg-green-500 hover:bg-green-400 text-white text-2xl font-bold 
                      px-12 py-4 rounded-xl transition-colors duration-200
                      shadow-lg transform hover:scale-105">
          TAP TO RETRY
        </div>
      </div>
    </button>
  );
};