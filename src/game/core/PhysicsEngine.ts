// src/game/core/PhysicsEngine.ts
// 物理演算エンジン
// - 重力の適用
// - 速度と位置の計算
// - 純粋に数学的な計算を担当

import { Vector2D } from '@/types/geometry';

export class PhysicsEngine {
  private gravity: number;
  
  constructor(gravity: number = 0.5) {
    this.gravity = gravity;
  }

  updatePosition(position: Vector2D, velocity: Vector2D): Vector2D {
    return {
      x: position.x + velocity.x,
      y: position.y + velocity.y
    };
  }

  updateVelocity(velocity: Vector2D): Vector2D {
    return {
      x: velocity.x,
      y: velocity.y + this.gravity
    };
  }
}