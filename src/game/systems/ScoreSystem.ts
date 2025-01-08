// src/game/systems/ScoreSystem.ts
// スコアシステム
// - スコアの計算と管理
// - ハイスコアの保存
// - スコアに基づく難易度調整

export class ScoreSystem {
  private currentScore: number = 0;
  private highScore: number = 0;
  private multiplier: number = 1;
  private comboTimer: number | null = null;
  private readonly COMBO_WINDOW = 2000; // 2秒以内の連続得点でコンボ
 
  constructor() {
    // ローカルストレージからハイスコアを読み込み
    const savedHighScore = localStorage.getItem('highScore');
    if (savedHighScore) {
      this.highScore = parseInt(savedHighScore, 10);
    }
  }
 
  // 敵を回避したときのスコア加算
  addEnemyAvoidScore(): number {
    const baseScore = 100;
    const score = baseScore * this.multiplier;
    this.updateScore(score);
    this.updateCombo();
    return score;
  }
 
  // コンボの更新
  private updateCombo(): void {
    // 前回のコンボタイマーをクリア
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }
 
    // マルチプライヤーを増加（最大4倍まで）
    this.multiplier = Math.min(this.multiplier + 0.5, 4);
 
    // 新しいコンボタイマーをセット
    this.comboTimer = window.setTimeout(() => {
      this.multiplier = 1;
    }, this.COMBO_WINDOW);
  }
 
  // スコアの更新
  private updateScore(points: number): void {
    this.currentScore += points;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      localStorage.setItem('highScore', this.highScore.toString());
    }
  }
 
  // 現在のスコアを取得
  getCurrentScore(): number {
    return this.currentScore;
  }
 
  // ハイスコアを取得
  getHighScore(): number {
    return this.highScore;
  }
 
  // 現在の難易度倍率を取得（スコアに基づく）
  getDifficultyMultiplier(): number {
    return 1 + Math.floor(this.currentScore / 1000) * 0.1;
  }
 
  // スコアのリセット
  reset(): void {
    this.currentScore = 0;
    this.multiplier = 1;
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }
  }
 
  // ゲーム終了時の処理
  onGameOver(): void {
    // 必要に応じて追加の終了処理
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }
  }
 
  // コンボ倍率の取得
  getMultiplier(): number {
    return this.multiplier;
  }
 }