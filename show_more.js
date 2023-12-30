// もっと見るコンテンツ実装ここから
class ShowMore {
  constructor(options = {}) {
    // 初期値
    const {
      selector = ".showmore_wrap",
      prefix = "shm",
      displayShowHeightPc = 0.3,
      displayShowHeightSp = 0.2,
      closeBtnPosition = "bottom",
      offsetYPc = 0,
      offsetYSp = 0,
      showPc = true,
      showSp = true,
    } = options;
    (this.targetShowWrap = selector),
      (this.displayShowHeightPc = displayShowHeightPc),
      (this.displayShowHeightSp = displayShowHeightSp),
      (this.closeBtnPosition = closeBtnPosition),
      (this.headerHeightPc = offsetYPc),
      (this.headerHeightSp = offsetYSp),
      (this.showPc = showPc),
      (this.showSp = showSp),
      // アプリ内で使用するクラス名を管理
      (this.prefix = prefix),
      (this.classes = {}),
      (this.classes.active = `${this.prefix}_active`),
      (this.classes.activeOpen = `${this.prefix}--open`),
      (this.classes.activeClose = `${this.prefix}--close`),
      (this.classes.inner = `${this.prefix}_inner`),
      (this.classes.positionTop = `${this.prefix}_position--top`),
      (this.classes.topCover = `${this.prefix}_positionTop-cover`),
      (this.classes.positionBottom = `${this.prefix}_position--bottom`),
      (this.classes.btn = `${this.prefix}_btn`),
      (this.classes.btnTop = `${this.prefix}_btn--top`),
      (this.classes.btnBottom = `${this.prefix}_btn--bottom`),
      (this.classes.openLink = `${this.prefix}_btnTxt--open`),
      (this.classes.closeLink = `${this.prefix}_btnTxt--close`),
      // 実行
      this._init();
  }

  _init() {
    const showWraps = document.querySelectorAll(this.targetShowWrap);
    Array.from(showWraps).forEach((showWrap, index) => {
      // 対象要素にクラスを追加
      if (!showWrap.classList.contains(this.classes.active)) {
        showWrap.classList.add(this.classes.active, this.prefix + "_" + index);

        // デバイス判定
        const isDeviceSP = navigator.userAgent.match(/iPhone|Android.+Mobile/);
        // デバイスごとに非表示を設定
        if (this.showSp && isDeviceSP) {
          this._showMoreExe(showWrap);
          return;
        } else if (this.showPc && !isDeviceSP) {
          this._showMoreExe(showWrap);
          return;
        } else if (this.showSp && this.showPc) {
          this._showMoreExe(showWrap);
        } else if (!this.showSp && !this.showPc) {
          return;
        }
      }
    });
  }
  // もっとみる要素作成
  _showMoreExe(targetElm) {
    this._createShowElm(targetElm);
    this._createShowBottomBtn(targetElm);
    this._showmoreAddFc(targetElm);
  }

  // 要素のトップ位置を取得
  _getOffsetTop(targetElm) {
    const rect = targetElm.getBoundingClientRect();
    const scrollTop = window.scrollY || document.scrollingElement.scrollTop;
    return rect.top + scrollTop;
  }

  // 表示コンテンツの高さ
  _getDisplayShowHeight() {
    const isDeviceSP = navigator.userAgent.match(/iPhone|Android.+Mobile/);
    if (isDeviceSP) {
      return this.displayShowHeightSp;
    } else {
      return this.displayShowHeightPc;
    }
  }

  // スクロール位置を管理
  _scrollObserver(targetInner, headerHeight, displayState) {
    const observer = new ResizeObserver((entries) => {
      const showmoreToggle = entries[0].target.parentNode.querySelector(
        `.${this.classes.btn}`
      );
      const btnTopPosition = this._getOffsetTop(showmoreToggle);
      if (this.closeBtnPosition === "bottom") {
        window.scroll({
          top: btnTopPosition - Number(headerHeight),
          // behavior: 'smooth',
        });

        // 0.3秒後に監視を解除
        setTimeout(() => {
          observer.disconnect();
        }, 300);
      }
    });

    if (displayState === "displayClose") {
      observer.observe(targetInner);
    } else {
      observer.disconnect();
    }
  }

  // ヘッダーの高さ調整
  _getHeaderHeight() {
    const isDeviceSP = navigator.userAgent.match(/iPhone|Android.+Mobile/);
    if (isDeviceSP) {
      return this.headerHeightSp;
    } else {
      return this.headerHeightPc;
    }
  }
  // クラス切り替え（openした時）
  _switchClassOpen(elm, openClass, closeClass) {
    elm.classList.add(openClass);
    elm.classList.remove(closeClass);
  }

