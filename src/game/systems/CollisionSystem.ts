// src/game/systems/CollisionSystem.ts
import { Vector2D } from '@/types/geometry';
export class CollisionSystem {
  checkCollision(
    a: { position: Vector2D; width: number; height: number },
    b: { position: Vector2D; width: number; height: number }
  ): boolean {
    return (
      a.position.x < b.position.x + b.width &&
      a.position.x + a.width > b.position.x &&
      a.position.y < b.position.y + b.height &&
      a.position.y + a.height > b.position.y
    );
  }
}