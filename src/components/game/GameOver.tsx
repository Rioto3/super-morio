// src/components/game/GameOver.tsx
// ゲームオーバー画面
// - スコア表示
// - リトライボタン
// - ハイスコア表示
// - アニメーション効果

import React from 'react';

interface GameOverProps {
  score: number;
  onRetry: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, onRetry }) => {
  return (
    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm w-full mx-4 border-2 border-gray-700">
        <h2 className="text-3xl font-bold text-red-500 mb-4">
          GAME OVER
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-300 text-lg mb-2">Score</p>
          <p className="text-4xl font-bold text-white mb-4">{score}</p>
          
          {/* ハイスコア表示（オプション） */}
          <p className="text-gray-400 text-sm">
            High Score: {localStorage.getItem('highScore') || score}
          </p>
        </div>

        <button
          onClick={onRetry}
          className="w-full bg-green-600 hover:bg-green-500 
                     text-white font-bold py-3 px-6 rounded-lg
                     transform transition-all duration-150 
                     hover:scale-105 active:scale-95
                     shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
        
        <p className="mt-4 text-gray-400 text-sm">
          Press Space to Retry
        </p>
      </div>
    </div>
  );
};