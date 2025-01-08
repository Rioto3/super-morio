// src/game/systems/CollisionSystem.ts
// 衝突判定システム
// - 各種オブジェクト間の衝突判定を管理
// - バウンディングボックスベースの判定
// - 衝突時の振る舞いを定義

import { Vector2D } from '@/types/geometry';

interface Collidable {
  position: Vector2D;
  width: number;
  height: number;
}

export class CollisionSystem {
  // 矩形同士の衝突判定
  checkCollision(a: Collidable, b: Collidable): boolean {
    return (
      a.position.x < b.position.x + b.width &&
      a.position.x + a.width > b.position.x &&
      a.position.y < b.position.y + b.height &&
      a.position.y + a.height > b.position.y
    );
  }

  // プレイヤーと敵の衝突チェック
  checkPlayerEnemyCollision(
    playerPosition: Vector2D,
    playerSize: { width: number; height: number },
    enemies: Collidable[]
  ): boolean {
    const player: Collidable = {
      position: playerPosition,
      ...playerSize
    };

    return enemies.some(enemy => this.checkCollision(player, enemy));
  }

  // 地面との衝突判定
  checkGroundCollision(
    position: Vector2D,
    height: number,
    groundHeight: number
  ): boolean {
    return position.y + height >= groundHeight;
  }
}