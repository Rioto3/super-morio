import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const GROUND_Y = 300;  // 地面のY座標
const GRAVITY = 0.8;   // 重力の強さ
const JUMP_FORCE = -15; // ジャンプ力

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLandscape, setIsLandscape] = useState(true);
  const playerStateRef = useRef({
    x: 100,
    y: 200,
    velocityY: 0,
    isJumping: false
  });
  const requestIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    const updatePlayer = () => {
      const player = playerStateRef.current;

      // 重力の適用
      if (player.y < GROUND_Y - 32) {
        player.velocityY += GRAVITY;
        player.y += player.velocityY;
        player.isJumping = true;
      } else {
        // 地面との衝突
        player.y = GROUND_Y - 32;
        player.velocityY = 0;
        player.isJumping = false;
      }
    };

    const render = () => {
      // 背景
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 地面
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, GROUND_Y, canvas.width, 100);

      // プレイヤー
      const player = playerStateRef.current;
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(player.x, player.y, 32, 32);

      // デバッグ情報
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`Player: (${Math.floor(player.x)}, ${Math.floor(player.y)})`, 10, 20);
      ctx.fillText(`Velocity Y: ${player.velocityY.toFixed(2)}`, 10, 40);
      ctx.fillText(`Jumping: ${player.isJumping}`, 10, 60);
    };

    const gameLoop = () => {
      updatePlayer();
      render();
      requestIdRef.current = requestAnimationFrame(gameLoop);
    };

    // キーボード操作の状態管理
    const keysPressed = new Set();

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.add(e.code);
      
      // ジャンプ処理を即座に実行
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !playerStateRef.current.isJumping) {
        playerStateRef.current.velocityY = JUMP_FORCE;
        playerStateRef.current.isJumping = true;
        console.log('Jump initiated:', playerStateRef.current); // デバッグログ
      }
    };

    // const handleKeyUp = (e: KeyboardEvent) => {
    //   keysPressed.delete(e.code);
    // };

    // // 移動処理をゲームループ内に移動
    // const handleMovement = () => {
    //   if (keysPressed.has('ArrowLeft')) {
    //     playerStateRef.current.x -= 5;
    //   }
    //   if (keysPressed.has('ArrowRight')) {
    //     playerStateRef.current.x += 5;
    //   }
    // };

    requestIdRef.current = requestAnimationFrame(gameLoop);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, []); // 依存配列を空にして、マウント時のみ実行

  if (!isLandscape) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>デバイスを横向きにしてください</AlertTitle>
          <AlertDescription>
            Super Morioは横長の画面でのプレイを推奨しています。
            デバイスを横向きにしてリロードしてください。
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded-lg"
      />
    </div>
  );
};

export default GameComponent;