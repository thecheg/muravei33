//=include ../../node_modules/jquery/dist/jquery.js
//=include ../../node_modules/device.js/dist/device.umd.js

//=include ../../node_modules/@studio-freight/lenis/bundled/lenis.js

//=include ../../node_modules/gsap/dist/gsap.js
//=include ../../node_modules/three/build/three.js
//=include ../modules/distortion/functions.js

//=include ../../node_modules/swiper/swiper-bundle.js

//=include ../../node_modules/jquery-mask-plugin/dist/jquery.mask.js

//=include ../modules/fancybox/fancybox.js

/*
 * Cheg UI 3.0.0
*/
const app = {
	settings: {
		winWidth: 0,
		winHeight: 0,

		sbWidth: 0,

		scrollOffset: function() {
			return $('.header').outerHeight();
		},
		scrollPos: 0,
		popupOpened: false,
		scrollLockPos: 0,

		animDuration: 400,

		pageLoaded: false,

		formTitle: '',

		menuOpened: false,
	},
	deviceIs: device.device,

	/*
	 * Checking if matches media query
	*/
	matches(query) {
		return window.matchMedia(`(${query})`).matches
	},

	/*
	 * Scroll to hash on page laod
	*/
	toHash() {
		if (window.location.hash) {
			app.scrollTo(window.location.hash, app.settings.scrollOffset);
		}
	},
	
	/*
	* Menu
	*/
	menu: {
		bind() {
			// * Click on burger
			$(document).on('click', '.menu-toggle', function () {
				!app.settings.menuOpened ? app.menu.open() : app.menu.close();
			});

			/*let left = $('.header .ui-sidemenu__link--a');

			left.on('mouseenter', function() {
				if (app.matches('min-width:1101px')) {
					left.removeClass('hover');
					$(this).addClass('hover');
					
					let id = $(this).closest('.ui-sidemenu__item').attr('data-menu');

					$('.header__menu-item').removeClass('active');
					$('.header__menu-item[data-menu="'+id+'"]').addClass('active');
				}
			});

			let current;

			if ($('.header__main-left .ui-sidemenu__link.current').length) {
				current = $('.header__main-left .ui-sidemenu__link--a.current').first();
			} else {
				current = $('.header__main-left .ui-sidemenu__link--a').first();
			}*/

			let left = $('.header .ui-sidemenu__link');

			left.on('mouseenter', function() {
				if (app.matches('min-width:1101px')) {
					let id = $(this).closest('.ui-sidemenu__item').attr('data-menu');
					
					$('.header__menu-item').removeClass('active');
					$('.header__menu-item[data-menu="'+id+'"]').addClass('active');
				}
			});

			let current;

			if ($('.header__main-left .ui-sidemenu__link.current').length) {
				current = $('.header__main-left .ui-sidemenu__link.current').first();
			} else {
				current = $('.header__main-left .ui-sidemenu__link').first();
			}

			current.trigger('mouseenter');

			$('.header .ui-sidemenu').on('mouseleave', function() {
				//current.trigger('mouseenter');
			});

			
			$(document).on('click', '.header__menu-arr', function() {
				let item = $(this).closest('.header__menu-item'),
					sub = item.find('.header__menu-sublist');

				if (!item.hasClass('opened')) {
					item.addClass('opened');
					sub.slideDown(400);
				} else  {
					item.removeClass('opened');
					sub.slideUp(400);
				}
			});
		},
		// * Open menu
		open() {
			$('.app').addClass('app--menu-opened');
			app.scrollLock();
	
			app.settings.menuOpened = true;
		},
		// * Close menu
		close() {
			$('.app').removeClass('app--menu-opened');
			app.scrollLock('unlock');
	
			app.settings.menuOpened = false;
		}
	},

	/*
	 * Animate on scroll
	*/
	onscroll(block) {
		new IntersectionObserver(([el]) => {
			if (el.isIntersecting && !$(el).hasClass('onscroll--in') && app.settings.pageLoaded) {
				setTimeout(function() {
					$(el.target).addClass('onscroll--in');
				},300);
	
				return;
			}
		}, {
			root: document,
			rootMargin: '0px 0px',
			threshold: 0,
		}).observe(block.get(0));
		
		block.data('onscrollInit', true);
	},

	/*
	 * Scroll
	*/
	scroll: {
		lenis: {},
		inited: false,
		init() {
			let _this = this;

			//gsap.registerPlugin(ScrollTrigger);

			_this.lenis = new Lenis({
				lerp:0.04
			});
			
			_this.lenis.on('scroll', (e) => {
				//ScrollTrigger.update();
			});

			function raf(time) {
				_this.lenis.raf(time)
				requestAnimationFrame(raf);
			}
			requestAnimationFrame(raf)

			/*;gsap.ticker.add((time)=>{
				_this.lenis.raf(time * 1000);
			});*/

			_this.inited = true;
		},
	},

	/*
	 * Intro
	*/
	intro(block) {
		let slider = block.find('.intro__slider'),
			sliderS,
			opts = {
				slidesPerView: 1,
				spaceBetween: 0,
				speed: 1000,
				autoplay: {
					delay:5000,
					disableOnInteraction: false
				},
				loop: true,
				loopedSlides: 1,
				preloadImages: false,
				lazy: {
					checkInView: true,
					loadOnTransitionStart: true,
					loadPrevNext: true,
				},
				watchSlidesProgress: true,
				grabCursor: true,
				init: true,
				pagination: {
					el: block.find('.intro__pages-list').get(0),
					clickable: true,
					bulletActiveClass: 'active',
					renderBullet: function(i, className) {
						return '<button class="intro__pages-item ' + className + '" type="button"></button>';
					}
				}
			};

		sliderS = new Swiper(slider.get(0), opts);

		block.data('introInit', true);
	},

	/*
	 * Sticky sidebar
	*/
	stickySide(block) {
		let sticky = block.find('.ui-layout__side-in');

		$(window).on('resize', function() {
			let stickyHeight = sticky.outerHeight() + 40 + app.settings.scrollOffset;

			if (stickyHeight >= app.settings.winHeight) {
				sticky.addClass('static');
			} else {
				sticky.removeClass('static');
			}
		});
		
		block.data('stickySideInit', true);
	},

	/*
	 * Masonry fix
	*/
	masonry() {
		$('.ui-masonry__grid').each(function() {
			let block = $(this),
				items = block.find('.ui-masonry__col').length;

			if (items % 2 > 0) {
				block.addClass('fix');
			}
		});
	},

	/*
	 * Distortion
	*/
	distor(block) {
		let opts = JSON.parse(block.attr('data-distor')),
			hover = new hoverEffect({
				parent: block.get(0),
				trigger: block.closest('.distortion-c').get(0),
				intensity: opts.intensity || .3,
				speedIn: opts.speedIn || .7,
				speedOut: opts.speedOut || .7,
				image1: opts.img1,
				image2: opts.img2,
				displacementImage: opts.effect,
				imagesRatio: opts.ratioH / opts.ratioW
			});

		block.removeAttr('data-distor');
			
		block.data('distorInit', true);
	},

	/*
	 * Info block
	*/
	info(block, i) {
		let items = block.find('.ui-info__imgs-item');

		items.each(function() {
			if ($(this).is('a')) {
				$(this).attr('data-fancybox', `gallery-${i}`);
			}
		});

		if (items.length > 1) {
			items.addClass('swiper-slide')
			items.wrapAll('<div class="swiper-wrapper" />');

			block.find('.ui-info__imgs').append('<div class="ui-info__imgs-dots ui-dots" />');

			let slider = block.find('.ui-info__imgs-list'),
				sliderS,
				opts = {
					slidesPerView: 1,
					spaceBetween: 0,
					speed: 500,
					autoplay: {
						delay:4000,
						disableOnInteraction: false
					},
					loop: true,
					loopedSlides: 1,
					preloadImages: false,
					lazy: {
						checkInView: true,
						loadOnTransitionStart: true,
						loadPrevNext: true,
					},
					watchSlidesProgress: true,
					grabCursor: true,
					init: true,
					pagination: {
						el: block.find('.ui-dots').get(0),
						clickable: true,
						bulletActiveClass: 'active',
						renderBullet: function(i, className) {
							return '<button class="ui-dots__item ' + className + '" type="button"></button>';
						}
					}
				};

			sliderS = new Swiper(slider.get(0), opts);
		} else {
			items.each(function() {
				let img = $(this).find('img'),
					src = img.attr('data-src');
					
				img
					.removeClass('swiper-lazy')
					.attr('src',src)
					.removeAttr('data-src');

			});
		}
			
		block.data('infoInit', true);
	},

	/*
	 * Related
	*/
	related(block) {
		let slider = block.find('.related__slider'),
			sliderS,
			opts = {
				slidesPerView: 'auto',
				spaceBetween: 40,
				speed: 500,
				/*autoplay: {
					delay:4000,
					disableOnInteraction: false
				},*/
				loop: false,
				preloadImages: false,
				lazy: {
					checkInView: true,
					loadOnTransitionStart: true,
					loadPrevNext: true,
				},
				watchSlidesProgress: true,
				grabCursor: true,
				init: true,
				navigation: {
					nextEl: block.find('.ui-arrow--n').get(0),
					prevEl: block.find('.ui-arrow--p').get(0),
				},
				breakpoints: {
					1: {
						spaceBetween: 20,
					},
					1001: {
						spaceBetween: 40,
					}
				}
			};

		sliderS = new Swiper(slider.get(0), opts);

		block.data('relatedInit', true);
	},

	/*
	 * Input masks
	*/
	mask: {
		phone(inp) {
			inp.mask('+7 (000) 000 00 00', {
				placeholder: '+7 (---) --- -- --'
			});
		
			inp.data('maskInit', true);
		}
	},
};
	
