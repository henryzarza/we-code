/**
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2015, Codrops and modify for Henry Zarza
 * http://www.codrops.com
 */
; (function (window) {

	'use strict';

	var support = { transitions: Modernizr.csstransitions },
		// transition end event name
		transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
		transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
		onEndTransition = function (el, callback) {
			var onEndCallbackFn = function (ev) {
				if (support.transitions) {
					if (ev.target != this) return;
					this.removeEventListener(transEndEventName, onEndCallbackFn);
				}
				if (callback && typeof callback === 'function') { callback.call(this); }
			};
			if (support.transitions) {
				el.addEventListener(transEndEventName, onEndCallbackFn);
			}
			else {
				onEndCallbackFn();
			}
		},
		// the pages wrapper
		stack = document.querySelector('.pages-stack'),
		// the page elements
		pages = [].slice.call(stack.children),
		// total number of page elements
		pagesTotal = pages.length,
		// index of current page
		current = 0,
		// menu button
		menuCtrl = document.querySelector('button.menu-button'),
		// the navigation wrapper
		nav = document.querySelector('.pages-nav'),
		// the menu nav items
		navItems = [].slice.call(nav.querySelectorAll('.link--page')),
		// check if menu is open
		isMenuOpen = false;

	function init() {
		buildStack();
		initEvents();
	}

	function buildStack() {
		var stackPagesIdxs = getStackPagesIdxs();

		// set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
		for (var i = 0; i < pagesTotal; ++i) {
			var page = pages[i],
				posIdx = stackPagesIdxs.indexOf(i);

			if (current !== i) {
				page.classList.add('page--inactive');

				if (posIdx !== -1) {
					// visible pages in the stack
					page.style.WebkitTransform = 'translate3d(0,100%,0)';
					page.style.transform = 'translate3d(0,100%,0)';
				}
				else {
					// invisible pages in the stack
					page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
					page.style.transform = 'translate3d(0,75%,-300px)';
				}
			}
			else {
				page.classList.remove('page--inactive');
			}

			page.style.zIndex = i < current ? parseInt(current - i) : parseInt(pagesTotal + current - i);

			if (posIdx !== -1) {
				page.style.opacity = parseFloat(1 - 0.1 * posIdx);
			}
			else {
				page.style.opacity = 0;
			}
		}
	}

	// event binding
	function initEvents() {
		// menu button click
		menuCtrl.addEventListener('click', toggleMenu);

		// navigation menu clicks
		navItems.forEach(function (item) {
			// which page to open?
			var pageid = item.getAttribute('href').slice(1);
			item.addEventListener('click', function (ev) {
				ev.preventDefault();
				addActiveClass(pageid);
				openPage(pageid);
			});
		});

		// clicking on a page when the menu is open triggers the menu to close again and open the clicked page
		pages.forEach(function (page) {
			var pageid = page.getAttribute('id');
			page.addEventListener('click', function (ev) {
				if (isMenuOpen) {
					ev.preventDefault();
					addActiveClass(pageid);
					openPage(pageid);
				}
			});
		});

		// keyboard navigation events
		document.addEventListener('keydown', function (ev) {
			if (!isMenuOpen) return;
			var keyCode = ev.keyCode || ev.which;
			if (keyCode === 27) {
				closeMenu();
			}
		});
	}

	// add class active
	function addActiveClass(pageId) {
		navItems.forEach(function (item) {
			item.classList.remove('link--active');
			if (item.getAttribute('href').slice(1) === pageId) {
				item.classList.add('link--active');
			}
		});
	}

	// toggle menu fn
	function toggleMenu() {
		if (isMenuOpen) {
			closeMenu();
		}
		else {
			openMenu();
			isMenuOpen = true;
		}
	}

	// opens the menu
	function openMenu() {
		// toggle the menu button
		menuCtrl.classList.add('menu-button--open');
		// stack gets the class "pages-stack--open" to add the transitions
		stack.classList.add('pages-stack--open');
		// reveal the menu
		nav.classList.add('pages-nav--open');

		// now set the page transforms
		var stackPagesIdxs = getStackPagesIdxs();
		for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			var page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
			page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50 * i) + 'px)';
		}
	}

	// closes the menu
	function closeMenu() {
		// same as opening the current page again
		openPage();
	}

	// opens a page
	function openPage(id) {
		var futurePage = id ? document.getElementById(id) : pages[current],
			futureCurrent = pages.indexOf(futurePage),
			stackPagesIdxs = getStackPagesIdxs(futureCurrent);

		// set transforms for the new current page
		futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
		futurePage.style.transform = 'translate3d(0, 0, 0)';
		futurePage.style.opacity = 1;

		// set transforms for the other items in the stack
		for (var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
			var page = pages[stackPagesIdxs[i]];
			page.style.WebkitTransform = 'translate3d(0,100%,0)';
			page.style.transform = 'translate3d(0,100%,0)';
		}

		// set current
		if (id) {
			current = futureCurrent;
		}

		// close menu
		menuCtrl.classList.remove('menu-button--open');
		nav.classList.remove('pages-nav--open');
		onEndTransition(futurePage, function () {
			stack.classList.remove('pages-stack--open');
			// reorganize stack
			buildStack();
			isMenuOpen = false;
		});
	}

	// gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
	function getStackPagesIdxs(excludePageIdx) {
		var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
			nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
			idxs = [],

			excludeIdx = excludePageIdx || -1;

		if (excludePageIdx != current) {
			idxs.push(current);
		}
		if (excludePageIdx != nextStackPageIdx) {
			idxs.push(nextStackPageIdx);
		}
		if (excludePageIdx != nextStackPageIdx_2) {
			idxs.push(nextStackPageIdx_2);
		}

		return idxs;
	}

	init();

	setTimeout(() => {
		anime({
			targets: '.svg-title path',
			fill: ['rgba(0,0,0,0)', '#FFF'],
			strokeDashoffset: [anime.setDashoffset, 0],
			easing: 'easeInOutSine',
			duration: 400,
			delay: function (el, i) { return i * 150 }
		});
	
	}, 1000);

	anime({
		targets: '.header__desc',
		translateY: 10,
		scale: [0, 1],
		delay: 4500,
		duration: 700
	});

})(window);
