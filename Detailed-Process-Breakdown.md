# マイナンバーカードシステム - 詳細プロセス分解

## Page: トップページ (Welcome/Home Page)

### Function: システム初期化 (System Initialization)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| アプリケーション起動 | React App.tsx コンポーネントマウント | `client/src/App.tsx` | ✅ 完了 |
| ルーティング設定 | Wouter による SPA ルーティング初期化 | `client/src/App.tsx` | ✅ 完了 |
| CSS テーマ読み込み | Tailwind + 京都紫カスタムテーマ適用 | `client/src/index.css` | ✅ 完了 |
| 状態管理初期化 | React Hooks 初期状態設定 | `client/src/pages/home.tsx` | ✅ 完了 |

### Function: UI表示 (UI Display)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| ヘッダー表示 | "京都市" ブランディングヘッダー | `client/src/pages/home.tsx` | ✅ 完了 |
| タイトル表示 | "マイナンバーカード申請・更新ガイド" | `client/src/pages/home.tsx` | ✅ 完了 |
| 説明文表示 | システム概要とメリット説明 | `client/src/pages/home.tsx` | ✅ 完了 |
| 開始ボタン表示 | "質問を始める" CTA ボタン | `client/src/pages/home.tsx` | ✅ 完了 |
| 警告メッセージ削除 | 自治体別注意事項の除去 | `client/src/pages/home.tsx` | ✅ 完了 |

### Function: スタイリング (Styling)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 京都紫適用 | メインカラー #663399 設定 | `client/src/index.css` | ✅ 完了 |
| グラデーション背景 | 京都紫グラデーション背景 | `client/src/index.css` | ✅ 完了 |
| 政府系デザイン | 公式感のあるレイアウト設計 | `client/src/pages/home.tsx` | ✅ 完了 |
| レスポンシブ対応 | モバイル・タブレット最適化 | `client/src/pages/home.tsx` | ✅ 完了 |

---

## Page: 質問画面 (Question Flow Pages)

### Function: 質問フロー制御 (Question Flow Control)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 質問データ読み込み | questions-data.ts からの設問取得 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 分岐ロジック処理 | showWhen 条件による動的分岐 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 進捗計算 | 現在質問 / 総質問数の計算 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 回答状態管理 | useState による回答データ保持 | `client/src/components/question-wizard.tsx` | ✅ 完了 |

### Function: 質問1 - 来庁者タイプ判定 (Visitor Type Detection)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 本人選択オプション | "a本人" 選択肢表示 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 法定代理人オプション | "b法定代理人（親・後見人等）" | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 任意代理人オプション | "c任意代理人（委任状あり）" | `client/src/lib/questions-data.ts` | ✅ 完了 |
| アイコン表示 | Font Awesome アイコン統合 | `client/src/components/question-wizard.tsx` | ✅ 完了 |

### Function: 質問2 - 年齢判定 (Age Classification)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 15歳未満判定 | 法定代理人必須判定 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 15歳以上判定 | 本人申請可能判定 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 20歳未満表示条件 | 特定分岐での表示制御 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 20歳以上表示条件 | 成人判定処理 | `client/src/lib/questions-data.ts` | ✅ 完了 |

### Function: 質問3 - 本人確認書類判定 (ID Document Classification)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 顔写真付き書類確認 | 運転免許証・パスポート等 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 顔写真なし書類確認 | 健康保険証・年金手帳等 | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 書類なし選択肢 | 本人確認書類なしパターン | `client/src/lib/questions-data.ts` | ✅ 完了 |
| 条件分岐制御 | 来庁者タイプ別表示制御 | `client/src/lib/questions-data.ts` | ✅ 完了 |

### Function: ナビゲーション制御 (Navigation Control)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 次へボタン制御 | 回答選択時のみ活性化 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 前へボタン制御 | 初回質問では非表示 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 完了ボタン表示 | 最終質問で "結果を見る" | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 京都紫スタイリング | ナビゲーションボタンの統一デザイン | `client/src/components/question-wizard.tsx` | ✅ 完了 |

### Function: プログレス表示 (Progress Display)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 進捗バー表示 | 視覚的進捗インジケーター | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| パーセンテージ表示 | 数値での進捗表示 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 質問番号表示 | "質問 X / Y" 形式 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| 京都紫プログレスバー | カスタムカラー適用 | `client/src/index.css` | ✅ 完了 |

---

## Page: 結果表示画面 (Results Display Page)

