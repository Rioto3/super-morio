
// GameComponent
'use client'

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Enemy } from '@/game/objects/enemy';

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | undefined>(undefined);
  const keysPressed = useRef<Set<string>>(new Set());
  const isMobileDevice = useRef<boolean>(false);
  
  const [isLandscape, setIsLandscape] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  
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

  // 仮想ゲームパッドの状態
  const [controls, setControls] = useState({
    left: false,
    right: false,
    jump: false
  });

  // モバイルデバイス検出
  useEffect(() => {
    const checkMobileDevice = () => {
      isMobileDevice.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    checkMobileDevice();
  }, []);

  // 画面のリサイズと向き検出
  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = 
        window.matchMedia("(orientation: landscape)").matches;
      setIsLandscape(isLandscapeMode);

      if (!isLandscapeMode) {
        // 縦向きの場合はゲームを停止
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      } else {
        // 横向きの場合はサイズを調整
        const availableHeight = window.innerHeight - 20;
        const availableWidth = window.innerWidth - 20;
        const aspectRatio = 800 / 400;
        let width = availableWidth;
        let height = width / aspectRatio;

        if (height > availableHeight) {
          height = availableHeight;
          width = height * aspectRatio;
        }

        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height)
        });
      }
    };

    // 初期チェック
    handleOrientationChange();

    // イベントリスナーの設定
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // スクロール禁止
    document.body.style.overflow = 'hidden';
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.style.height = '100%';

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.body.style.overflow = '';
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
    };
  }, []);

  // キーボード入力の処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // メインのゲームループ
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const update = () => {
      const state = gameState.current;
      if (state.gameOver) return;

      // 移動処理
      const isMovingLeft = controls.left;
      const isMovingRight = controls.right;
      const isJumping = controls.jump || keysPressed.current.has('Space') || keysPressed.current.has('ArrowUp');

      // キーボード入力も追加
      if (keysPressed.current.has('ArrowLeft')) {
        state.vx = -8;
      } else if (keysPressed.current.has('ArrowRight')) {
        state.vx = 8;
      } else if (isMovingLeft) {
        state.vx = -8;
      } else if (isMovingRight) {
        state.vx = 8;
      } else {
        state.vx = 0;
      }

      if (isJumping && !state.jumping) {
        state.vy = -12;
        state.jumping = true;
      }

      // 物理演算
      state.x += state.vx;
      state.y += state.vy;
      state.vy += 0.5;

      // 衝突判定
      if (state.y > 268) {
        state.y = 268;
        state.vy = 0;
        state.jumping = false;
      }

      if (state.x < 0) {
        state.x = 0;
        state.vx = 0;
      } else if (state.x > 768) {
        state.x = 768;
        state.vx = 0;
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
      ctx.fillText(`Score: ${state.score}`, 10, 30);

      if (state.gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`Final Score: ${state.score}`, canvas.width / 2, canvas.height / 2 + 40);
      }
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
  }, [controls]); // controlsの変更を監視

  // 仮想ゲームパッドのハンドラー
  const handleTouchStart = (action: 'left' | 'right' | 'jump') => {
    setControls(prev => ({ ...prev, [action]: true }));
  };

  const handleTouchEnd = (action: 'left' | 'right' | 'jump') => {
    setControls(prev => ({ ...prev, [action]: false }));
  };

  // 仮想ゲームパッドコンポーネント
  const VirtualGamepad = () => (
    <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-between items-center touch-none">
      <div className="flex gap-4">
        <button
          className="w-20 h-20 bg-gray-800/80 rounded-full text-white text-2xl flex items-center justify-center active:bg-gray-600/80 backdrop-blur-sm touch-manipulation"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouchStart('left');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouchEnd('left');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouchStart('left');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouchEnd('left');
          }}
        >
          ←
        </button>
        <button
          className="w-20 h-20 bg-gray-800/80 rounded-full text-white text-2xl flex items-center justify-center active:bg-gray-600/80 backdrop-blur-sm touch-manipulation"
          onTouchStart={(e) => {
            e.preventDefault();
            handleTouchStart('right');
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleTouchEnd('right');
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleTouchStart('right');
          }}
          onMouseUp={(e) => {
            e.preventDefault();
            handleTouchEnd('right');
          }}
        >
          →
        </button>
      </div>
      <button
        className="w-24 h-24 bg-red-600/80 rounded-full text-white text-xl font-bold flex items-center justify-center active:bg-red-400/80 backdrop-blur-sm touch-manipulation"
        onTouchStart={(e) => {
          e.preventDefault();
          handleTouchStart('jump');
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleTouchEnd('jump');
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          handleTouchStart('jump');
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          handleTouchEnd('jump');
        }}
      >
        JUMP
      </button>
    </div>
  );

  if (!isLandscape) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>デバイスを横向きにしてください</AlertTitle>
          <AlertDescription>
            Super Morioは横長の画面でのプレイを推奨しています。
            デバイスを横向きにしてください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center"
    >
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
      {isMobileDevice.current && <VirtualGamepad />}
    </div>
  );
};

export default GameComponent;