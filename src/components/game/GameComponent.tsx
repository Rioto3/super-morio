// src/components/game/GameComponent.tsx
// ゲームのメインコンポーネント
//
// 機能：
// - ゲームループの管理
// - 各種システム（入力、衝突、スコア）の初期化と管理
// - ビューとコントロールの統合
// - 画面サイズとデバイス対応の管理
// src/components/game/GameComponent.tsx
// ゲームのメインコンポーネント
//
// 機能：
// - ゲームループの管理
// - 各種システム（入力、衝突、スコア）の初期化と管理
// - ビューとコントロールの統合
// - 画面サイズとデバイス対応の管理

'use client'
import React, { useRef, useState, useCallback } from 'react';
import { GameWorld } from '@/game/core/GameWorld';
import { InputSystem } from '@/game/systems/InputSystem';
import { GameLoop } from '@/game/core/GameLoop';
import { GameState } from '@/types/game';
import { CollisionSystem } from '@/game/systems/CollisionSystem';
import { ScoreSystem } from '@/game/systems/ScoreSystem';
import { GameOver } from '@/components/game/GameOver';
import { OrientationWarning } from '@/components/game/views/OrientationWarning';
import { VirtualGamepad } from '@/components/game/controls/VirtualGamepad';
import { KeyboardControls } from '@/components/game/controls/KeyboardControls';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { useDeviceType } from '@/hooks/useDeviceType';
import { useInputHandler } from '@/hooks/useInputHandler';

const GameComponent = () => {
  // システムの初期化
  const gameWorld = useRef(new GameWorld());
  const inputSystem = useRef(new InputSystem());
  const collisionSystem = useRef(new CollisionSystem());
  const scoreSystem = useRef(new ScoreSystem());
  const gameLoopRef = useRef<GameLoop | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // カスタムフックの使用
  const { isLandscape, canvasSize } = useDeviceOrientation();
  const isTouchDevice = useDeviceType();
  const { handleTouchStart, handleTouchEnd } = useInputHandler(inputSystem);

  // 初期ゲーム状態
  const initialGameState: GameState = {
    // position: { x: 100, y: 300 },
    position: { x: 100, y: 268 },
    velocity: { x: 0, y: 0 },
    jumping: false,
    score: 0,
    gameOver: false,
    enemies: [],
    lastEnemySpawn: 0,
    spawnInterval: 2000,
    gameStartTime: Date.now()
  };

  const [gameState, setGameState] = useState<GameState>(initialGameState);

  // リトライ処理
  const handleRetry = useCallback(() => {
    if (gameLoopRef.current) {
      scoreSystem.current?.reset();
      gameLoopRef.current.reset(initialGameState);
      setGameState(initialGameState);
    }
  }, []);

  // メインゲームループ
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const currentScoreSystem = scoreSystem.current;
    if (!canvas) return;

    // GameLoopのインスタンス作成（引数を更新）
    gameLoopRef.current = new GameLoop(
      canvas,
      gameWorld.current,
      inputSystem.current,
      collisionSystem.current,
      scoreSystem.current,
      gameState
    );

    // ゲームループ開始
    gameLoopRef.current.start();

    // クリーンアップ
    return () => {
      gameLoopRef.current?.stop();
      inputSystem.current.cleanup();
      currentScoreSystem?.onGameOver();
    };
  }, [gameState]);

  // 縦向き画面の場合は警告を表示
  if (!isLandscape) {
    return <OrientationWarning />;
  }

  return (
    <main className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="relative">
        <canvas
          ref={canvasRef}
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`
          }}
          width={800}
          height={400}
          className="border border-gray-700 rounded-lg"
        />
        
        {/* ゲームオーバー画面 */}
        {gameState.gameOver && (
          <GameOver
            score={gameState.score}
            onRetry={handleRetry}
          />
        )}
      </div>

      {/* キーボードコントロール */}
      <KeyboardControls
        onRetry={handleRetry}
        gameOver={gameState.gameOver}
      />
      
      {/* タッチデバイスの場合は仮想ゲームパッドを表示 */}
      {isTouchDevice && (
        <VirtualGamepad
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </main>
  );
};

export default GameComponent;