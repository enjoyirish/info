// roulette.js
// --- ルーレット機能：過去の練習曲からランダムに1曲を抽出（ジャンル別対応） ---

// すべての練習曲を格納する変数
let allTunes = [];
// ジャンルごとに分類した曲を格納する変数
let tunesByGenre = {
  'Jig': [],
  'Reel': [],
  'Polka': [],
  'Hornpipe': [],
  'Air': [],
  'other': []
};

// tunes-list.htmlを取得してすべての練習曲を抽出
fetch('tunes/tunes-list.html')
  .then(response => response.text())
  .then(data => {
    allTunes = extractAllTunes(data);
    categorizeTunesByGenre();
  })
  .catch(error => {
    console.error('曲リストの読み込みに失敗しました:', error);
  });

// 曲名からジャンルを抽出する関数
function extractGenre(tuneName) {
  // 括弧内のジャンル名を抽出
  const genreMatch = tuneName.match(/\(([^)]+)\)/);
  if (!genreMatch) return null;
  
  const genreText = genreMatch[1].trim();
  
  // 主要ジャンルをチェック
  if (genreText.includes('Jig') && !genreText.includes('Slip jig')) {
    return 'Jig';
  } else if (genreText.includes('Reel')) {
    return 'Reel';
  } else if (genreText.includes('Polka')) {
    return 'Polka';
  } else if (genreText.includes('Hornpipe')) {
    return 'Hornpipe';
  } else if (genreText.includes('Air') || genreText.includes('Slow air')) {
    return 'Air';
  } else {
    // Slip jig, Mazurka, Barndance, Slideなどは「その他」
    return 'other';
  }
}

// 曲をジャンルごとに分類する関数
function categorizeTunesByGenre() {
  // 分類をリセット
  tunesByGenre = {
    'Jig': [],
    'Reel': [],
    'Polka': [],
    'Hornpipe': [],
    'Air': [],
    'other': []
  };
  
  allTunes.forEach(tune => {
    const genre = extractGenre(tune.name);
    if (genre && tunesByGenre[genre]) {
      tunesByGenre[genre].push(tune);
    } else if (!genre) {
      // ジャンルが不明な場合は「その他」に分類
      tunesByGenre['other'].push(tune);
    }
  });
}

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

// ルーレット機能：指定されたジャンルからランダムに1曲を選んで表示
function spinRoulette(genre) {
  if (allTunes.length === 0) {
    alert('曲リストが読み込まれていません。しばらく待ってから再度お試しください。');
    return;
  }
  
  let targetTunes = [];
  let genreDisplayName = '';
  
  if (genre === 'all') {
    // 全ジャンルから選ぶ
    targetTunes = allTunes;
    genreDisplayName = '全ジャンル';
  } else if (tunesByGenre[genre] && tunesByGenre[genre].length > 0) {
    // 指定されたジャンルから選ぶ
    targetTunes = tunesByGenre[genre];
    genreDisplayName = getGenreDisplayName(genre);
  } else {
    alert(`${getGenreDisplayName(genre)}の曲が見つかりませんでした。`);
    return;
  }
  
  if (targetTunes.length === 0) {
    alert(`${getGenreDisplayName(genre)}の曲が見つかりませんでした。`);
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * targetTunes.length);
  const selectedTune = targetTunes[randomIndex];
  
  // 結果を表示
  const resultDiv = document.getElementById('roulette-result');
  if (resultDiv) {
    // リンクなしでテキストのみ表示
    resultDiv.innerHTML = `
      <div class="roulette-result-content">
        <h3>選ばれた曲</h3>
        <p class="selected-tune">${selectedTune.name}</p>
      </div>
    `;
    resultDiv.style.display = 'block';
  }
}

// ジャンルの表示名を取得する関数
function getGenreDisplayName(genre) {
  const displayNames = {
    'all': '全ジャンル',
    'Jig': 'Jig',
    'Reel': 'Reel',
    'Polka': 'Polka',
    'Hornpipe': 'Hornpipe',
    'Air': 'Air',
    'other': 'other'
  };
  return displayNames[genre] || genre;
}

