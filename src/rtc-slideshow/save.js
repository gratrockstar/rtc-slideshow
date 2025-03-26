import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { date } from '@wordpress/date';

export default function save({ attributes }) {
	// Destructure our block attributes.
	const { posts, showNavigation, showPagination, autoplay, autoplayDelay } =
		attributes;

	// helper functions
	const decodeHTMLEntities = (text) => {
		const tempElement = document.createElement('textarea');
		tempElement.innerHTML = text;
		return tempElement.value;
	};

	const htmlToElem = (html) => wp.element.RawHTML({ children: html });

	return (
		<section
			{...useBlockProps.save()}
			data-wp-interactive="rtc-slideshow"
			data-wp-init="callbacks.initSlideshow"
			data-wp-context={JSON.stringify({
				activeSlide: 0,
				autoplay,
				delay: autoplayDelay,
				touchStart: null,
				timerRef: null,
			})}
			data-wp-watch="callbacks.watchSlideChange"
			data-wp-on-document--keydown="actions.handleKeyboardNav"
		>
			{Boolean(Array.isArray(posts) && posts.length) && (
				<div
					className="slideshow-container"
					data-wp-on--touchstart="actions.onTouchStart"
					data-wp-on--touchend="actions.onTouchEnd"
				>
					{posts.map((post, i) => {
						return (
							<div
								key={i}
								data-index={i}
								className={`slide${i === 0 ? ' slide-active' : ''}`}
							>
								<div className="image">
									{post.image && (
										<a
											href={post.link}
											target="_blank"
											rel="noreferrer"
										>
											<img
												src={post.image.src}
												alt={post.image.alt}
												className={`wp-image-${post.image.id}`}
												width={post.image.width}
												height={post.image.height}
											/>
										</a>
									)}
								</div>
								<div className="content">
									<h2>
										<a
											href={post.link}
											target="_blank"
											rel="noreferrer"
										>
											{decodeHTMLEntities(post.title)}
										</a>
									</h2>
									<p className="date">
										{date('F j, Y', post.date)}
									</p>
									{post.excerpt && (
										<div className="excerpt">
											{htmlToElem(
												post.excerpt.replace(
													' [&hellip;]',
													'...'
												)
											)}
										</div>
									)}
								</div>
							</div>
						);
					})}
					{showPagination && (
						<div className="pagination">
							<ul>
								{posts.map((post, i) => {
									return (
										<li key={i}>
											<button
												aria-label={`Go to Slide ${i + 1} of ${posts.length}`}
												className={`pagination-item${
													i === 0
														? ' pagination-active'
														: ''
												}`}
												data-index={i}
												data-wp-on--click="actions.goToSlide"
											>
												<span>
													{__(
														'Go to slide',
														'rtc-slideshow'
													)}{' '}
													{i + 1}
												</span>
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					)}
					{showNavigation && (
						<div className="navigation">
							<button
								className="next"
								aria-label={__('Next Slide', 'rtc-slideshow')}
								data-wp-on--click="actions.nextSlide"
							>
								<span>Next</span>
							</button>
							<button
								className="prev"
								aria-label={__(
									'Previous Slide',
									'rtc-slideshow'
								)}
								data-wp-on--click="actions.prevSlide"
							>
								<span>Previous</span>
							</button>
						</div>
					)}
				</div>
			)}
		</section>
	);
}
