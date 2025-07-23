# Enjoy Irish ゆるゆる練習会 Webサイト

このリポジトリは、アイリッシュ音楽をのんびり楽しむ練習サークル「Enjoy Irish ゆるゆる練習会」の公式Webサイトのソースコードです。

## サイト概要
- 静的HTML/CSS/JSのみで構成
- 過去の練習曲リストや活動案内などを掲載
- スマホ・PC両対応

## ローカルでの編集・テスト方法
1. このリポジトリをクローン
   ```sh
   git clone https://github.com/あなたのユーザー名/info.git
   cd info
   ```
2. ローカルサーバーを起動（例: Python）
   ```sh
   python3 -m http.server
   ```
   ブラウザで http://localhost:8000/ を開く

## 主なディレクトリ・ファイル
- `index.html` ... トップページ
- `about.html` ... 練習会について
- `musiclist.html` ... 過去の練習曲
- `js/` ... JavaScriptファイル
- `css/` ... CSSファイル
- `images/` ... 画像素材
- `common.html` ... ヘッダー・メニュー・フッター共通パーツ

## コントリビュート・プルリクエスト手順
1. GitHubで本リポジトリをFork
2. 自分のリポジトリをローカルにクローン
3. ブランチを切って編集
4. `git add .` → `git commit -m "説明"` → `git push`
5. GitHub上でPull Requestを作成

## デプロイ（GitHub Pages）
- `main`ブランチの内容が自動で公開されます
- 設定: GitHubリポジトリの「Settings」→「Pages」→「main branch」

## ライセンス
- 本リポジトリの内容はEnjoy Irish運営チームに帰属します
- 無断転載・商用利用はご遠慮ください

---
ご質問・ご要望は[お問い合わせフォーム](https://forms.gle/oLELYXreQMbmG6UY7)まで！ 