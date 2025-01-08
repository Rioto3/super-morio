// src/game/objects/player.ts
import { GameObject } from './base';
import { type Dot } from './dot';

export class Player extends GameObject {
  private isJumping: boolean = false;
  private velocity: { x: number; y: number } = { x: 0, y: 0 };
  private facingRight: boolean = true;

  constructor(x: number, y: number) {
    const playerDots: Dot[] = [
      // メインボディ
      { x: 0, y: 0, color: '#FF0000' },
      { x: 1, y: 0, color: '#FF0000' },
      { x: 0, y: 1, color: '#FF0000' },
      { x: 1, y: 1, color: '#FF0000' },
      // オーバーオール
      { x: 0, y: 2, color: '#0000FF' },
      { x: 1, y: 2, color: '#0000FF' },
      // 帽子
      { x: 0, y: -1, color: '#FF0000' },
      { x: 1, y: -1, color: '#FF0000' },
    ];
    super(x, y, playerDots);
  }

  public jump(): void {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocity.y = -15;
    }
  }

  public moveLeft(): void {
    this.velocity.x = -5;
    this.facingRight = false;
  }

  public moveRight(): void {
    this.velocity.x = 5;
    this.facingRight = true;
  }

  public stopMoving(): void {
    this.velocity.x = 0;
  }

  public update(gravity: number = 0.8, groundY: number = 300): void {
    // 水平移動
    this.x += this.velocity.x;

    // 重力と垂直移動
    if (this.isJumping) {
      this.velocity.y += gravity;
      this.y += this.velocity.y;

      if (this.y >= groundY - 40) {
        this.y = groundY - 40;
        this.isJumping = false;
        this.velocity.y = 0;
      }
    }

    // 画面端の制限
    if (this.x < 0) this.x = 0;
    if (this.x > 760) this.x = 760;
  }
}