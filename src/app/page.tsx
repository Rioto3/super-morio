// src/app/page.tsx
// ゲームコンポーネントの初期レンダリング
import GameComponent from '../components/GameComponent';

export default function Page() {
  return (
    <main className="min-h-screen">
      <GameComponent />
    </main>
  );
}