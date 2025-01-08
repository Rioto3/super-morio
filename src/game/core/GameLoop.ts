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
// src/game/core/GameLoop.ts
// ゲームの心臓部分
// - requestAnimationFrameを使用して定期的な更新を実行
// - 入力、物理演算、描画の一連の流れを制御
// - フレームレートの管理
// - ゲーム状態の更新と描画の同期

import { GameWorld } from './GameWorld';
import { InputSystem } from '../systems/InputSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ScoreSystem } from '../systems/ScoreSystem';
import { Enemy } from '../objects/enemy';
import { GameState } from '@/types/game';

export class GameLoop {
 private canvas: HTMLCanvasElement;
 private ctx: CanvasRenderingContext2D;
 private gameWorld: GameWorld;
 private inputSystem: InputSystem;
 private collisionSystem: CollisionSystem;
 private scoreSystem: ScoreSystem;
 private gameState: GameState;
 private requestRef?: number;
 private lastFrameTime: number = 0;
 private readonly targetFPS: number = 60;
 private readonly frameInterval: number = 1000 / this.targetFPS;

 constructor(
   canvas: HTMLCanvasElement, 
   gameWorld: GameWorld, 
   inputSystem: InputSystem,
   collisionSystem: CollisionSystem,
   scoreSystem: ScoreSystem,
   initialState: GameState
 ) {
   this.canvas = canvas;
   this.ctx = canvas.getContext('2d')!;
   this.gameWorld = gameWorld;
   this.inputSystem = inputSystem;
   this.collisionSystem = collisionSystem;
   this.scoreSystem = scoreSystem;
   this.gameState = initialState;

   this.canvas.width = 800;
   this.canvas.height = 400;
 }

// src/game/core/GameLoop.ts
private updateState(deltaTime: number): void {
  if (this.gameState.gameOver) return;

  const inputState = this.inputSystem.getInputState();
  const dt = deltaTime / 1000; // ミリ秒を秒に変換

  // 移動速度を調整
  const moveSpeed = 400; // 1秒あたり400ピクセル
  this.gameState.velocity.x = inputState.left ? -moveSpeed : 
                             inputState.right ? moveSpeed : 0;

  // ジャンプ処理
  if (inputState.jump && !this.gameState.jumping) {
    this.gameState.velocity.y = this.gameWorld.jumpForce;
    this.gameState.jumping = true;
  }

  // GameWorldに更新を委譲
  this.gameWorld.update(this.gameState, dt);

  // ジャンプ状態のリセット（地面に着地したとき）
  if (this.gameState.position.y >= this.gameWorld.groundHeight) {
    this.gameState.position.y = this.gameWorld.groundHeight;
    this.gameState.jumping = false;
    this.gameState.velocity.y = 0;
  }

  // 敵の生成と更新
  this.updateEnemies(dt);
}



private updateEnemies(dt: number): void {
 const currentTime = Date.now();
 const state = this.gameState;

 // 敵の生成タイミング調整
 const minSpawnInterval = 1000; // 最小スポーン間隔：1秒
 const initialSpawnInterval = 2000; // 初期スポーン間隔：2秒
 const speedIncrement = 10000; // 敵が1体出るごとに何ミリ秒短くするか

 // スポーン間隔を計算（敵の数に応じて徐々に短くなる）
 const currentSpawnInterval = Math.max(
   initialSpawnInterval - (state.score * speedIncrement),
   minSpawnInterval
 );

 if (currentTime - state.lastEnemySpawn >= currentSpawnInterval) {
   const enemy = new Enemy(this.canvas.width);
   
   // スピード調整（ここを修正）
   const baseSpeed = 200; // 基本速度を下げる
   const maxSpeedBonus = 300; // 最大ボーナス速度も制限
   const speedBonus = Math.min(state.score * 5, maxSpeedBonus); // スコアごとの増加量を5に抑える
   
   enemy.velocity.x = -(baseSpeed + speedBonus);
   state.enemies.push(enemy);
   state.lastEnemySpawn = currentTime;
 }

 // 既存の敵の更新
 state.enemies = state.enemies.filter(enemy => {
   // 敵の位置を更新
   enemy.position.x += enemy.velocity.x * dt;

   // プレイヤーとの衝突判定
   if (this.collisionSystem.checkCollision(
     { 
       position: state.position,
       width: 32,
       height: 32
     },
     enemy
   )) {
     state.gameOver = true;
     this.stop();  // ゲームループを停止
   }

   // スコア加算（敵を通過したとき）
   if (!enemy.passed && enemy.position.x + enemy.width < state.position.x) {
     enemy.passed = true;
     this.scoreSystem.addEnemyAvoidScore();
     state.score = this.scoreSystem.getCurrentScore();
   }

   // 画面外の敵を除去
   return enemy.position.x > -enemy.width;
 });
}

 // プレイヤーを通過したかの判定
 private hasPassedPlayer(enemy: Enemy): boolean {
   return (
     enemy.position.x + enemy.width <= this.gameState.position.x &&
     enemy.position.x + enemy.width + enemy.velocity.x > this.gameState.position.x
   );
 }

 // レンダリング
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

   // マルチプライヤー表示（オプション）
   const multiplier = this.scoreSystem.getMultiplier();
   if (multiplier > 1) {
     ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';  // ゴールド
     ctx.font = 'bold 20px Arial';
     ctx.fillText(`x${multiplier.toFixed(1)}`, 120, 30);
   }
 }

 // ゲームループの開始
 start(): void {
   const gameLoop = (currentTime: number) => {
     // フレーム間の時間を計算
     const deltaTime = currentTime - this.lastFrameTime;

     if (deltaTime >= this.frameInterval) {
       // 状態を更新
       this.updateState(deltaTime);
       // 描画を実行
       this.render();
       
       this.lastFrameTime = currentTime;
     }

     // 次のフレームをリクエスト
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