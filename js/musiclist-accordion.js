// musiclist-accordion.js
// --- 楽曲リストのアコーディオンUI生成 ---

// tunes-list.htmlを取得し、年ごとにグループ化してアコーディオンUIを生成
fetch('tunes/tunes-list.html')
  .then(response => response.text())
  .then(data => {
    const yearMap = parseTuneBlocksByYear(data);
    renderAccordionByYear(yearMap);
  })
  .catch(error => {
    document.getElementById('tunes-container').innerText = '曲リストの読み込みに失敗しました。';
    console.error(error);
  });

// tunes-list.htmlのHTML文字列から年ごとにグループ化したオブジェクトを返す
function parseTuneBlocksByYear(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const blocks = Array.from(tempDiv.querySelectorAll('.list-free'));
  const yearMap = {};
  blocks.forEach(block => {
    const h4 = block.querySelector('h4');
    if (!h4) return;
    const yearMatch = h4.textContent.match(/(\d{4})年/);
    if (!yearMatch) return;
    const year = yearMatch[1];
    if (!yearMap[year]) yearMap[year] = [];
    yearMap[year].push(block.outerHTML);
  });
  return yearMap;
}

// 年ごとのデータからアコーディオンUIを生成してDOMに反映
function renderAccordionByYear(yearMap) {
  const years = Object.keys(yearMap).sort((a, b) => b - a);
  let html = '<div class="accordion">';
  years.forEach(year => {
    html += renderYearSectionSimple(year, yearMap[year]);
  });
  html += '</div>';
  document.getElementById('tunes-container').innerHTML = html;
  attachAccordionEventsSimple();
  // 最新年のアコーディオンを開く
  const yearToggles = document.querySelectorAll('.year-toggle');
  if (yearToggles.length > 0) {
    yearToggles[0].click();
  }
}

// 年ごとのアコーディオンセクションHTML（シンプル版）
function renderYearSectionSimple(year, blocks) {
  return `
    <div class="year-section">
      <button class="year-toggle">${year}年 ▼</button>
      <div class="music-list" style="display:none;">
        ${blocks.join('')}
      </div>
    </div>
  `;
}

// 年アコーディオンの開閉イベント（シンプル版）
function attachAccordionEventsSimple() {
  document.querySelectorAll('.year-toggle').forEach(btn => {
    btn.addEventListener('click', function() {
      const list = this.nextElementSibling;
      if (list.style.display === 'none' || list.style.display === '') {
        list.style.display = 'block';
        this.textContent = this.textContent.replace('▼', '▲');
      } else {
        list.style.display = 'none';
        this.textContent = this.textContent.replace('▲', '▼');
      }
    });
  });
} 