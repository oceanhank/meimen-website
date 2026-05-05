// 設定選單 current 樣式
function setCurrentMenu() {
	const currentUnit = document.body.id || '';
	if (!currentUnit) return;
	$('header .menu > li > a[href*="/' + currentUnit + '/"]').addClass('current');
}

// 禁止右鍵
function setRightKeyDisabled() {
	document.addEventListener('contextmenu', function (e) {
		e.preventDefault();
	});
}

// 設定 iframe RWD
function setIframeRWD() {
	const textEditors = document.querySelectorAll('.textEditor');
	if (!textEditors.length) return false;

	textEditors.forEach(textEditor => {
		const iframes = textEditor.querySelectorAll('iframe');
		if (!iframes.length) return false;

		iframes.forEach(iframe => {
			const iframeRatio = iframe.dataset.ratio; //data-ratio="16:9" or data-ratio="16/9"
			if (iframeRatio === '' || iframeRatio === undefined) return false;
			const regex = /\/|\:/;
			const ratioSplit = iframeRatio.split(regex);
			const wRate = Math.abs(Math.round(ratioSplit[0]));
			const hRate = Math.abs(Math.round(ratioSplit[1]));
			iframe.style.aspectRatio = `${wRate}/${hRate}`;
			iframe.style.height = 'auto';
		});
	});
}

// 單元相簿共用功能
const albumTriggerObj = function () {
	const _this = this;

	_this.defaultOptions = {
		doms: document.querySelectorAll('.albumListMain .albumItem'),
		start: 'mousedown',
		end: 'mouseup',
		mStart: 'touchstart',
		mEnd: 'touchend',
		container: '.albumBox',
		mainSlick: '.albumListMain',
		navSlick: '.albumListNav',
		tolerance: 5,
	}

	_this.calculateVal = {
		startPosition: '',
		endPosition: '',
		result: ''
	}

	_this.initial = function (customOptions) {
		_this.options = { ..._this.defaultOptions, ...customOptions };
		_this.slick(_this.options);

		_this.options.doms.forEach((dom) => {
			dom.addEventListener(_this.options.start, function (e) {
				if (isMobile || isTablet) {
					_this.calculate(_this.options.mStart, e);
				} else {
					_this.calculate(_this.options.start, e);
				}
			});
		});

		_this.options.doms.forEach((dom) => {
			dom.addEventListener(_this.options.end, function (e) {
				if (isMobile || isTablet) {
					_this.calculate(_this.options.mEnd, e);
				} else {
					_this.calculate(_this.options.end, e);
				}
			});
		});

		_this.options.doms.forEach((dom) => {
			dom.addEventListener('click', function (e) {
				if (
					Math.abs(_this.calculateVal.result) < _this.options.tolerance &&
					!isNaN(Math.abs(_this.calculateVal.result))
				) {
					$(_this.options.container).find('.titan a').eq($(this).data('index')).click();
				}
			});
		});
	}

	_this.slick = function (options) {
		console.log(options);
		$(options.mainSlick).slick({
			arrows: false,
			asNavFor: options.navSlick,
			cssEase: 'ease-in-out',
			infinite: true,
			speed: 500,
			slidesToShow: 1,
			slidesToScroll: 1
		});

		$(options.navSlick).slick({
			arrows: false,
			autoplay: true,
			autoplaySpeed: 3000,
			asNavFor: options.mainSlick,
			cssEase: 'ease-in-out',
			focusOnSelect: true,
			infinite: true,
			speed: 500,
			slidesToShow: 4,
			slidesToScroll: 1,
			responsive: [
				{
					breakpoint: 1024,
					settings: {
						slidesToShow: 3
					}
				},
				{
					breakpoint: 481,
					settings: {
						slidesToShow: 2
					}
				}
			]
		});
	}

	_this.calculate = function (pointer, e) {
		//start
		if (pointer === 'touchstart' || pointer === 'mousedown') {
			if (_this.options.start === 'touchstart') {
				_this.calculateVal.startPosition = e.changedTouches[0].clientX;
			} else {
				_this.calculateVal.startPosition = e.clientX;
			}
		}

		//end
		if (pointer === 'touchend' || pointer === 'mouseup') {
			if (_this.options.end === 'touchend') {
				_this.calculateVal.endPosition = e.changedTouches[0].clientX;
			} else {
				_this.calculateVal.endPosition = e.clientX;
			}

			_this.calculateVal.result = _this.calculateVal.startPosition - _this.calculateVal.endPosition;
		}
	}
}

