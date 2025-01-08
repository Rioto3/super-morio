// src/components/game/GameComponent.tsx
// ゲームのメインコンポーネント
// - UIとゲームロジックの橋渡し
// - 画面の向きやサイズの管理
// - タッチ入力の処理
// - ゲームの開始/終了の管理

'use client'
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { GameOver } from '@/components/game/GameOver';
import { GameWorld } from '@/game/core/GameWorld';
import { InputSystem } from '@/game/systems/InputSystem';
import { GameLoop } from '@/game/core/GameLoop';
import { GameState } from '@/types/game';
// import { Vector2D } from '@/types/geometry';
// import { CollisionSystem } from '@/game/systems/CollisionSystem';
import { ScoreSystem } from '@/game/systems/ScoreSystem';

const GameComponent = () => {
  const gameWorld = useRef(new GameWorld());
  const inputSystem = useRef(new InputSystem());
  // const collisionSystem = useRef(new CollisionSystem());
  const scoreSystem = useRef(new ScoreSystem());
  const gameLoopRef = useRef<GameLoop | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isLandscape, setIsLandscape] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const initialGameState: GameState = {
    position: { x: 100, y: 200 },
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

  // handleRetryをメモ化
  const handleRetry = useCallback(() => {
    if (gameLoopRef.current) {
      scoreSystem.current?.reset();
      gameLoopRef.current.reset(initialGameState);
      setGameState(initialGameState);
    }
  }, []);

  // タッチ入力のハンドラ
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    inputSystem.current.handleTouchStart(action);
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump') => {
    inputSystem.current.handleTouchEnd(action);
  };

  // タッチデバイスの検出
  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  // 画面の向きとサイズの検出
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);

      if (isLandscapeMode) {
        const availableHeight = window.innerHeight;
        const availableWidth = window.innerWidth;
        const aspectRatio = 800 / 400;
        let width = availableWidth - 40;
        let height = width / aspectRatio;

        if (height > availableHeight - 40) {
          height = availableHeight - 40;
          width = height * aspectRatio;
        }

        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height)
        });
      }
    };

    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // メインゲームループ
  useEffect(() => {
    const canvas = canvasRef.current;
    const currentScoreSystem = scoreSystem.current;
    if (!canvas) return;

    gameLoopRef.current = new GameLoop(
      canvas, 
      gameWorld.current, 
      inputSystem.current,
      gameState
    );

    gameLoopRef.current.start();

    return () => {
      gameLoopRef.current?.stop();
      inputSystem.current.cleanup();
      currentScoreSystem?.onGameOver();
    };
  }, [gameState]);

  // スペースキーでのリトライ
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState.gameOver) {
        handleRetry();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver, handleRetry]);

  // 縦画面警告
  if (!isLandscape) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="text-6xl mb-8 animate-bounce">📱↔️</div>
        <Alert variant="destructive" className="max-w-md bg-gray-800/80">
          <AlertCircle className="h-4 w-4 text-gray-200" />
          <AlertTitle className="text-gray-200">デバイスを横向きにしてください</AlertTitle>
          <AlertDescription className="text-gray-300">
            Super Morioは横長の画面でのプレイを推奨しています。
            デバイスを横向きにしてください。
          </AlertDescription>
        </Alert>
      </div>
    );
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
        
        {/* ゲームオーバー表示 */}
        {gameState.gameOver && (
          <GameOver
            score={gameState.score}
            onRetry={handleRetry}
          />
        )}
      </div>

      {/* 仮想ゲームパッド */}
      {isTouchDevice && (
        <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-between items-center" style={{ zIndex: 2 }}>
          <div className="flex gap-1">
            <button
              className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center 
                       justify-center text-2xl active:bg-gray-700 select-none touch-none
                       border-4 border-white/30 shadow-lg"
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart('left');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd('left');
              }}
            >
              ←
            </button>
            <button
              className="w-14 h-14 bg-gray-800 text-white rounded-full flex items-center 
                       justify-center text-2xl active:bg-gray-700 select-none touch-none
                       border-4 border-white/30 shadow-lg"
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouchStart('right');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouchEnd('right');
              }}
            >
              →
            </button>
          </div>
          <button
            className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center 
                     justify-center text-xl font-bold active:bg-green-500 select-none touch-none
                     border-4 border-white/30 shadow-lg"
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouchStart('jump');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouchEnd('jump');
            }}
          >
            A
          </button>
        </div>
      )}
    </main>
  );
};

export default GameComponent;