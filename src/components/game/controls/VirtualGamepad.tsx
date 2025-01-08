// src/components/game/controls/VirtualGamepad.tsx
// 仮想ゲームパッドコンポーネント
//
// 機能：
// - モバイルデバイス用の仮想コントローラー
// - 方向ボタン（左右）とアクションボタン（ジャンプ）
// - タッチイベントの処理
// - プレイヤーの入力を InputSystem に伝達
//
// Props:
// - onTouchStart: タッチ開始時のコールバック
// - onTouchEnd: タッチ終了時のコールバック

import React from 'react';

type InputAction = 'left' | 'right' | 'jump';

interface VirtualGamepadProps {
  onTouchStart: (action: InputAction) => void;
  onTouchEnd: (action: InputAction) => void;
}

interface GamepadButtonProps {
  action: InputAction;
  label: string;
  className?: string;
  onTouchStart: (action: InputAction) => void;
  onTouchEnd: (action: InputAction) => void;
}

const GamepadButton: React.FC<GamepadButtonProps> = ({
  action,
  label,
  className = '',
  onTouchStart,
  onTouchEnd
}) => (
  <button
    className={`bg-gray-800 text-white rounded-full flex items-center 
              justify-center text-2xl active:bg-gray-700 select-none touch-none
              border-4 border-white/30 shadow-lg ${className}`}
    onTouchStart={(e) => {
      e.preventDefault();
      onTouchStart(action);
    }}
    onTouchEnd={(e) => {
      e.preventDefault();
      onTouchEnd(action);
    }}
  >
    {label}
  </button>
);

export const VirtualGamepad: React.FC<VirtualGamepadProps> = ({
  onTouchStart,
  onTouchEnd
}) => {
  return (
    <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-between items-center" style={{ zIndex: 2 }}>
      <div className="flex gap-1">
        <GamepadButton
          action="left"
          label="←"
          className="w-14 h-14"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        <GamepadButton
          action="right"
          label="→"
          className="w-14 h-14"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      </div>
      <GamepadButton
        action="jump"
        label="A"
        className="w-16 h-16 bg-green-600 active:bg-green-500 font-bold text-xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />
    </div>
  );
};