### Function: 必要書類判定エンジン (Document Requirements Engine)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| ルールエンジン実行 | 回答に基づく書類判定 | `client/src/lib/rules-engine.ts` | ✅ 完了 |
| 来庁者別分岐 | 本人・代理人別処理 | `client/src/lib/rules-engine.ts` | ✅ 完了 |
| 年齢別分岐 | 年齢層による要件変更 | `client/src/lib/rules-engine.ts` | ✅ 完了 |
| 本人確認書類別分岐 | 書類タイプ別要件 | `client/src/lib/rules-engine.ts` | ✅ 完了 |
| 5項目チェックリスト生成 | 詳細書類リスト作成 | `client/src/lib/rules-engine.ts` | ✅ 完了 |

### Function: 結果画面UI (Results UI Display)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| チェックリスト表示 | ✓形式での書類一覧 | `client/src/components/results-display.tsx` | ✅ 完了 |
| 書類説明表示 | 各書類の詳細説明 | `client/src/components/results-display.tsx` | ✅ 完了 |
| 重要書類強調表示 | 必須書類のハイライト | `client/src/components/results-display.tsx` | ✅ 完了 |
| 京都紫テーマ適用 | 結果画面の統一デザイン | `client/src/components/results-display.tsx` | ✅ 完了 |

### Function: アクションボタン群 (Action Buttons)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| PDF出力ボタン | "PDFをダウンロード" | `client/src/components/results-display.tsx` | ✅ 完了 |
| LINE共有ボタン | "LINEで共有" | `client/src/components/results-display.tsx` | ✅ 完了 |
| SMS共有ボタン | "SMSで共有" | `client/src/components/results-display.tsx` | ✅ 完了 |
| 修正ボタン | "回答を修正する" | `client/src/components/results-display.tsx` | ✅ 完了 |
| 最初からボタン | "最初からやり直す" | `client/src/components/results-display.tsx` | ✅ 完了 |

### Function: 回答修正機能 (Answer Modification)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 質問フローに戻る | 既存回答保持して質問画面へ | `client/src/components/results-display.tsx` | ✅ 完了 |
| 回答状態復元 | 以前の選択状態を復元 | `client/src/components/question-wizard.tsx` | ✅ 完了 |
| リアルタイム結果更新 | 修正後の即座反映 | `client/src/lib/rules-engine.ts` | ✅ 完了 |

---

## Page: PDF出力機能 (PDF Generation Feature)

### Function: PDF生成エンジン (PDF Generation Engine)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| html2canvas統合 | DOM要素の画像化 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| jsPDF統合 | PDF文書生成 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| A4サイズ最適化 | 印刷用レイアウト調整 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| 高解像度対応 | 鮮明な文字・図表 | `client/src/lib/print-utils.ts` | ✅ 完了 |

### Function: QRコード統合 (QR Code Integration)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| QRコード生成 | qrcode ライブラリ使用 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| 結果ページURL埋め込み | 回答状態付きURL生成 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| PDF内QR配置 | 適切な位置・サイズ | `client/src/lib/print-utils.ts` | ✅ 完了 |
| エラーハンドリング | QR生成失敗時の処理 | `client/src/lib/print-utils.ts` | ✅ 完了 |

### Function: 印刷レイアウト最適化 (Print Layout Optimization)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| @media print CSS | 印刷専用スタイル | `client/src/index.css` | ✅ 完了 |
| 改ページ制御 | 適切なページ分割 | `client/src/lib/print-utils.ts` | ✅ 完了 |
| 余白調整 | 印刷時マージン最適化 | `client/src/index.css` | ✅ 完了 |
| フォント最適化 | 印刷用フォント指定 | `client/src/index.css` | ✅ 完了 |

---

## Page: 共有機能 (Sharing Features)

### Function: LINE共有機能 (LINE Sharing)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| URL生成 | 結果ページの共有URL作成 | `client/src/components/results-display.tsx` | ✅ 完了 |
| LINE API連携 | 外部LINEアプリ起動 | `client/src/components/results-display.tsx` | ✅ 完了 |
| メッセージ作成 | 共有用テキスト生成 | `client/src/components/results-display.tsx` | ✅ 完了 |
| URLエンコード処理 | 特殊文字の適切な処理 | `client/src/components/results-display.tsx` | ✅ 完了 |