// 圖片 lazy load
function imgObserver(customOptions = {}) {
	const _this = this;

	_this.defaultOptions = {
		dom: '.Img.observer img', // 圖片 dom
		threshold: 0.5 // 0.0 - 1.0 越小越早載入
	}

	_this.options = { ..._this.defaultOptions, ...customOptions };
	_this.images = document.querySelectorAll(_this.options.dom);

	if (!window.IntersectionObserver) {
		console.warn('瀏覽器不支援 IntersectionObserver，圖片 lazy load 功能將被跳過');
		document.querySelectorAll(_this.options.dom).forEach(function (image) {
			image.src = image.dataset.lazy;
			image.closest('.Img.observer').classList.add('loaded');
		});
		return;
	}

	const observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting) {
				const target = entry.target;
				target.src = target.dataset.lazy;
				target.closest('.Img.observer').classList.add('loaded');
				observer.unobserve(target); // 停止觀察
			}
		});
	}, { threshold: _this.options.threshold });

	_this.images.forEach(function (image) {
		if (image.dataset.lazy === '' || image.dataset.lazy === undefined) {
			console.error('img tags must have data-lazy attribute.');
			return false
		}
		observer.observe(image);
	});
}

// 滑動提示元件
function scrollHint(customOptions = {}) {
	const _this = this;

	_this.defaultOptions = {
		dom: '.dragscroll', // 監聽的 dom
		direction: 'horizontal', // horizontal / vertical
		text: 'scroll', // 提示文字
		hideClass: 'hide', // 隱藏的 class
		threshold: 10 // 滾動距離閾值
	}

	_this.options = { ..._this.defaultOptions, ...customOptions };

	_this.template = `
		<div class="scrollHint ${_this.options.direction}">
			<span class="scrollIcon"></span>
			<span class="scrollText js-scrollText">${_this.options.text}</span>
		</div>
	`;

	// 檢查是否有子元素 & 子元素是否超出父元素
	_this.checkChild = function (dom) {
		const child = [...dom.children];
		if (child.length === 0) return false;

		let result = false;
		child.forEach(item => {
			if (_this.options.direction === 'horizontal')
				result = item.offsetWidth > dom.offsetWidth;
			else if (_this.options.direction === 'vertical')
				result = item.offsetHeight > dom.offsetHeight;
		});
		return result;
	}

	// 新增提示 dom 並監聽 scroll 事件
	_this.createHint = function (dom) {
		dom.insertAdjacentHTML('afterbegin', _this.template);
		const scrollHandler = () => {
			let scrollHint = dom.querySelector('.scrollHint');
			let scroll = _this.options.direction === 'horizontal' ? dom.scrollLeft : dom.scrollTop;
			if (scroll > _this.options.threshold) {
				scrollHint.classList.add(_this.options.hideClass);
				dom.removeEventListener('scroll', scrollHandler, true);
				setTimeout(() => { scrollHint.remove() }, 1000)
			}
		}
		dom.addEventListener('scroll', scrollHandler, true);
	}

	// 監聽元素是否進入視窗
	let observer = new IntersectionObserver(function (entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				if (!_this.checkChild(entry.target)) return false;
				_this.createHint(entry.target);
				observer.unobserve(entry.target);
			}
		})
	});

	_this.doms = document.querySelectorAll(_this.options.dom);
	if (_this.doms.length === 0) return false;
	_this.doms.forEach(dom => {
		const position = window.getComputedStyle(dom).position;
		if (!position || position === 'static') dom.style.position = 'relative';
		observer.observe(dom);
	})
}

