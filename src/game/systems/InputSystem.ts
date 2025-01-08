// src/game/systems/InputSystem.ts
// 入力システム
// - タッチ入力の管理
// - 入力状態の保持と提供
// - クリーンアップ処理

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export class InputSystem {
  private inputState: InputState = {
    left: false,
    right: false,
    jump: false
  };

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.init();
  }

  private init(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.inputState.left = true;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.inputState.right = true;
        break;
      case 'Space':
      case 'KeyW':
      case 'ArrowUp':
        this.inputState.jump = true;
        break;
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        this.inputState.left = false;
        break;
      case 'ArrowRight':
      case 'KeyD':
        this.inputState.right = false;
        break;
      case 'Space':
      case 'KeyW':
      case 'ArrowUp':
        this.inputState.jump = false;
        break;
    }
  }

  handleTouchStart(action: 'left' | 'right' | 'jump'): void {
    this.inputState[action] = true;
  }

  handleTouchEnd(action: 'left' | 'right' | 'jump'): void {
    this.inputState[action] = false;
  }

  getInputState(): InputState {
    return { ...this.inputState };
  }
}