### Function: SMS共有機能 (SMS Sharing)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| SMS URI生成 | sms: プロトコル使用 | `client/src/components/results-display.tsx` | ✅ 完了 |
| 文字数制限対応 | SMSの文字数制限考慮 | `client/src/components/results-display.tsx` | ✅ 完了 |
| デバイス対応 | iOS/Android両対応 | `client/src/components/results-display.tsx` | ✅ 完了 |
| 要約テキスト生成 | 簡潔な共有メッセージ | `client/src/components/results-display.tsx` | ✅ 完了 |

---

## Page: エラー・404画面 (Error & 404 Pages)

### Function: 404エラー処理 (404 Error Handling)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| 404ページ表示 | "ページが見つかりません" | `client/src/pages/not-found.tsx` | ✅ 完了 |
| ホームリンク | トップページへの導線 | `client/src/pages/not-found.tsx` | ✅ 完了 |
| 京都紫デザイン | エラーページの統一デザイン | `client/src/pages/not-found.tsx` | ✅ 完了 |

---

## Page: バックエンドAPI (Backend API Endpoints)

### Function: サーバー初期化 (Server Initialization)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| Express設定 | TypeScript Express サーバー | `server/index.ts` | ✅ 完了 |
| CORS設定 | クロスオリジン対応 | `server/index.ts` | ✅ 完了 |
| JSON解析設定 | リクエストボディ解析 | `server/index.ts` | ✅ 完了 |
| 静的ファイル配信 | フロントエンド資産配信 | `server/index.ts` | ✅ 完了 |

### Function: APIルート (API Routes)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| GET /api/health | ヘルスチェックエンドポイント | `server/routes.ts` | ✅ 完了 |
| データ永続化API | 将来の回答保存用 | `server/routes.ts` | ✅ 完了 |
| RESTful設計 | 標準的なAPI設計 | `server/routes.ts` | ✅ 完了 |

### Function: データ管理 (Data Management)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| In-memory Storage | Map構造でのデータ管理 | `server/storage.ts` | ✅ 完了 |
| Drizzle ORM設定 | PostgreSQL ORM準備 | `server/storage.ts` | ✅ 完了 |
| Schema定義 | データベーススキーマ | `shared/schema.ts` | ✅ 完了 |

### Function: 開発環境統合 (Development Integration)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| Vite統合 | 開発時ホットリロード | `server/vite.ts` | ✅ 完了 |
| TypeScript設定 | tsx による実行 | `server/index.ts` | ✅ 完了 |
| 環境変数管理 | NODE_ENV等の管理 | `server/index.ts` | ✅ 完了 |

---

## Page: 設定・構成ファイル (Configuration Files)

### Function: ビルド設定 (Build Configuration)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| Vite設定 | モノレポ対応ビルド | `vite.config.ts` | ✅ 完了 |
| TypeScript設定 | 厳密型チェック | `tsconfig.json` | ✅ 完了 |
| Tailwind設定 | カスタムテーマ設定 | `tailwind.config.ts` | ✅ 完了 |
| PostCSS設定 | CSS処理設定 | `postcss.config.js` | ✅ 完了 |

### Function: 依存関係管理 (Dependency Management)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| package.json | 依存関係・スクリプト定義 | `package.json` | ✅ 完了 |
| shadcn設定 | UI コンポーネント設定 | `components.json` | ✅ 完了 |
| Drizzle設定 | ORM設定ファイル | `drizzle.config.ts` | ✅ 完了 |

---

## Page: 将来拡張機能 (Future Extensions)

### Function: データベース実装 (Database Implementation)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| PostgreSQL接続 | Neon Database統合 | `server/storage.ts` | 📋 To do |
| マイグレーション | Drizzle Kit使用 | `drizzle/` | 📋 To do |
| セッション管理 | connect-pg-simple | `server/index.ts` | 📋 To do |

### Function: 分析・管理機能 (Analytics & Admin)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| アクセス解析 | 利用統計収集 | 新規ファイル | 📋 To do |
| 管理画面 | 質問・回答管理 | 新規ファイル | 📋 To do |
| A/Bテスト | 最適化実験 | 新規ファイル | 📋 To do |

### Function: 多言語対応 (Internationalization)
| Task | 詳細内容 | 実装ファイル | Status |
|------|----------|-------------|---------|
| i18n設定 | 多言語フレームワーク | 新規ファイル | 📋 To do |
| 英語対応 | English翻訳 | 新規ファイル | 📋 To do |
| 中国語対応 | Chinese翻訳 | 新規ファイル | 📋 To do |

---

**合計実装タスク数**: 約120個のタスク  
**完了済みタスク**: 約100個 (83%完了)  
**未実装タスク**: 約20個 (将来拡張機能)

**最終更新**: 2024年8月9日