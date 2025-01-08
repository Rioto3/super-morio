// src/game/systems/InputSystem.ts
// ゲームの入力を管理するクラス
// キーボードとタッチ入力を抽象化し、一元管理する
// コントローラ

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class InputSystem {
  private keysPressed: Set<string> = new Set();
  private touchControls: InputState = {
    left: false,
    right: false,
    jump: false
  };

  constructor() {
    this.initKeyboardListeners();
  }

  // キーボードイベントリスナーの設定
  private initKeyboardListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  // キーダウンイベントの処理
  private handleKeyDown(e: KeyboardEvent): void {
    this.keysPressed.add(e.code);
  }

  // キーアップイベントの処理
  private handleKeyUp(e: KeyboardEvent): void {
    this.keysPressed.delete(e.code);
  }

  // タッチ開始のハンドラ
  handleTouchStart(action: keyof InputState): void {
    this.touchControls[action] = true;
  }

  // タッチ終了のハンドラ
  handleTouchEnd(action: keyof InputState): void {
    this.touchControls[action] = false;
  }

  // 現在の入力状態を取得
  getInputState(): InputState {
    return {
      left: this.touchControls.left || this.keysPressed.has('ArrowLeft'),
      right: this.touchControls.right || this.keysPressed.has('ArrowRight'),
      jump: this.touchControls.jump || 
             this.keysPressed.has('Space') || 
             this.keysPressed.has('ArrowUp')
    };
  }

  // クリーンアップメソッド
  cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}