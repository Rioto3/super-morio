
// src/types/game.ts
import { Vector2D } from './geometry';
import { Enemy } from '@/game/objects/enemy';
export interface GameState {
  position: Vector2D;
  velocity: Vector2D;
  jumping: boolean;
  score: number;
  gameOver: boolean;
  enemies: Enemy[];
  lastEnemySpawn: number;
  spawnInterval: number;
  gameStartTime: number;
}