//=include ../modules/cheg.units/functions.js

//=include ../modules/cheg.scrollto/functions.js

//=include ../modules/cheg.tabs/functions.js
//=include ../modules/cheg.expand/functions.js

//=include ../modules/cheg.scrolllock/functions.js
//=include ../modules/cheg.popups/functions.js

//=include ../modules/cheg.waypoint/functions.js

//=include ../modules/cheg.checkwebp/functions.js

/*
 * Init
*/
app.init = () => {
	// * Units
	app.units.all();

	// * Header
	if ($('.page__top').hasClass('page__top--s')) {
		$('.header').addClass('header--bg');
	} else {
		$('.header').removeClass('header--bg');
	}

	// * Masonry fix
	app.masonry();

	// * Intro
	$('.intro').each(function () {
		if (!$(this).data('introInit')) {
			app.intro($(this));
		}
	});

	// * Tabs
	$('.ui-tabs').not('.custom').each(function () {
		if (!$(this).data('tabsInit')) {
			app.tabs.init($(this));
		}
	});
	app.tabs.bind();

	// * Expandable blocks
	$('.ui-expand').not('.custom').each(function () {
		if (!$(this).data('expandInit')) {
			app.expand($(this));
		}
	});

	// * Popups
	$('.popup').each(function () {
		if (!$(this).data('popupsInit')) {
			app.popups.init($(this));
		}
	});
	app.popups.bind();

	// * Sticky sidebar
	$('.ui-layout__side').each(function () {
		if (!$(this).data('stickySideInit')) {
			app.stickySide($(this));
		}
	});

	// * Distortion
	$('.distortion').each(function () {
		if (!$(this).data('distorInit')) {
			app.distor($(this));
		}
	});

	// * Related
	$('.related').each(function () {
		if (!$(this).data('relatedInit')) {
			app.related($(this));
		}
	});

	// * Info block
	$('.ui-info').each(function (i) {
		if (!$(this).data('infoInit')) {
			app.info($(this), i);
		}
	});

	// * Input masks
	$('input[name="phone"], .phone-input').each(function () {
		if (!$(this).data('maskInit')) {
			app.mask.phone($(this));
		}
	});

	// * Animate on scroll
	$(document).on('app.loaded', function() {
		$('.onscroll').each(function () {
			if ($(this).data('onscrollInit') !== true) {
				app.onscroll($(this));
			}
		});
	});

	// * Scroll to hash on page laod
	app.toHash();
}

