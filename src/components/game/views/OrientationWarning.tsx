// src/components/game/views/OrientationWarning.tsx
// 縦向き警告コンポーネント
//
// 機能：
// - デバイスが縦向きの時に表示される警告画面
// - アニメーション付きのアイコン表示
// - 多言語対応可能な警告メッセージ
//
// 使用例：
// if (!isLandscape) {
//   return <OrientationWarning />;
// }

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const OrientationWarning: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-6xl mb-8 animate-bounce">📱↔️</div>
      <Alert variant="destructive" className="max-w-md bg-gray-800/80">
        <AlertCircle className="h-4 w-4 text-gray-200" />
        <AlertTitle className="text-gray-200">
          デバイスを横向きにしてください
        </AlertTitle>
        <AlertDescription className="text-gray-300">
          Super Morioは横長の画面でのプレイを推奨しています。
          デバイスを横向きにしてください。
        </AlertDescription>
      </Alert>
    </div>
  );
};