// 選單相關功能
function setMenuFunc() {
	if ($('header .dropDown').length) {
		$('header .dropDown').hover(function () {
			if ($(this).parent().hasClass('nav')) return false;
			$(this).addClass('open').find('.submenu').stop(false, false).slideDown(300);
		}, function () {
			if ($(this).parent().hasClass('nav')) return false;
			$(this).removeClass('open').find('.submenu').stop(false, false).slideUp(300);
		});
	}

	// 兩層下拉選單
	if ($('header .submenu.twoLayers .hasDataList').length) {
		$('header .submenu.twoLayers .hasDataList').hover(function () {
			$(this).find('.thirdMenu').stop(false, false).slideDown(300);
		}, function () {
			$(this).find('.thirdMenu').stop(false, false).slideUp(300);
		});
	}

	// 側邊選單
	$('.slideMenuArea .nav .dropDown').each(function () {
		if ($(this).has('.submenu').length) {
			$(this).addClass('hasSubMenu');

			// 自動開啟當前的單元子選單
			if ($(this).find('a.mainLink').hasClass('current')) {
				$(this).find('a.mainLink').addClass('open');
			}

			$(this).find('a.mainLink').on('click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				$(this).parents('.dropDown').toggleClass('open');
				$(this).parents('.dropDown').find('.submenu').stop(false, false).slideToggle(400);
				$(this).parents('.dropDown').siblings('.dropDown.open').removeClass('open').find('.submenu').slideUp(400);
			});
		}

		// 三層式選單
		$(this).find('.submenuItem').each(function () {
			if ($(this).find('.thirdMenu').length) {
				$(this).find('a.submenuItemTitle').addClass('hasThirdMenu');
				$(this).find('a.submenuItemTitle.hasThirdMenu').on('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					$(this).parents('.submenuItem').toggleClass('open');
					$(this).parents('.submenuItem').find('.thirdMenu').stop(false, false).slideToggle(400);
					$(this).parents('.submenuItem').siblings('.submenuItem.open').removeClass('open').find('.thirdMenu').slideUp(400);
				});
			}
		});
	});


	// 側邊選單開關
	$('.slideMenuTrigger').on('click ontouchstart', function () {
		if ($(this).hasClass('close')) {
			$('.slideMenuTrigger, .slideMenuArea, .slideMenuMask').removeClass('show');
			$('body').removeClass('disableScroll');
		}

		if ($(this).hasClass('open')) {
			if ($(this).hasClass('show')) {
				$(this).removeClass('show');
				$('.slideMenuArea, .slideMenuMask').removeClass('show').addClass('hide');
				$('body').removeClass('disableScroll');
			} else {
				$(this).addClass('show');
				$('.slideMenuArea, .slideMenuMask').removeClass('hide').addClass('show');
				$('body').addClass('disableScroll');
			}
		}
	});

	// 點遮罩關閉側邊選單
	$('.slideMenuMask').on('click', function () {
		$('.slideMenuTrigger, .slideMenuArea, .slideMenuMask').removeClass('show');
		$('body').removeClass('disableScroll');
	});
}

// 類別相關功能
function setClassFunc() {
	const classBox = document.querySelector('.classBox');
	if (!classBox) return;

	// 手機版類別選單開關
	$('.classBox .classCurrent').on('click', function (e) {
		e.stopPropagation();
		$(this).next('.classLink').toggleClass('open');

		// 點擊其他地方，關閉選單
		let isOpen = $(this).next('.classLink').hasClass('open');
		if (isOpen) {
			$(document).one('click', function () {
				$('.classLink').removeClass('open');
			});
		}
	});

	$('.classBoxColumn .classLink .classItem').each(function () {
		if ($(this).has('.dataList').length > 0) {
			$(this).children('a').addClass('linkHasItems').each(function () {
				// 如果自己有current，就展開 (會包含子項目有current的情況)
				if ($(this).hasClass('current')) {
					$(this).addClass('open');
					$(this).siblings('.dataList').slideDown();
				}
				// 點擊事件
				$(this).on('click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					$(this).toggleClass('open').next('.dataList').stop(false, false).slideToggle(400);
				});
			});
		}
	});
}