app.deviceIs.addClasses(document.documentElement);

$.fancybox.defaults.backFocus = false;
$.fancybox.defaults.hash = false;
$.fancybox.defaults.beforeShow = function() {
	app.scrollLock();
};
$.fancybox.defaults.afterClose = function() {
	app.scrollLock('unlock');
};

(function () {
	app.deviceIs.touch ? $('html').addClass('touch') : $('html').addClass('no-touch');

	app.settings.winWidth = $(window).width();
	app.settings.winHeight = $(window).height();
	app.settings.scrollPos = $(window).scrollTop();
	app.settings.scrollOffset = function() {
		return $('.header').outerHeight();
	};

	// * Init
	app.init();

	// * Menu
	app.menu.bind();

	//app.popups.open('offer');

	$(document).on('click', '.ui-field__legend', function() {
		$(this).closest('.ui-field').find('input, textarea').trigger('focus');
	});

	$(document).on('click', '.ui-layout__menu-btn', function() {
		$(this).closest('.ui-layout__menu').toggleClass('active');
	});

	app.waypoint({
		position: 1,
		onDown: function() {
			$('.app').addClass('app--scrolled');
			$('.header').addClass('header--scrolled');
		},
		onUp: function() {
			$('.app').removeClass('app--scrolled');
			$('.header').removeClass('header--scrolled');
		}
	});


	if (app.deviceIs.desktop) {
		$(window).on('resize', function () {
			app.units.all();
		});
	} else {

	}

	if (app.deviceIs.mobile || app.deviceIs.tablet) {
		$(window).on('orientationchange', function () {
			app.units.vh();
		}).on('resize', function () {
			app.units.mobile();
		});
	}

	$(window).on('resize', function () {
		app.settings.winWidth = $(window).width();
		app.settings.winHeight = $(window).height();
		app.settings.scrollPos = $(window).scrollTop();

		app.settings.menuOpened ? app.menu.close() : null;
	}).on('scroll', function () {
		app.settings.scrollPos = $(window).scrollTop();
	}).trigger('resize').trigger('scroll');

	// * Scroll to element
	$(document).on('click', 'a[href^="#"], .scrollTo', function (e) {
		e.preventDefault();
		let el = $(this).attr('href') || $(this).attr('data-scrollto-target');

		app.scrollTo(el, app.settings.scrollOffset);
	});
})(jQuery);

$(window).on('load', function () {
	setTimeout(function () {
		// * hide preloader
		$('.preloader').fadeOut(1000, function () {
			$(this).remove();
		});
		$('.app').addClass('app--loaded');
		app.settings.pageLoaded = true;
		$(document).trigger('app.loaded');
		$(window).trigger('scroll');
	}, 300);

	// * Smooth scroll
	if (!app.scroll.inited) {
		app.scroll.init();
	}
});