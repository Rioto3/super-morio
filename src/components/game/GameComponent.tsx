// src/components/GameComponent.tsx
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Enemy } from '@/game/objects/enemy';
import { GameOver } from '@/components/game/GameOver';
import { GameWorld } from '@/game/core/GameWorld'; // 追加


const GameComponent = () => {
  // GameWorldのインスタンスを作成
  const gameWorld = useRef(new GameWorld());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const keysPressed = useRef<Set<string>>(new Set());
  
  const [isLandscape, setIsLandscape] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [controls, setControls] = useState({
    left: false,
    right: false,
    jump: false
  });

  const gameState = useRef({
    x: 100,
    y: 200,
    vx: 0,
    vy: 0,
    jumping: false,
    score: 0,
    gameOver: false,
    enemies: [] as Enemy[],
    lastEnemySpawn: 0,
    spawnInterval: 2000,
    gameStartTime: Date.now()
  });

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

  // キーボード入力
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => keysPressed.current.add(e.code);
    const handleKeyUp = (e: KeyboardEvent) => keysPressed.current.delete(e.code);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // タッチ入力のハンドラー
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    setControls(prev => ({ ...prev, [action]: true }));
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump') => {
    setControls(prev => ({ ...prev, [action]: false }));
    if (action === 'left' || action === 'right') {
      gameState.current.vx = 0;
    }
  };

  
  // メインゲームループ内の物理演算部分を修正
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const update = () => {
      const state = gameState.current;
      if (state.gameOver) return;

      // 移動処理
      if (controls.left || keysPressed.current.has('ArrowLeft')) {
        state.vx = -5;
      } else if (controls.right || keysPressed.current.has('ArrowRight')) {
        state.vx = 5;
      } else {
        state.vx = 0;
      }

      // ジャンプ処理を物理世界の設定を使って修正
      if ((controls.jump || keysPressed.current.has('Space') || keysPressed.current.has('ArrowUp')) && !state.jumping) {
        state.vy = gameWorld.current.jumpForce;
        state.jumping = true;
      }

      // 物理演算
      state.x += state.vx;
      state.y += state.vy;
      state.vy += gameWorld.current.gravity;

      // 衝突判定と位置制限
      const constrainedPosition = gameWorld.current.constrainPosition(state.x, state.y);
      state.x = constrainedPosition.x;
      state.y = constrainedPosition.y;

      // ジャンプ状態のリセット
      if (state.y === gameWorld.current.groundHeight) {
        state.jumping = false;
        state.vy = 0;
      }


      // 敵の生成と更新
      const currentTime = Date.now();
      if (currentTime - state.lastEnemySpawn >= state.spawnInterval) {
        const enemy = new Enemy(canvas.width);
        const timePlayed = (currentTime - state.gameStartTime) / 1000;
        const scoreSpeedBonus = Math.min(state.score * 0.2, 5);
        const timeSpeedBonus = Math.min(timePlayed / 15, 5);
        enemy.speed = 4 + scoreSpeedBonus + timeSpeedBonus;
        state.enemies.push(enemy);
        state.lastEnemySpawn = currentTime;
        state.spawnInterval = Math.max(2000 - state.score * 20 - timePlayed * 10, 500);
      }

      state.enemies = state.enemies.filter(enemy => {
        enemy.update();
        if (enemy.hasCollidedWith({ x: state.x, y: state.y })) {
          state.gameOver = true;
        }
        if (enemy.hasPassed({ x: state.x })) {
          state.score += 1;
        }
        return !enemy.isOffScreen();
      });
    };

    const render = () => {
      const state = gameState.current;

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, 300, canvas.width, 100);

      ctx.fillStyle = '#000000';
      state.enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      ctx.fillStyle = '#FF0000';
      ctx.fillRect(state.x, state.y, 32, 32);

      ctx.fillStyle = 'black';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${state.score}`, 10, 30);
    };

    const gameLoop = () => {
      update();
      render();
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [controls]);

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
        {gameState.current.gameOver && (
          <GameOver
            score={gameState.current.score}
            onRetry={() => {
              gameState.current = {
                x: 100,
                y: 200,
                vx: 0,
                vy: 0,
                jumping: false,
                score: 0,
                gameOver: false,
                enemies: [],
                lastEnemySpawn: Date.now(),
                spawnInterval: 2000,
                gameStartTime: Date.now()
              };
            }}
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