const fs = require('fs');
const path = require('path');

// 修正対象のHTMLファイルを探す
function findHtmlFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.')) {
            files.push(...findHtmlFiles(fullPath));
        } else if (item.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    
    return files;
}

// HTMLファイルにApple Touch Iconの設定を追加
function fixFaviconInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 既にapple-touch-iconの設定があるかチェック
    if (content.includes('apple-touch-icon')) {
        console.log(`✓ ${filePath} - 既に修正済み`);
        return false;
    }
    
    // favicon.icoの設定を探す
    const faviconRegex = /<link\s+rel=["']icon["'][^>]*favicon\.ico[^>]*>/i;
    const match = content.match(faviconRegex);
    
    if (match) {
        const faviconLine = match[0];
        const additionalLines = `
  <link rel="apple-touch-icon" href="images/favicon_io/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="images/favicon_io/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="images/favicon_io/favicon-16x16.png">`;
        
        // favicon.icoの行の後に追加の設定を挿入
        content = content.replace(faviconLine, faviconLine + additionalLines);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${filePath} - 修正完了`);
        return true;
    } else {
        console.log(`⚠ ${filePath} - favicon.icoの設定が見つかりません`);
        return false;
    }
}

// メイン処理
function main() {
    console.log('HTMLファイルのfavicon設定を自動修正します...\n');
    
    // カレントディレクトリからHTMLファイルを探す
    const htmlFiles = findHtmlFiles('.');
    
    if (htmlFiles.length === 0) {
        console.log('HTMLファイルが見つかりませんでした。');
        return;
    }
    
    console.log(`${htmlFiles.length}個のHTMLファイルが見つかりました:\n`);
    
    let fixedCount = 0;
    
    for (const file of htmlFiles) {
        if (fixFaviconInFile(file)) {
            fixedCount++;
        }
    }
    
    console.log(`\n修正完了: ${fixedCount}個のファイルを修正しました。`);
    
    // favicon_ioディレクトリの存在確認
    if (!fs.existsSync('images/favicon_io')) {
        console.log('\n⚠ 警告: images/favicon_io ディレクトリが見つかりません。');
        console.log('   必要なfaviconファイルが存在することを確認してください。');
    }
}

// スクリプト実行
if (require.main === module) {
    main();
}

module.exports = { fixFaviconInFile, findHtmlFiles };