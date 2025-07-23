// include-common.js
// 共通パーツをcommon.htmlから一括取得し、各idの要素に挿入
function includeCommonParts() {
  fetch('common.html')
    .then(res => res.text())
    .then(html => {
      // 一時的なDOMにパース
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const header = tempDiv.querySelector('#header');
      const menubar = tempDiv.querySelector('#menubar-area');
      const footer = tempDiv.querySelector('#footer');
      if (document.getElementById('header') && header) {
        document.getElementById('header').innerHTML = header.innerHTML;
      }
      if (document.getElementById('menubar-area') && menubar) {
        document.getElementById('menubar-area').innerHTML = menubar.innerHTML;
      }
      if (document.getElementById('footer') && footer) {
        document.getElementById('footer').innerHTML = footer.innerHTML;
      }
      // 共通パーツ挿入後にbodyスクロール監視も再初期化
      if (typeof initBodyScrollObserver === 'function') {
        initBodyScrollObserver();
      }
      // 共通パーツ挿入後にメニューバーイベントも初期化
      if (typeof setupMenubarEvents === 'function') {
        setupMenubarEvents();
      }
    });
}
document.addEventListener('DOMContentLoaded', includeCommonParts); 