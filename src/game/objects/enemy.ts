// src/game/objects/enemy.ts
import { Vector2D } from '@/types/geometry';

export class Enemy {
  position: Vector2D;
  velocity: Vector2D;
  width: number = 32;
  height: number = 32;

  constructor(canvasWidth: number) {
    this.position = {
      x: canvasWidth,
      y: 268  // groundHeight - height
    };
    this.velocity = {
      x: -4,  // 左に移動
      y: 0
    };
  }

  update(): void {
    this.position.x += this.velocity.x;  // 左に移動
  }

  isOffScreen(): boolean {
    return this.position.x + this.width < 0;  // 画面外に出たか判定
  }

  hasCollidedWith(player: { position: Vector2D }): boolean {
    return !(
      this.position.x > player.position.x + 32 ||
      this.position.x + this.width < player.position.x ||
      this.position.y > player.position.y + 32 ||
      this.position.y + this.height < player.position.y
    );
  }

  hasPassed(player: { position: Vector2D }): boolean {
    if (this.position.x + this.width < player.position.x) {
      return true;
    }
    return false;
  }
}