// src/hooks/useDeviceOrientation.ts
// カスタムフック: デバイスの向きとキャンバスサイズの管理
//
// 機能：
// - デバイスの向き（横長/縦長）の検出
// - アスペクト比を保持したキャンバスサイズの計算
// - ウィンドウサイズ変更時の自動調整
// - 画面回転時の自動調整
// - スクロール防止の制御
//
// 戻り値：
// - isLandscape: 横長表示かどうか
// - canvasSize: 最適化されたキャンバスサイズ
//   - width: キャンバスの幅
//   - height: キャンバスの高さ
//
// 使用例：
// const { isLandscape, canvasSize } = useDeviceOrientation();
// if (!isLandscape) {
//   return <RotateDeviceWarning />;
// }

import { useState, useEffect } from 'react';

interface CanvasSize {
  width: number;
  height: number;
}

export const useDeviceOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({ width: 800, height: 400 });

  useEffect(() => {
    const handleOrientationChange = () => {
      const isLandscapeMode = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeMode);

      if (isLandscapeMode) {
        const availableHeight = window.innerHeight;
        const availableWidth = window.innerWidth;
        const aspectRatio = 800 / 400;  // 2:1 のアスペクト比を維持
        let width = availableWidth - 40; // 余白を考慮
        let height = width / aspectRatio;

        // 高さが画面に収まらない場合は高さを基準に計算
        if (height > availableHeight - 40) {
          height = availableHeight - 40;
          width = height * aspectRatio;
        }

        setCanvasSize({
          width: Math.floor(width),
          height: Math.floor(height)
        });
      }
    };

    // 初期化時とイベント時の処理
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    // スクロール防止
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return { isLandscape, canvasSize };
};