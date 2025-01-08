// src/hooks/useDeviceType.ts
// カスタムフック: デバイスタイプの検出
// 
// 機能：
// - タッチデバイスかどうかを検出
// - ウィンドウのリサイズ時に再検出
// - クリーンアップ処理の実装
//
// 使用例：
// const isTouchDevice = useDeviceType();
// if (isTouchDevice) {
//   // タッチデバイス向けの処理
// }

import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
    window.addEventListener('resize', checkTouchDevice);
    return () => window.removeEventListener('resize', checkTouchDevice);
  }, []);

  return isTouchDevice;
};