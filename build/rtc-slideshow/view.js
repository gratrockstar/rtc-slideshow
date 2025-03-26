import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ (function(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ !function() {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ }();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
!function() {
/*!***********************************!*\
  !*** ./src/rtc-slideshow/view.js ***!
  \***********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");

(0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('rtc-slideshow', {
  state: {},
  actions: {
    // Go to the previous slide.
    prevSlide: function prevSlide() {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      var _getElement = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)(),
        ref = _getElement.ref;
      var parent = ref.closest('[data-wp-interactive]');
      var slides = parent.querySelectorAll('.slide');
      if (ctx.activeSlide === 0) {
        ctx.activeSlide = slides.length - 1;
      } else {
        ctx.activeSlide--;
      }
      clearInterval(ctx.timerRef);
      ctx.timerRef = null;
    },
    // Go to the next slide.
    nextSlide: function nextSlide() {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      var _getElement2 = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)(),
        ref = _getElement2.ref;
      var parent = ref.closest('[data-wp-interactive]');
      var slides = parent.querySelectorAll('.slide');
      if (ctx.activeSlide === slides.length - 1) {
        ctx.activeSlide = 0;
      } else {
        ctx.activeSlide++;
      }
      clearInterval(ctx.timerRef);
      ctx.timerRef = null;
    },
    // Go to a specific slide.
    goToSlide: function goToSlide(e) {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      var index = e.target.dataset.index;
      ctx.activeSlide = index;
      clearInterval(ctx.timerRef);
      ctx.timerRef = null;
    },
    // On touchstart event.
    onTouchStart: function onTouchStart(e) {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      ctx.touchStart = e.touches[0].clientX;
    },
    // On touchend event.
    onTouchEnd: function onTouchEnd(e) {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      var threshold = 50;
      var touchStart = ctx.touchStart;
      var touchEnd = e.changedTouches[0].clientX;
      var deltaX = touchEnd - touchStart;
      var _store = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('rtc-slideshow'),
        actions = _store.actions;
      if (ctx.touchStart) {
        if (Math.abs(deltaX) > threshold) {
          // swipe left.
          if (deltaX > 0) {
            actions.prevSlide();
            // swipe right.
          } else {
            actions.nextSlide();
          }
        }
      }
      ctx.touchStart = null;
    },
    // Handle keyboard navigation.
    handleKeyboardNav: function handleKeyboardNav(e) {
      var _store2 = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('rtc-slideshow'),
        actions = _store2.actions;
      if (e.key === 'ArrowRight') {
        actions.nextSlide();
      }
      if (e.key === 'ArrowLeft') {
        actions.prevSlide();
      }
    }
  },
  callbacks: {
    // Init the slideshow.
    initSlideshow: function initSlideshow() {
      var ctx = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)();
      if (ctx.autoplay && ctx.timerRef === null) {
        var _getElement3 = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)(),
          ref = _getElement3.ref;
        var slides = ref.querySelectorAll('.slide');
        ctx.timerRef = setInterval(function () {
          // for some reason, actions.nextSlide() is throwing a context error here,
          // so I'll just copy the logic since it's small.
          if (ctx.activeSlide === slides.length - 1) {
            ctx.activeSlide = 0;
          } else {
            ctx.activeSlide++;
          }
        }, ctx.delay);
      }
    },
    // Watch for activeSlide change.
    watchSlideChange: function watchSlideChange() {
      var _ref$querySelector, _ref$querySelector2;
      var _getContext = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getContext)(),
        activeSlide = _getContext.activeSlide;
      var _getElement4 = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)(),
        ref = _getElement4.ref;

      // update slideshow classes.
      (_ref$querySelector = ref.querySelector('.slide-active')) === null || _ref$querySelector === void 0 || _ref$querySelector.classList.remove('slide-active');
      (_ref$querySelector2 = ref.querySelector(".slide[data-index=\"".concat(activeSlide, "\"]"))) === null || _ref$querySelector2 === void 0 || _ref$querySelector2.classList.add('slide-active');

      // update pagination classes.
      ref.querySelector('.pagination-active').classList.remove('pagination-active');
      ref.querySelector(".pagination-item[data-index=\"".concat(activeSlide, "\"]")).classList.add('pagination-active');
    }
  }
});
}();

//# sourceMappingURL=view.js.map