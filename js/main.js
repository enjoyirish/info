//===============================================================
// メニューが開いている間だけbodyのスクロールを禁止（シンプル版）
//===============================================================
function initBodyScrollObserver() {
  function toggleBodyScroll() {
    var menubar = document.getElementById('menubar');
    if (menubar && menubar.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  toggleBodyScroll();
  var menubar = document.getElementById('menubar');
  if (menubar) {
    const observer = new MutationObserver(toggleBodyScroll);
    observer.observe(menubar, { attributes: true, attributeFilter: ['class'] });
  }
}

function setupMenubarEvents() {
  var menubar = document.getElementById('menubar');
  var menubarHdr = document.getElementById('menubar_hdr');
  var icon = menubarHdr ? menubarHdr.querySelector('i') : null;

  if (menubarHdr && menubar && icon) {
    menubarHdr.onclick = function() {
      if (menubar.classList.contains('active')) {
        menubar.classList.remove('active');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
        icon.classList.add('fas');
        icon.classList.remove('far');
      } else {
        menubar.classList.add('active');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        icon.classList.add('fas');
        icon.classList.remove('far');
      }
    };
  }
}