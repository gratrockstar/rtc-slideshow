import { store, getContext, getElement } from '@wordpress/interactivity';

store('rtc-slideshow', {
	state: {},
	actions: {
		// Go to the previous slide.
		prevSlide: () => {
			const ctx = getContext();
			const { ref } = getElement();
			const parent = ref.closest('[data-wp-interactive]');
			const slides = parent.querySelectorAll('.slide');
			if (ctx.activeSlide === 0) {
				ctx.activeSlide = slides.length - 1;
			} else {
				ctx.activeSlide--;
			}
			clearInterval(ctx.timerRef);
			ctx.timerRef = null;
		},
		// Go to the next slide.
		nextSlide: () => {
			const ctx = getContext();
			const { ref } = getElement();
			const parent = ref.closest('[data-wp-interactive]');
			const slides = parent.querySelectorAll('.slide');
			if (ctx.activeSlide === slides.length - 1) {
				ctx.activeSlide = 0;
			} else {
				ctx.activeSlide++;
			}
			clearInterval(ctx.timerRef);
			ctx.timerRef = null;
		},
		// Go to a specific slide.
		goToSlide: (e) => {
			const ctx = getContext();
			const index = e.target.dataset.index;
			ctx.activeSlide = index;
			clearInterval(ctx.timerRef);
			ctx.timerRef = null;
		},
		// On touchstart event.
		onTouchStart: (e) => {
			const ctx = getContext();
			ctx.touchStart = e.touches[0].clientX;
		},
		// On touchend event.
		onTouchEnd: (e) => {
			const ctx = getContext();
			const threshold = 50;
			const touchStart = ctx.touchStart;
			const touchEnd = e.changedTouches[0].clientX;
			const deltaX = touchEnd - touchStart;
			const { actions } = store('rtc-slideshow');

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
		handleKeyboardNav: (e) => {
			const { actions } = store('rtc-slideshow');
			if (e.key === 'ArrowRight') {
				actions.nextSlide();
			}
			if (e.key === 'ArrowLeft') {
				actions.prevSlide();
			}
		},
	},
	callbacks: {
		// Init the slideshow.
		initSlideshow: () => {
			const ctx = getContext();
			if (ctx.autoplay && ctx.timerRef === null) {
				const { ref } = getElement();
				const slides = ref.querySelectorAll('.slide');
				ctx.timerRef = setInterval(() => {
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
		watchSlideChange: () => {
			const { activeSlide } = getContext();
			const { ref } = getElement();

			// update slideshow classes.
			ref.querySelector('.slide-active')?.classList.remove(
				'slide-active'
			);
			ref.querySelector(
				`.slide[data-index="${activeSlide}"]`
			)?.classList.add('slide-active');

			// update pagination classes.
			ref.querySelector('.pagination-active').classList.remove(
				'pagination-active'
			);
			ref.querySelector(
				`.pagination-item[data-index="${activeSlide}"]`
			).classList.add('pagination-active');
		},
	},
});
