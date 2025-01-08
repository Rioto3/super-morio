// src/game/core/GameWorld.ts
// ゲームの物理世界を定義するクラス
// 重力、地面の高さ、画面の境界、ジャンプ力などの基本的な物理法則を管理
// 柔軟な設定と不変の世界ルールを提供する

export interface GameWorldConfig {
  gravity: number;        // 重力の強さ
  groundHeight: number;   // 地面の高さ
  screenBoundaryLeft: number;   // 画面左端の境界
  screenBoundaryRight: number;  // 画面右端の境界
  jumpForce: number;      // ジャンプ力
 }
 
 export class GameWorld {
  // ゲーム世界の設定を保持するプライベート変数
  private config: GameWorldConfig;
 
  // コンストラクタ：デフォルト値と任意のカスタム設定を受け取る
  constructor(config?: Partial<GameWorldConfig>) {
    this.config = {
      gravity: 0.5,
      groundHeight: 268,
      screenBoundaryLeft: 0,
      screenBoundaryRight: 768,
      jumpForce: -12,
      ...config
    };
  }
 
  // 各物理パラメータへのゲッター
  get gravity(): number {
    return this.config.gravity;
  }
 
  get groundHeight(): number {
    return this.config.groundHeight;
  }
 
  get screenBoundaryLeft(): number {
    return this.config.screenBoundaryLeft;
  }
 
  get screenBoundaryRight(): number {
    return this.config.screenBoundaryRight;
  }
 
  get jumpForce(): number {
    return this.config.jumpForce;
  }
 
  // 位置を世界の制約条件内に制限するメソッド
  constrainPosition(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(this.screenBoundaryLeft, Math.min(x, this.screenBoundaryRight)),
      y: Math.min(y, this.groundHeight)
    };
  }
 }