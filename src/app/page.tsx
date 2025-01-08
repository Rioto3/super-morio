'use client'

import React, { useEffect, useRef } from 'react';

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef({
    x: 100,
    y: 200,
    vx: 0, // 水平速度を追加
    vy: 0,
    jumping: false
  });
  const requestRef = useRef<number | undefined>(undefined);
  const keysPressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    // パラメータ
    const gravity = 0.5;
    const jumpPower = -12;
    const groundY = 300;
    const moveSpeed = 0.8; // 加速度
    const maxSpeed = 8; // 最大移動速度
    const friction = 0.85; // 摩擦係数（減速用）

    const update = () => {
      const state = gameStateRef.current;

      // 水平方向の移動と慣性
      if (keysPressed.current.has('ArrowLeft')) {
        state.vx -= moveSpeed;
      } if (keysPressed.current.has('ArrowRight')) {
        state.vx += moveSpeed;
      }

      // 最大速度の制限
      state.vx = Math.max(Math.min(state.vx, maxSpeed), -maxSpeed);

      // 摩擦による減速
      if (!keysPressed.current.has('ArrowLeft') && !keysPressed.current.has('ArrowRight')) {
        state.vx *= friction;
      }

      // 水平位置の更新
      state.x += state.vx;

      // 画面端での跳ね返り
      if (state.x < 0) {
        state.x = 0;
        state.vx = 0;
      } else if (state.x > canvas.width - 32) {
        state.x = canvas.width - 32;
        state.vx = 0;
      }

      // 垂直方向の移動と重力
      state.y += state.vy;
      state.vy += gravity;

      // 地面との衝突判定
      if (state.y > groundY - 32) {
        state.y = groundY - 32;
        state.vy = 0;
        state.jumping = false;
      }

      // 速度が極めて小さい場合は0にする（数値の安定化）
      if (Math.abs(state.vx) < 0.1) state.vx = 0;
    };

    const render = () => {
      const state = gameStateRef.current;

      // 背景
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 地面
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, groundY, canvas.width, 100);

      // プレイヤー
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(state.x, state.y, 32, 32);

      // デバッグ情報
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.fillText(`Speed X: ${state.vx.toFixed(2)}`, 10, 20);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      keysPressed.current.add(e.code);
      
      // ジャンプ処理
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !state.jumping) {
        state.vy = jumpPower;
        state.jumping = true;
      }
    };

    const handleKeyup = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    const gameLoop = () => {
      update();
      render();
      requestRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('keyup', handleKeyup);
    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('keyup', handleKeyup);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

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