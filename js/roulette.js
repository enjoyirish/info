// roulette.js
// --- ルーレット機能：過去の練習曲からランダムに1曲を抽出 ---

// すべての練習曲を格納する変数
let allTunes = [];

// tunes-list.htmlを取得してすべての練習曲を抽出
fetch('tunes/tunes-list.html')
  .then(response => response.text())
  .then(data => {
    allTunes = extractAllTunes(data);
  })
  .catch(error => {
    console.error('曲リストの読み込みに失敗しました:', error);
  });

// tunes-list.htmlからすべての練習曲を抽出する関数
function extractAllTunes(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const tunes = [];
  const tuneNames = new Set(); // 重複チェック用
  
  // <a>タグ内の曲名とURLを抽出
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    const tuneName = link.textContent.trim();
    const tuneUrl = link.getAttribute('href');
    if (tuneName && tuneUrl && !tuneNames.has(tuneName)) {
      tunes.push({ name: tuneName, url: tuneUrl });
      tuneNames.add(tuneName);
    }
  });
  
  // <p>タグ内のテキストから曲名を抽出（リンクがない場合）
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    // <br>タグを改行に変換してから処理
    const clone = p.cloneNode(true);
    clone.querySelectorAll('br').forEach(br => {
      br.replaceWith('\n');
    });
    const text = clone.textContent;
    
    // 改行で分割して各行を処理
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    lines.forEach(line => {
      // セクション名や説明文を除外
      const isSectionName = line.match(/^(Jig|Reel|Polka|Air|Slip jig|Mazurka|Barndance|Slide|Hornpipe)[①②③]/);
      const isDescription = line.match(/^(今までのセッション曲|公園セッションの曲を練習)/);
      
      // 曲名として有効な行を抽出（リンクがない場合はURLなしで保存）
      if (line && 
          !isSectionName &&
          !isDescription &&
          line.length > 3 &&
          !tuneNames.has(line)) {
        tunes.push({ name: line, url: null });
        tuneNames.add(line);
      }
    });
  });
  
  return tunes;
}

// ルーレット機能：ランダムに1曲を選んで表示
function spinRoulette() {
  if (allTunes.length === 0) {
    alert('曲リストが読み込まれていません。しばらく待ってから再度お試しください。');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * allTunes.length);
  const selectedTune = allTunes[randomIndex];
  
  // 結果を表示
  const resultDiv = document.getElementById('roulette-result');
  if (resultDiv) {
    // リンクがある場合はリンク付きで表示、ない場合はテキストのみ
    const tuneDisplay = selectedTune.url 
      ? `<a href="${selectedTune.url}" target="_blank">${selectedTune.name}</a>`
      : selectedTune.name;
    
    resultDiv.innerHTML = `
      <div class="roulette-result-content">
        <h3>選ばれた曲</h3>
        <p class="selected-tune">${tuneDisplay}</p>
      </div>
    `;
    resultDiv.style.display = 'block';
  }
}

