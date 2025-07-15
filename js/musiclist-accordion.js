// musiclist-accordion.js
// --- 楽曲リストのアコーディオンUI生成 ---

// tunes-list.htmlを取得し、年・月ごとにグループ化してアコーディオンUIを生成
fetch('tunes/tunes-list.html')
  .then(response => response.text())
  .then(data => {
    const yearMonthMap = parseTuneBlocks(data);
    renderAccordion(yearMonthMap);
  })
  .catch(error => {
    document.getElementById('tunes-container').innerText = '曲リストの読み込みに失敗しました。';
    console.error(error);
  });

// --- 関数定義 ---

// tunes-list.htmlのHTML文字列から年・月ごとにグループ化したオブジェクトを返す
function parseTuneBlocks(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const blocks = Array.from(tempDiv.querySelectorAll('.list-free'));
  const yearMonthMap = {};
  blocks.forEach(block => {
    const h4 = block.querySelector('h4');
    if (!h4) return;
    const yearMatch = h4.textContent.match(/(\d{4})年/);
    const monthMatch = h4.textContent.match(/(\d{1,2})月/);
    if (!yearMatch || !monthMatch) return;
    const year = yearMatch[1];
    const month = monthMatch[1];
    if (!yearMonthMap[year]) yearMonthMap[year] = {};
    yearMonthMap[year][month] = block.outerHTML;
  });
  return yearMonthMap;
}

// 年・月ごとのデータからアコーディオンUIを生成してDOMに反映
function renderAccordion(yearMonthMap) {
  const years = Object.keys(yearMonthMap).sort((a, b) => b - a);
  const latestYear = years[0];
  const months = Object.keys(yearMonthMap[latestYear]).sort((a, b) => b - a);
  const latestMonth = months[0];
  let html = '<div class="accordion">';
  years.forEach(year => {
    const months = Object.keys(yearMonthMap[year]).sort((a, b) => b - a);
    html += renderYearSection(year, months, yearMonthMap[year], year === latestYear ? latestMonth : null);
  });
  html += '</div>';
  document.getElementById('tunes-container').innerHTML = html;
  attachAccordionEvents();
  attachMonthBarEvents();
  // 最新年のアコーディオンを開く
  const yearToggles = document.querySelectorAll('.year-toggle');
  if (yearToggles.length > 0) {
    yearToggles[0].click();
  }
  // 今年のアコーディオンも開く（重複しない場合のみ）
  const thisYear = String(new Date().getFullYear());
  if (thisYear !== latestYear) {
    for (let i = 0; i < yearToggles.length; i++) {
      if (yearToggles[i].textContent.includes(thisYear + '年')) {
        yearToggles[i].click();
        break;
      }
    }
  }
}

// 年ごとのアコーディオンセクションHTMLを返す
function renderYearSection(year, months, monthBlocks, openMonth) {
  // 月ボタン（先頭にall追加）
  let monthBtns = `<div class="month-bar">`;
  monthBtns += `<button class="month-toggle" data-year="${year}" data-month="all"${!openMonth ? ' data-active="1"' : ''}>all</button>`;
  months.forEach(month => {
    monthBtns += `<button class="month-toggle" data-year="${year}" data-month="${month}"${openMonth === month ? ' data-active="1"' : ''}>${month}月</button>`;
  });
  monthBtns += '</div>';
  // 月ごとのリスト（allは全月分結合）
  let monthLists = `<div class="month-list" data-year="${year}" data-month="all" style="display:${openMonth ? 'none' : 'block'};">`;
  monthLists += months.map(month => monthBlocks[month]).join('');
  monthLists += '</div>';
  months.forEach(month => {
    monthLists += `<div class="month-list" data-year="${year}" data-month="${month}" style="display:${openMonth === month ? 'block' : 'none'};">${monthBlocks[month]}</div>`;
  });
  return `
    <div class="year-section">
      <button class="year-toggle">${year}年 ▼</button>
      <div class="music-list" style="display:none;">
        ${monthBtns}
        ${monthLists}
      </div>
    </div>
  `;
}

// 年アコーディオンの開閉イベントを付与
function attachAccordionEvents() {
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

// 月ボタンの切り替えイベントを付与
function attachMonthBarEvents() {
  document.querySelectorAll('.month-bar').forEach(bar => {
    bar.addEventListener('click', function(e) {
      if (!e.target.classList.contains('month-toggle')) return;
      const year = e.target.getAttribute('data-year');
      const month = e.target.getAttribute('data-month');
      // ボタンactive切替
      bar.querySelectorAll('.month-toggle').forEach(btn => btn.removeAttribute('data-active'));
      e.target.setAttribute('data-active', '1');
      // 月リスト表示切替
      const parent = bar.parentElement;
      parent.querySelectorAll('.month-list').forEach(list => {
        if (month === 'all') {
          list.style.display = (list.getAttribute('data-month') === 'all') ? 'block' : 'none';
        } else {
          list.style.display = (list.getAttribute('data-month') === month) ? 'block' : 'none';
        }
      });
    });
  });
} 