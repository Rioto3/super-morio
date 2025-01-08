// src/game/core/GameLoop.ts
// ゲームの心臓部分
// - requestAnimationFrameを使用して定期的な更新を実行
// - 入力、物理演算、描画の一連の流れを制御
// - フレームレートの管理


// GameLoopは「ゲームの心臓」であり、主に以下の3つの役割を担います：

// 1. 状態更新（Update）
//    - プレイヤーの入力を処理
//    - 物理演算を実行
//    - キャラクターの位置を更新

// 2. 描画（Render）
//    - 更新された状態を基に画面を描画

// 3. タイミング制御
//    - 一定のフレームレートを維持し、スムーズな動きを実現

// GameLoopとGameWorldの違い：
// - GameLoopは「時間」の管理者であり、定期的な更新と描画のサイクルを制御します。
// - GameWorldは「空間」の管理者であり、物理法則やオブジェクトの配置を管理します。

import { GameWorld } from './GameWorld';
import { InputSystem } from '../systems/InputSystem';
import { GameState } from '@/types/game';
import { Enemy } from '@/game/objects/enemy';
import { Vector2D } from '@/types/geometry';

// src/game/core/GameLoop.ts
// [コメント部分は同じなので省略]

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

  private updateState(): void {
    if (this.gameState.gameOver) return;

    const inputState = this.inputSystem.getInputState();

    // 移動処理
    this.gameState.velocity.x = inputState.left ? -5 : inputState.right ? 5 : 0;

    // ジャンプ処理
    if (inputState.jump && !this.gameState.jumping) {
      this.gameState.velocity.y = this.gameWorld.jumpForce;
      this.gameState.jumping = true;
    }

    // GameWorldに更新を委譲
    this.gameWorld.update(this.gameState);

    // ジャンプ状態のリセット
    if (this.gameState.position.y === this.gameWorld.groundHeight) {
      this.gameState.jumping = false;
      this.gameState.velocity.y = 0;
    }

    // 敵の生成と更新
    this.updateEnemies();
  }

  private render(): void {
    const state = this.gameState;
    const ctx = this.ctx;

    // 背景描画
    ctx.fillStyle = '#87CEEB';  // 空色
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 地面描画
    ctx.fillStyle = '#90EE90';  // 薄緑
    ctx.fillRect(0, 300, this.canvas.width, 100);

    // 敵の描画
    ctx.fillStyle = '#000000';
    state.enemies.forEach(enemy => {
      ctx.fillRect(
        enemy.position.x,
        enemy.position.y,
        enemy.width,
        enemy.height
      );
    });

    // プレイヤーの描画
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(
      state.position.x,
      state.position.y,
      32,
      32
    );

    // スコア表示
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

  // 敵の更新ロジック
  private updateEnemies(): void {
    const currentTime = Date.now();
    const state = this.gameState;

    // 新しい敵の生成
    if (currentTime - state.lastEnemySpawn >= state.spawnInterval) {
      const enemy = new Enemy(this.canvas.width);
      const timePlayed = (currentTime - state.gameStartTime) / 1000;
      const scoreSpeedBonus = Math.min(state.score * 0.2, 5);
      const timeSpeedBonus = Math.min(timePlayed / 15, 5);
      
      // 敵の速度を徐々に上げる
      enemy.velocity.x = -(4 + scoreSpeedBonus + timeSpeedBonus);
      
      state.enemies.push(enemy);
      state.lastEnemySpawn = currentTime;
      
      // スポーン間隔を徐々に短くする
      state.spawnInterval = Math.max(
        2000 - state.score * 20 - timePlayed * 10, 
        500
      );
    }

    // 既存の敵の更新
    state.enemies = state.enemies.filter(enemy => {
      // 敵の位置を更新
      enemy.position.x += enemy.velocity.x;

      // プレイヤーとの衝突判定
      if (this.checkCollision(enemy, {
        position: state.position,
        width: 32,
        height: 32
      })) {
        state.gameOver = true;
      }

      // スコア加算（敵を通過したとき）
      if (this.hasPassedPlayer(enemy, state.position.x)) {
        state.score += 1;
      }

      // 画面外の敵を除去
      return enemy.position.x > -enemy.width;
    });
  }

  // 衝突判定
  private checkCollision(
    enemy: Enemy, 
    player: { position: Vector2D; width: number; height: number }
  ): boolean {
    return (
      enemy.position.x < player.position.x + player.width &&
      enemy.position.x + enemy.width > player.position.x &&
      enemy.position.y < player.position.y + player.height &&
      enemy.position.y + enemy.height > player.position.y
    );
  }

  // プレイヤーを通過したかの判定
  private hasPassedPlayer(enemy: Enemy, playerX: number): boolean {
    // 敵の右端がプレイヤーの位置を通過した瞬間を検出
    return (
      enemy.position.x + enemy.width <= playerX &&
      enemy.position.x + enemy.width + enemy.velocity.x > playerX
    );
  }
}