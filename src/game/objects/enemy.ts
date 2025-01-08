// src/game/objects/enemy.ts
export class Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  passed: boolean;  // プレイヤーが回避したかどうか

  constructor(canvasWidth: number) {
    this.width = 32;
    this.height = 32;
    this.x = canvasWidth;  // 画面右端から開始
    this.y = 300 - this.height;  // 地面の高さに合わせる
    this.speed = 5;  // 初期速度
    this.passed = false;
  }

  update(): void {
    this.x -= this.speed;  // 左に移動
  }

  isOffScreen(): boolean {
    return this.x + this.width < 0;  // 画面外に出たか判定
  }

  hasCollidedWith(player: { x: number; y: number; }): boolean {
    // 簡単な衝突判定
    const playerWidth = 32;
    const playerHeight = 32;
    
    return !(
      this.x > player.x + playerWidth ||
      this.x + this.width < player.x ||
      this.y > player.y + playerHeight ||
      this.y + this.height < player.y
    );
  }

  hasPassed(player: { x: number }): boolean {
    // プレイヤーを通過したかどうかの判定（スコア計算用）
    if (!this.passed && this.x + this.width < player.x) {
      this.passed = true;
      return true;
    }
    return false;
  }
}