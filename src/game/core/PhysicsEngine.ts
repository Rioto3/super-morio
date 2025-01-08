// src/game/core/PhysicsEngine.ts
// 物理演算エンジン
// - 重力の適用
// - 速度と位置の計算
// - 純粋に数学的な計算を担当
// src/game/core/PhysicsEngine.ts
import { Vector2D } from '@/types/geometry';

export class PhysicsEngine {
  private gravity: number;
  
  constructor(gravity: number = 0.5) {
    this.gravity = gravity;
  }

  updateVelocity(velocity: Vector2D, deltaTime: number): Vector2D {
    return {
      x: velocity.x,
      y: velocity.y + this.gravity * deltaTime
    };
  }

  updatePosition(
    position: Vector2D, 
    velocity: Vector2D, 
    deltaTime: number
  ): Vector2D {
    return {
      x: position.x + velocity.x * deltaTime,
      y: position.y + velocity.y * deltaTime
    };
  }
}