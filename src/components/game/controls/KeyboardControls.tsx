// src/components/game/controls/KeyboardControls.tsx
// キーボード操作コンポーネント
//
// 機能：
// - キーボードイベントのハンドリング
// - ゲームオーバー時のリトライ処理
// - スペースキーでのリトライ機能
//
// Props:
// - onRetry: リトライ時のコールバック
// - gameOver: ゲームオーバー状態
//
// 注意：
// - このコンポーネントは visual output を持たない
// - キーボードイベントのリスナーとしてのみ機能する

import React, { useEffect } from 'react';

interface KeyboardControlsProps {
  onRetry: () => void;
  gameOver: boolean;
}

export const KeyboardControls: React.FC<KeyboardControlsProps> = ({
  onRetry,
  gameOver
}) => {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameOver) {
        onRetry();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, onRetry]);

  return null;  // このコンポーネントは表示要素を持たない
};