// 彈跳視窗 Module 相關功能
function setModuleFunc() {
	// 如果沒有 moduleMask 新增該 dom
	if ($('.moduleMask').length === 0) {
		$('.outerWrap').after('<div class="moduleMask"></div>');
	}

	// 通用開啟 module 功能
	$(document).on('click', '.openModule', function () {
		const obj = $(this).attr('href');
		$(obj).addClass('show');
		$('.moduleMask').addClass('show');
		$('body').addClass('disableScroll');
	});

	// 點擊遮罩或關閉按鈕關閉 module
	$('.moduleMask, .moduleClose').on('click', function () {
		$('.moduleBox, .moduleMask').removeClass('show');
		$('body').removeClass('disableScroll');
	});
}

// 搜尋相關功能
function setSearchFunc() {
	const searchBox = document.querySelector('.searchBox');
	if (!searchBox) return;

	$('.searchBox').each(function () {
		const $searchBtn = $(this).find('.searchBtn');
		const $searchInput = $(this).find('.searchInput');

		$searchBtn.on('click', function () {
			const value = $searchInput.val();
			const note = $searchInput.data('note');
			const target = $searchInput.data('target');
			goSearch(value, note, target);
		});

		$searchInput.on('keydown', function (event) {
			if (event.keyCode === 13) $searchBtn.click();
		});
	});

	function goSearch(value, note, target) {
		if (!value) {
			alert(note);
			return;
		}

		location.href = encodeURI(`${_http_url_link}/${target}/?keyword=${encodeURIComponent(window.btoa(encodeURIComponent(value)))}`);
	}
}

// 顯示模式功能
function setDisplayMode() {
	const item = document.querySelectorAll('.item');
	if (!item.length) return;

	$(document).on('click', '.item', function () {
		const targetLink = $(this).siblings().find('a');

		// 影音模式
		if ($(this).hasClass('hasVideo')) {
			if (isMobile == 'true') {
				const href = targetLink.attr('href');
				window.open(href);
			} else {
				targetLink.eq(0).click();
			}
			return;
		}

		// 多圖相簿
		if ($(this).hasClass('hasAlbum')) {
			targetLink.eq(0).click();
			return;
		}
	});
}

// 編輯器元件相關功能
function setEditorFunc() {
	const textEditor = document.querySelectorAll('.textEditor');
	if (!textEditor.length) return;

	$('.textEditor #editorTableOfContents').find('a').on('click', function (e) {
		e.preventDefault();
		const href = $(this).attr('href');
		const target = $(href);
		const headerHeight = $('header').height();
		const scrollTop = target.offset().top - headerHeight - 20;
		$('html, body').stop().animate({ scrollTop });
	});
}

function addZero(number, length) {
	return String(number).padStart(length, '0');
}

$(function () {
	//setRightKeyDisabled(); // 禁止右鍵
	setCurrentMenu();
	setIframeRWD();
	setMenuFunc();
	setClassFunc();
	setModuleFunc();
	setSearchFunc();
	setEditorFunc();
	setDisplayMode();

	imgObserver(); // 圖片 lazy load
	scrollHint(); // 滑動提示元件	

	const hasTextEditor = document.querySelector('.textEditor');
	if (hasTextEditor) {
		const script = document.createElement('script');
		// script.src = '../public/js/bootstrap.bundle.min.js';
		script.src = './js/bootstrap.bundle.min.js';
		script.async = true;
		document.head.appendChild(script);
	}

	// 語系選單
	$('.languageCurrent').on('click', function (e) {
		e.stopPropagation();
		const languageList = $(this).siblings('.languageList');
		languageList.toggleClass('show');

		if (languageList.hasClass('show')) {
			$(document).one('click', function () {
				$languageList.removeClass('show');
			});
		}
	});

	// mailLink
	$('.contactLink').on('click', function (e) {
		if (!isMobile) return;
		e.preventDefault();
		const href = $(this).data('mail');
		window.location.href = `mailto:${href}`;
	});

	// goTop
	$('.goTop').on('click', function (e) {
		e.preventDefault();
		$('html, body').stop().animate({ scrollTop: 0 }, 300);
	});
});