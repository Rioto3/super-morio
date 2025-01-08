# Super Morio

## プレイする 🎮

### プレイURL
🌐 **ゲームはこちらから**: [https://super-morio.vercel.app](https://super-morio.vercel.app)
*注意: 現在開発中のため、URLは仮のものです*

### ゲームプレイ
#### デバイス要件
- **推奨**: 横長の画面を持つデバイス
- **対応ブラウザ**: モダンなウェブブラウザ
  - Chrome
  - Firefox
  - Safari
  - Edge

#### 操作方法
1. **仮想ゲームパッド**を使用
   - **←→ボタン**: キャラクターの左右移動
   - **Aボタン**: ジャンプ
   - **Bボタン**: 攻撃/小さな特殊アクション

#### PWAとしてインストール
1. 対応ブラウザで[プレイURL]を開く
2. ブラウザの「ホーム画面に追加」または「インストール」機能を使用
3. デスクトップやモバイルのホーム画面からゲームを起動可能

## プロジェクト構造 📂

### ディレクトリ戦略
```
super-morio/
│
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # 再利用可能なReactコンポーネント
│   ├── lib/              # ユーティリティ、ヘルパー関数
│   ├── styles/           # グローバルスタイル、Tailwind設定
│   ├── types/            # TypeScript型定義
│   └── game/             # ゲーム関連のコア実装
│       ├── objects/      # ゲームオブジェクトの定義
│       │   ├── dot.ts    # ドットベースのオブジェクト定義
│       │   ├── player.ts # プレイヤーオブジェクト
│       │   ├── enemy.ts  # 敵オブジェクト
│       │   └── item.ts   # アイテムオブジェクト
│       ├── stages/       # ステージ定義
│       └── physics/      # ゲーム物理エンジン
│
├── public/               # 静的アセット
│   ├── icons/            # PWAアイコン
│   └── sprites/          # ゲームスプライト
│
├── tests/                # テストファイル
└── config/               # 設定ファイル
```

#### ドットベースのオブジェクト定義
プロジェクトの特徴的な実装として、ゲームオブジェクトをドット（点）によって定義する戦略を採用します。各オブジェクトは、複数のドットの集合体として表現され、柔軟で軽量な描画を実現します。

## プロジェクト関係者向け情報 👥

### プロジェクト概要
- **バージョニング方針**:
  - セマンティックバージョニング (SemVer) を採用
  - フォーマット: `major.minor.patch`
    - `major`: 大規模な変更、互換性のない変更
    - `minor`: 新機能の追加（下位互換性を維持）
    - `patch`: バグ修正
  - プレリリースバージョン: `-alpha`, `-beta`, `-rc` などのサフィックス
    - 例: `0.1.0-alpha`, `1.0.0-beta`
- **現在のバージョン**: `0.1.0-alpha`
- **開発ステータス**: 初期開発段階

### ブランチ戦略 (Git Flow)
#### ブランチの具体例
- `main`: 
  - 本番リリース用ブランチ
  - 例: `v1.0.0`, `v1.1.2`のタグ付き

- `develop`: 
  - 次期リリース向け統合ブランチ
  - 例: 
    ```
    develop
    ├── feature/add-coin-mechanics
    ├── feature/implement-enemy-ai
    └── bugfix/player-movement-glitch
    ```

- `feature/`: 
  - 新機能開発用
  - 命名規則: `feature/[簡潔な機能説明]`
  - 具体例:
    ```
    feature/add-power-ups
    feature/implement-world-1-1
    feature/create-virtual-gamepad
    ```

- `bugfix/`: 
  - バグ修正用
  - 命名規則: `bugfix/[バグの簡潔な説明]`
  - 具体例:
    ```
    bugfix/collision-detection
    bugfix/jump-mechanics
    bugfix/rendering-performance
    ```

- `release/`: 
  - リリース準備用
  - 例: `release/v0.2.0`

## 技術設計書 🖥️

### 技術スタック
- **フレームワーク**: Next.js
- **プログラミング言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **テストフレームワーク**: Jest
- **ライブラリ**: React

### システム要件
- Node.js (v18以上)
- npm

### モバイル対応
- レスポンシブデザイン
  - Tailwind CSSを使用
  - 横長画面専用
- 仮想ゲームパッド実装
- タッチイベントサポート

### 開発セットアップ

#### 1. リポジトリのクローン
```bash
git clone https://github.com/yourusername/super-morio.git
```

#### 2. 依存関係のインストール
```bash
cd super-morio
npm install
```

#### 3. 開発サーバーの起動
```bash
npm run dev
```

### テスト戦略
- コンポーネント単体テスト
- Jestを使用
- テスト駆動開発（TDD）アプローチ

### 詳細な開発ロードマップ 🗺️

#### フェーズ 0: プロトタイプ & 基本システム (`v0.x.x`)
- [x] 基本的なゲームフレームワークの構築
- [ ] プレイヤーキャラクターの基本移動
- [ ] 仮想ゲームパッドの実装
- [ ] 基本的な物理エンジン
- [ ] レンダリングシステム

#### フェーズ 1: 初期ステージ開発 (`v0.2.x`)
- [ ] マリオ1-1ステージの再現
- [ ] コイン収集メカニクス
- [ ] 基本的な敵（ノコノコなど）の実装
- [ ] フラグポール到達メカニクス
- [ ] 基本的なスコアシステム

#### フェーズ 2: ゲームメカニクス拡張 (`v0.3.x`)
- [ ] パワーアップシステム
  - 通常サイズ/大きいサイズの切り替え
  - ファイアボール攻撃
- [ ] より複雑な敵AI
- [ ] ワールド1-2の実装
- [ ] サウンドエフェクト

#### フェーズ 3: 高度なゲーム機能 (`v0.4.x`)
- [ ] セーブ/ロードシステム
- [ ] 複数のワールド
- [ ] 高スコア記録
- [ ] レスポンシブデザインの改善

#### フェーズ 4: ポリッシュと最適化 (`v0.5.x`)
- [ ] パフォーマンス最適化
- [ ] クロスブラウザ対応
- [ ] アクセシビリティ改善
- [ ] 詳細なエラーハンドリング

#### フェーズ 5: 拡張と完全版 (`v1.x.x`)
- [ ] マルチプラットフォーム対応
- [ ] オンラインリーダーボード
- [ ] カスタマイズ機能
- [ ] 追加のワールドとキャラクター

## 貢献とコミュニケーション 🤝

### 貢献方法
- GitHubでのプルリクエスト
- イシュートラッキング
- コミュニティフィードバック歓迎

### 連絡先
- 開発者: riotamoriya
- プロジェクトページ: GitHub


## 法的情報 📜

### ライセンス
- オープンソース（詳細検討中）
- 商用利用に関する条件は追って発表

### 免責事項
- 継続的開発中のプロジェクト
- 機能は段階的に追加予定

