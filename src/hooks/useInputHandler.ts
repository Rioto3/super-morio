// src/hooks/useInputHandler.ts
// カスタムフック: 入力操作の管理
//
// 機能：
// - タッチ入力とキーボード入力のハンドリング
// - InputSystemとの連携
// - メモ化された入力ハンドラーの提供
//
// 引数：
// - inputSystem: InputSystemのRef
//
// 戻り値：
// - handleTouchStart: タッチ開始ハンドラー
// - handleTouchEnd: タッチ終了ハンドラー
//
// 使用例：
// const { handleTouchStart, handleTouchEnd } = useInputHandler(inputSystemRef);
// <button 
//   onTouchStart={() => handleTouchStart('jump')}
//   onTouchEnd={() => handleTouchEnd('jump')}
// >
//   Jump
// </button>

import { useCallback } from 'react';
import { InputSystem } from '@/game/systems/InputSystem';

type InputAction = 'left' | 'right' | 'jump';

export const useInputHandler = (inputSystem: React.RefObject<InputSystem>) => {
  const handleTouchStart = useCallback((action: InputAction) => {
    inputSystem.current?.handleTouchStart(action);
  }, [inputSystem]);

  const handleTouchEnd = useCallback((action: InputAction) => {
    inputSystem.current?.handleTouchEnd(action);
  }, [inputSystem]);

  return { 
    handleTouchStart, 
    handleTouchEnd 
  };
};