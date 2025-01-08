// src/game/core/GameLoop.ts
// ゲームのメインループを管理するクラス
// ゲームの更新と描画のサイクルを抽象化
// 描画を担っている？

import { GameWorld } from './GameWorld';
import { InputSystem } from '../systems/InputSystem';
import { Enemy } from '../objects/enemy';

export interface GameState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  jumping: boolean;
  score: number;
  gameOver: boolean;
  enemies: Enemy[];
  lastEnemySpawn: number;
  spawnInterval: number;
  gameStartTime: number;
}

export class GameLoop {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameWorld: GameWorld;
  private inputSystem: InputSystem;
  private gameState: GameState;
  private requestRef?: number;

  constructor(
    canvas: HTMLCanvasElement, 
    gameWorld: GameWorld, 
    inputSystem: InputSystem, 
    initialState: GameState
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.gameWorld = gameWorld;
    this.inputSystem = inputSystem;
    this.gameState = initialState;

    this.canvas.width = 800;
    this.canvas.height = 400;
  }

  // ゲーム状態の更新
  private updateState(): void {
    if (this.gameState.gameOver) return;

    const inputState = this.inputSystem.getInputState();

    // 移動処理
    this.gameState.vx = inputState.left ? -5 : inputState.right ? 5 : 0;

    // ジャンプ処理
    if (inputState.jump && !this.gameState.jumping) {
      this.gameState.vy = this.gameWorld.jumpForce;
      this.gameState.jumping = true;
    }

    // 物理演算
    this.gameState.x += this.gameState.vx;
    this.gameState.y += this.gameState.vy;
    this.gameState.vy += this.gameWorld.gravity;

    // 衝突判定と位置制限
    const constrainedPosition = this.gameWorld.constrainPosition(
      this.gameState.x, 
      this.gameState.y
    );
    this.gameState.x = constrainedPosition.x;
    this.gameState.y = constrainedPosition.y;

    // ジャンプ状態のリセット
    if (this.gameState.y === this.gameWorld.groundHeight) {
      this.gameState.jumping = false;
      this.gameState.vy = 0;
    }

    // 敵の生成と更新
    this.updateEnemies();
  }

  // 敵の更新ロジック
  private updateEnemies(): void {
    const currentTime = Date.now();
    const state = this.gameState;

    if (currentTime - state.lastEnemySpawn >= state.spawnInterval) {
      const enemy = new Enemy(this.canvas.width);
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
  }

  // レンダリング
  private render(): void {
    const state = this.gameState;
    const ctx = this.ctx;

    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = '#90EE90';
    ctx.fillRect(0, 300, this.canvas.width, 100);

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
  }

  // ゲームループの開始
  start(): void {
    const gameLoop = () => {
      this.updateState();
      this.render();
      this.requestRef = requestAnimationFrame(gameLoop);
    };

    this.requestRef = requestAnimationFrame(gameLoop);
  }

  // ゲームループの停止
  stop(): void {
    if (this.requestRef) {
      cancelAnimationFrame(this.requestRef);
    }
  }

  // ゲーム状態のリセット
  reset(initialState: GameState): void {
    this.gameState = { ...initialState };
  }
}