
//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}


//===============================================================
// メニュー関連
//===============================================================

function initMenuEvents() {
  // 変数でセレクタを管理
  var $menubar = $('#menubar');
  var $menubarHdr = $('#menubar_hdr');
  var $headerNav = $('header nav');

  // menu
  $(window).on("load resize", debounce(function() {
      if(window.innerWidth < 9999) {
          $('body').addClass('small-screen').removeClass('large-screen');
          $menubar.addClass('display-none').removeClass('display-block');
          $menubarHdr.removeClass('display-none ham').addClass('display-block');
      } else {
          $('body').addClass('large-screen').removeClass('small-screen');
          $menubar.addClass('display-block').removeClass('display-none');
          $menubarHdr.removeClass('display-block').addClass('display-none');
          $('.ddmenu_parent > ul').hide();
      }
  }, 10));

  // ハンバーガーメニューをクリックした際の処理
  $menubarHdr.click(function() {
      $(this).toggleClass('ham');
      if ($(this).hasClass('ham')) {
          $menubar.addClass('display-block');
      } else {
          $menubar.removeClass('display-block');
      }
  });

  // アンカーリンクの場合にメニューを閉じる処理
  $menubar.find('a[href*="#"]').click(function() {
      $menubar.removeClass('display-block');
      $menubarHdr.removeClass('ham');
  });

  // ドロップダウンの親liタグ（空のリンクを持つaタグのデフォルト動作を防止）
  $menubar.find('a[href=""]').click(function() {
      return false;
  });
  $headerNav.find('a[href=""]').click(function() {
      return false;
  });

  // ドロップダウンメニューの処理
  $menubar.find('li:has(ul)').addClass('ddmenu_parent');
  $('.ddmenu_parent > a').addClass('ddmenu');
  $headerNav.find('li:has(ul)').addClass('ddmenu_parent');
  $('.ddmenu_parent > a').addClass('ddmenu');

  // タッチ開始位置を格納する変数
  var touchStartY = 0;

  // タッチデバイス用
  $('.ddmenu').on('touchstart', function(e) {
      touchStartY = e.originalEvent.touches[0].clientY;
  }).on('touchend', function(e) {
      var touchEndY = e.originalEvent.changedTouches[0].clientY;
      var touchDifference = touchStartY - touchEndY;
      if (Math.abs(touchDifference) < 10) {
          var $nextUl = $(this).next('ul');
          if ($nextUl.is(':visible')) {
              $nextUl.stop().hide();
          } else {
              $nextUl.stop().show();
          }
          $('.ddmenu').not(this).next('ul').hide();
          return false;
      }
  });

  //PC用
  $('.ddmenu_parent').hover(function() {
      $(this).children('ul').stop().show();
  }, function() {
      $(this).children('ul').stop().hide();
  });

  // ドロップダウンをページ内リンクで使った場合に、ドロップダウンを閉じる
  $('.ddmenu_parent ul a').click(function() {
      $('.ddmenu_parent > ul').hide();
  });
}

// ページロード時にも初期化
$(function(){ initMenuEvents(); });


//===============================================================
// 小さなメニューが開いている際のみ、body要素のスクロールを禁止。
//===============================================================
function initBodyScrollObserver() {
  function toggleBodyScroll() {
    var menubarHdr = document.getElementById('menubar_hdr');
    if (menubarHdr && menubarHdr.classList.contains('ham') && !menubarHdr.classList.contains('display-none')) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
  }
  toggleBodyScroll();
  var menubarHdr = document.getElementById('menubar_hdr');
  if (menubarHdr) {
    const observer = new MutationObserver(toggleBodyScroll);
    observer.observe(menubarHdr, { attributes: true, attributeFilter: ['class'] });
  }
}
// ページロード時にも初期化
$(function(){ initBodyScrollObserver(); });


//===============================================================
// スムーススクロール（※バージョン2024-1）※通常タイプ
//===============================================================
$(function() {
    // ページ上部へ戻るボタンのセレクター
    var topButton = $('.pagetop');
    // ページトップボタン表示用のクラス名
    var scrollShow = 'pagetop-show';

    // スムーススクロールを実行する関数
    // targetにはスクロール先の要素のセレクターまたは'#'（ページトップ）を指定
    function smoothScroll(target) {
        // スクロール先の位置を計算（ページトップの場合は0、それ以外は要素の位置）
        var scrollTo = target === '#' ? 0 : $(target).offset().top;
        // アニメーションでスムーススクロールを実行
        $('html, body').animate({scrollTop: scrollTo}, 500);
    }

    // ページ内リンクとページトップへ戻るボタンにクリックイベントを設定
    $('a[href^="#"], .pagetop').click(function(e) {
        e.preventDefault(); // デフォルトのアンカー動作をキャンセル
        var id = $(this).attr('href') || '#'; // クリックされた要素のhref属性を取得、なければ'#'
        smoothScroll(id); // スムーススクロールを実行
    });

    // スクロールに応じてページトップボタンの表示/非表示を切り替え
    $(topButton).hide(); // 初期状態ではボタンを隠す
    $(window).scroll(function() {
        if($(this).scrollTop() >= 300) { // スクロール位置が300pxを超えたら
            $(topButton).fadeIn().addClass(scrollShow); // ボタンを表示
        } else {
            $(topButton).fadeOut().removeClass(scrollShow); // それ以外では非表示
        }
    });

    // ページロード時にURLのハッシュが存在する場合の処理
    if(window.location.hash) {
        // ページの最上部に即時スクロールする
        $('html, body').scrollTop(0);
        // 少し遅延させてからスムーススクロールを実行
        setTimeout(function() {
            smoothScroll(window.location.hash);
        }, 10);
    }
});


//===============================================================
// 汎用開閉処理
//===============================================================
$(function() {
	$('.openclose').next().hide();
	$('.openclose').click(function() {
		$(this).next().slideToggle();
		$('.openclose').not(this).next().slideUp();
	});
});