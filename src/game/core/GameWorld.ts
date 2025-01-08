// src/game/core/GameWorld.ts
// ゲーム世界の管理
// - マップの大きさや地面の高さなどの定数を保持
// - 物理エンジンを使って実際のゲーム内での動きを計算
// - オブジェクトの位置制約（画面外に出ないようにするなど）

// src/game/core/GameWorld.ts
// ゲーム世界の管理
// - マップの大きさや地面の高さなどの定数を保持
// - 物理エンジンを使って実際のゲーム内での動きを計算
// - オブジェクトの位置制約（画面外に出ないようにするなど）

import { PhysicsEngine } from './PhysicsEngine';
import { Vector2D } from '@/types/geometry';
import { GameState } from '@/types/game';

export class GameWorld {
  private physicsEngine: PhysicsEngine;
  readonly width: number = 800;
  readonly height: number = 400;
  readonly groundHeight: number = 300;
  readonly gravity: number = 0.5;
  readonly jumpForce: number = -12;

  constructor() {
    this.physicsEngine = new PhysicsEngine(this.gravity);
  }

  update(gameState: GameState): void {
    // 物理演算の更新
    const newVelocity = this.physicsEngine.updateVelocity({
      x: gameState.velocity.x,
      y: gameState.velocity.y
    });
    
    const newPosition = this.physicsEngine.updatePosition(
      gameState.position,
      newVelocity
    );

    // 位置の制約適用
    const constrainedPosition = this.constrainPosition(
      newPosition.x,
      newPosition.y
    );

    // 状態の更新
    gameState.position = constrainedPosition;
    gameState.velocity = newVelocity;
  }

  constrainPosition(x: number, y: number): Vector2D {
    return {
      x: Math.max(0, Math.min(x, this.width - 32)), // プレイヤーの幅を考慮
      y: Math.min(Math.max(y, 0), this.groundHeight)
    };
  }
}