  // クラス切り替え（closeした時）
  _switchClassClose(elm, openClass, closeClass) {
    elm.classList.remove(openClass);
    elm.classList.add(closeClass);
  }

  // ターゲットの表示を開く
  _targetOpen(targetInner, targetShowHeight) {
    const parent = targetInner.parentNode;
    this._switchClassOpen(
      parent,
      this.classes.activeOpen,
      this.classes.activeClose
    );
    targetInner.style.height = targetShowHeight + "px";

    this._scrollObserver(targetInner, "", "displayOpen");
  }

  // ターゲットの表示を閉じる
  _targetClose(targetInner, targetCloseHeight, headerHeight) {
    targetInner.parentNode.classList.remove(this.classes.activeOpen);
    targetInner.parentNode.classList.add(this.classes.activeClose);
    targetInner.style.height = targetCloseHeight + "px";

    this._scrollObserver(targetInner, headerHeight, "displayClose");
  }

  // もっと見るボタンの表示を変更(open)
  _showmoreBtnChangeOpen(showBth) {
    showBth.classList.remove(this.classes.openLink);
    showBth.classList.add(this.classes.closeLink);
  }

  // もっと見るボタンの表示を変更(close)
  _showmoreBtnChangeClose(showBth) {
    showBth.classList.remove(this.classes.closeLink);
    showBth.classList.add(this.classes.openLink);
  }

  // もっと見るクリック
  _showmoreClick(
    targetContent,
    targetShowHeight,
    targetCloseHeight,
    headerHeight,
    self
  ) {
    const showBtn = this;
    const isOpen = showBtn.classList.contains(self.classes.openLink);
    const isClose = showBtn.classList.contains(self.classes.closeLink);

    if (isOpen) {
      self._targetOpen(targetContent, targetShowHeight);
      self._showmoreBtnChangeOpen(showBtn);
    } else if (isClose) {
      self._targetClose(targetContent, targetCloseHeight, headerHeight);
      self._showmoreBtnChangeClose(showBtn);
    }
  }

  // もっとみる要素作成
  _createShowElm(targetWrap) {
    // showmore_innerを追加
    if (targetWrap.querySelector(this.classes.inner) == null) {
      targetWrap.innerHTML =
        `<div class="${this.classes.inner}">` + targetWrap.innerHTML + "</div>";
    }
  }

  // もっと見るボタンを追加
  _createShowBottomBtn(targetWrap) {
    if (targetWrap.querySelector(`.${this.classes.btn}`) !== null) return;

    const showmoreInner = targetWrap.querySelector(`.${this.classes.inner}`);
    const createShowToggle = document.createElement("div");
    const createShowToggleButton = document.createElement("button");
    createShowToggleButton.type = "button";

    const btnClassName = this.closeBtnPosition === "top"
      ? this.classes.positionTop
      : this.classes.positionBottom;

    createShowToggle.classList.add(this.classes.btn, btnClassName);
    createShowToggleButton.classList.add(this.classes.openLink);
    createShowToggle.appendChild(createShowToggleButton);

    // ボタンを要素のトップに配置
    if (btnClassName == this.classes.positionTop) {
      showmoreInner.before(createShowToggle);

      if (targetWrap.querySelector(`.${this.classes.btnBottom}`) == null) {
        const createBottomCover = document.createElement("div");
        createBottomCover.classList.add(this.classes.topCover);
        targetWrap.appendChild(createBottomCover);
      }

      // ボタンを要素の下に配置
    } else if (btnClassName == this.classes.positionBottom) {
      targetWrap.appendChild(createShowToggle);
    }
  }

  // もっとみる要素に機能追加
  _showmoreAddFc(targetWrap) {
    const displayShowHeight = this._getDisplayShowHeight();
    const headerHeight = this._getHeaderHeight();
    const showmoreContent = targetWrap.querySelector(`.${this.classes.inner}`);
    const showmoreToggleButton = targetWrap.querySelector(
      `.${this.classes.btn} button`
    );
    let showHeight = parseInt(showmoreContent.offsetHeight);
    let closeHeight = parseInt(showHeight * displayShowHeight);

    const self = this;

    //初期値
    showmoreContent.style.height = closeHeight + "px";

    showmoreToggleButton.addEventListener(
      "click",
      this._showmoreClick.bind(
        showmoreToggleButton,
        showmoreContent,
        showHeight,
        closeHeight,
        headerHeight,
        self
      )
    );
  }
}
