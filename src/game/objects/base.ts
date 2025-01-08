// src/game/objects/base.ts
import { type Dot } from './dot';

export class GameObject {
  protected dots: Dot[];
  protected x: number;
  protected y: number;

  constructor(x: number, y: number, dots: Dot[] = []) {
    this.x = x;
    this.y = y;
    this.dots = dots;
  }

  public getDots(): Dot[] {
    return this.dots.map(dot => ({
      ...dot,
      x: dot.x + this.x,
      y: dot.y + this.y
    }));
  }

  public move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  public setPosition(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }
}