// src/game/systems/ScoreSystem.ts
export class ScoreSystem {
  private currentScore: number = 0;
  private highScore: number = 0;
  private multiplier: number = 1;
  private comboTimer: number | null = null;
  private readonly COMBO_WINDOW = 2000;

  constructor() {
    // サーバーサイドレンダリング対策
    if (typeof window !== 'undefined') {
      const savedHighScore = localStorage.getItem('highScore');
      if (savedHighScore) {
        this.highScore = parseInt(savedHighScore, 10);
      }
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

  private updateCombo(): void {
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }

    this.multiplier = Math.min(this.multiplier + 0.5, 4);

    this.comboTimer = window.setTimeout(() => {
      this.multiplier = 1;
    }, this.COMBO_WINDOW);
  }

  private updateScore(points: number): void {
    this.currentScore += points;
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      if (typeof window !== 'undefined') {
        localStorage.setItem('highScore', this.highScore.toString());
      }
    }
  }

  getCurrentScore(): number {
    return this.currentScore;
  }

  getHighScore(): number {
    return this.highScore;
  }

  getDifficultyMultiplier(): number {
    return 1 + Math.floor(this.currentScore / 1000) * 0.1;
  }

  reset(): void {
    this.currentScore = 0;
    this.multiplier = 1;
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
      this.comboTimer = null;
    }
  }

  onGameOver(): void {
    if (this.comboTimer) {
      clearTimeout(this.comboTimer);
    }
  }

  getMultiplier(): number {
    return this.multiplier;
  }
}