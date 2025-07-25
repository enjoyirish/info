#!/bin/bash

echo "HTMLファイルのfavicon設定を自動修正します..."
echo "================================"

# favicon_ioディレクトリの存在確認
if [ ! -d "images/favicon_io" ]; then
    echo "❌ エラー: images/favicon_io ディレクトリが見つかりません"
    echo "   必要なfaviconファイルを配置してください"
    exit 1
fi

# 必要なfaviconファイルの存在確認
required_files=("apple-touch-icon.png" "favicon-32x32.png" "favicon-16x16.png")
for file in "${required_files[@]}"; do
    if [ ! -f "images/favicon_io/$file" ]; then
        echo "❌ エラー: images/favicon_io/$file が見つかりません"
        exit 1
    fi
done

echo "✓ 必要なfaviconファイルが見つかりました"

# HTMLファイルを検索して修正
count=0
for html_file in *.html; do
    if [ -f "$html_file" ]; then
        # 既にapple-touch-iconの設定があるかチェック
        if grep -q "apple-touch-icon" "$html_file"; then
            echo "✓ $html_file - 既に修正済み"
        else
            # favicon.icoの行を探して、その後に追加設定を挿入
            if grep -q "favicon.ico" "$html_file"; then
                # バックアップを作成
                cp "$html_file" "$html_file.backup"
                
                # favicon.icoの行の後に追加の設定を挿入
                sed -i '/favicon\.ico/a\
  <link rel="apple-touch-icon" href="images/favicon_io/apple-touch-icon.png">\
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon_io/favicon-32x32.png">\
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon_io/favicon-16x16.png">' "$html_file"
                
                echo "✓ $html_file - 修正完了（バックアップ: $html_file.backup）"
                ((count++))
            else
                echo "⚠ $html_file - favicon.icoの設定が見つかりません"
            fi
        fi
    fi
done

echo "================================"
echo "修正完了: ${count}個のファイルを修正しました"

if [ $count -gt 0 ]; then
    echo ""
    echo "📱 iPhoneのSafariでテスト方法:"
    echo "1. 設定 > Safari > 履歴とWebサイトデータを消去"
    echo "2. サイトにアクセスしてブックマークに追加"
    echo "3. アイコンが正しく表示されるか確認"
fi