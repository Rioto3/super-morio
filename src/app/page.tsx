'use client'

import React, { useEffect, useRef } from 'react';
import { Enemy } from '@/game/objects/enemy';

const GameComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef({
    x: 100,
    y: 200,
    vx: 0,
    vy: 0,
    jumping: false,
    score: 0,
    gameOver: false,
    enemies: [] as Enemy[],
    lastEnemySpawn: 0,
    spawnInterval: 2000, // 敵の出現間隔（ミリ秒）
    gameStartTime: Date.now()
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
    const moveSpeed = 0.8;
    const maxSpeed = 8;
    const friction = 0.85;

    const spawnEnemy = () => {
      const state = gameStateRef.current;
      const currentTime = Date.now();
      if (currentTime - state.lastEnemySpawn >= state.spawnInterval) {
        const enemy = new Enemy(canvas.width);
        const timePlayed = (currentTime - state.gameStartTime) / 1000; // 秒単位

        // 敵の速度を時間とスコアに応じて調整
        const scoreSpeedBonus = Math.min(state.score * 0.2, 5); // スコアによる速度ボーナス
        const timeSpeedBonus = Math.min(timePlayed / 15, 5);    // 時間による速度ボーナス
        enemy.speed = 4 + scoreSpeedBonus + timeSpeedBonus;     // 基本速度4に加算

        // 出現間隔を時間とスコアに応じて調整
        const initialInterval = 2000;  // 初期間隔: 2秒
        const minInterval = 500;       // 最小間隔: 0.5秒
        const scoreReduction = state.score * 20;  // スコアによる間隔減少
        const timeReduction = timePlayed * 10;    // 時間による間隔減少
        state.spawnInterval = Math.max(
          initialInterval - scoreReduction - timeReduction, 
          minInterval
        );

        console.log(`Spawn interval: ${state.spawnInterval}ms, Enemy speed: ${enemy.speed}`);
        state.enemies.push(enemy);
        state.lastEnemySpawn = currentTime;
      }
    };

    const updateEnemies = () => {
      const state = gameStateRef.current;
      // 敵の更新と画面外に出た敵の削除
      state.enemies = state.enemies.filter(enemy => {
        enemy.update();
        
        // 衝突判定
        if (enemy.hasCollidedWith({ x: state.x, y: state.y })) {
          state.gameOver = true;
        }
        
        // スコア加算（通過時）
        if (enemy.hasPassed({ x: state.x })) {
          state.score += 1;
        }
        
        return !enemy.isOffScreen();
      });
    };

    const update = () => {
      const state = gameStateRef.current;
      if (state.gameOver) return;

      // 敵の生成
      spawnEnemy();
      
      // 敵の更新
      updateEnemies();

      // プレイヤーの移動と慣性
      if (keysPressed.current.has('ArrowLeft')) {
        state.vx -= moveSpeed;
      } 
      if (keysPressed.current.has('ArrowRight')) {
        state.vx += moveSpeed;
      }

      state.vx = Math.max(Math.min(state.vx, maxSpeed), -maxSpeed);
      if (!keysPressed.current.has('ArrowLeft') && !keysPressed.current.has('ArrowRight')) {
        state.vx *= friction;
      }

      state.x += state.vx;
      if (state.x < 0) {
        state.x = 0;
        state.vx = 0;
      } else if (state.x > canvas.width - 32) {
        state.x = canvas.width - 32;
        state.vx = 0;
      }

      state.y += state.vy;
      state.vy += gravity;

      if (state.y > groundY - 32) {
        state.y = groundY - 32;
        state.vy = 0;
        state.jumping = false;
      }

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

      // 敵
      ctx.fillStyle = '#000000';
      state.enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      });

      // プレイヤー
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(state.x, state.y, 32, 32);

      // スコア表示
      ctx.fillStyle = 'black';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${state.score}`, 10, 30);

      // ゲームオーバー表示
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

    const handleKeydown = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      if (state.gameOver) return;
      
      keysPressed.current.add(e.code);
      
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