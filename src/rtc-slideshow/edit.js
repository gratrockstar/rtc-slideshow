import { __ } from '@wordpress/i18n';
import { date } from '@wordpress/date';
import {
	TextControl,
	ToggleControl,
	Panel,
	PanelBody,
	PanelRow,
	Spinner,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect, useRef } from '@wordpress/element';
import './editor.scss';

export default function Edit({ setAttributes, attributes }) {
	// Destructure our block attributes.
	const { domain, showNavigation, showPagination, autoplay, autoplayDelay } =
		attributes;

	// Set up our variables.
	const [posts, setPosts] = useState([]);
	const [activeSlide, setActiveSlide] = useState(0);
	const [isAutoplaying, setIsAutoplaying] = useState(autoplay);
	const timerRef = useRef(null);

	const endpoint = `/rtcs/v1/slideshow?url=${encodeURIComponent(domain)}`;

	// Helper functions.
	const apiRequest = async () => {
		const response = await apiFetch({
			path: endpoint,
		});
		const fetchedPosts = await response;
		setPosts(fetchedPosts);
		setAttributes({ posts: formatPostsDataAttribute(fetchedPosts) });
	};

	const formatPostsDataAttribute = (fetchedPosts) => {
		if (fetchedPosts.error) {
			return fetchedPosts;
		}
		const formattedPosts = fetchedPosts?.map((post) => {
			return {
				title: post.title.rendered,
				date: post.date,
				excerpt: post.excerpt.rendered,
				link: post.link,
				image: {
					id: post._embedded['wp:featuredmedia'][0]?.id,
					src: post._embedded['wp:featuredmedia'][0]?.source_url,
					alt: post._embedded['wp:featuredmedia'][0].alt_text,
					height: post._embedded['wp:featuredmedia'][0]?.media_details
						?.width,
					width: post._embedded['wp:featuredmedia'][0]?.media_details
						?.height,
				},
			};
		});
		return formattedPosts;
	};

	const decodeHTMLEntities = (text) => {
		const tempElement = document.createElement('textarea');
		tempElement.innerHTML = text;
		return tempElement.value;
	};

	const disableAutoplay = () => {
		setIsAutoplaying(false);
	};

	const htmlToElem = (html) => wp.element.RawHTML({ children: html });

	// Callbacks.
	const onUrlChange = (newUrl) => {
		setAttributes({ domain: newUrl });
	};

	const onShowNavigationChange = (newShowNavigation) => {
		setAttributes({ showNavigation: newShowNavigation });
	};

	const onShowPaginationChange = (newShowPagination) => {
		setAttributes({ showPagination: newShowPagination });
	};

	const onAutoplayChange = (newAutoplay) => {
		setAttributes({ autoplay: newAutoplay });
		setIsAutoplaying(newAutoplay);
	};

	const onAutoplayDelayChange = (newAutoplayDelay) => {
		setAttributes({ autoplayDelay: newAutoplayDelay });
	};

	const onPrevSlideClick = () => {
		if (activeSlide > 0) {
			setActiveSlide(activeSlide - 1);
		} else {
			setActiveSlide(posts.length - 1);
		}

		// cancel autoplay
		if (isAutoplaying) {
			disableAutoplay();
		}
	};

	const onNextSlideClick = () => {
		if (activeSlide === posts.length - 1) {
			setActiveSlide(0);
		} else {
			setActiveSlide(activeSlide + 1);
		}

		// cancel autoplay
		if (isAutoplaying) {
			disableAutoplay();
		}
	};

	// Load the posts on load, or when domain changes.
	useEffect(() => {
		apiRequest();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domain]);

	// Hook up autoplay to a setInterval.
	useEffect(() => {
		if (isAutoplaying) {
			timerRef.current = setInterval(() => {
				setActiveSlide((prevSlide) =>
					prevSlide === posts.length - 1 ? 0 : prevSlide + 1
				);
			}, autoplayDelay);
		}

		return () => {
			clearInterval(timerRef.current);
		}; // clear interval when unmounting the component
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAutoplaying, autoplayDelay]);

	return (
		<>
			<InspectorControls>
				<Panel>
					<PanelBody title={__('Block Settings', 'rtc-slideshow')}>
						<PanelRow>
							<TextControl
								value={domain}
								label={__('URL', 'rtc-slideshow')}
								help={__(
									'Enter the URL here. It must be the root of the site where the WP Rest API is available, with no trailing slash.',
									'rtc-slideshow'
								)}
								onChange={onUrlChange}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Show Navigation?', 'rtc-slideshow')}
								help={__(
									'Should this slideshow display the next and previous buttons?',
									'rtc-slideshow'
								)}
								checked={showNavigation}
								onChange={onShowNavigationChange}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Show Pagination?', 'rtc-slideshow')}
								help={__(
									'Should this slideshow display pagination buttons?',
									'rtc-slideshow'
								)}
								checked={showPagination}
								onChange={onShowPaginationChange}
							/>
						</PanelRow>
						<PanelRow>
							<ToggleControl
								label={__('Autoplay?', 'rtc-slideshow')}
								help={__(
									'Should this slideshow autoplay?',
									'rtc-slideshow'
								)}
								checked={autoplay}
								onChange={onAutoplayChange}
							/>
						</PanelRow>
						{autoplay && (
							<PanelRow>
								<NumberControl
									label={__(
										'Autoplay Delay',
										'rtc-slideshow'
									)}
									help={__(
										'Enter the time between slides in milliseconds.',
										'rtc-slideshow'
									)}
									value={autoplayDelay}
									onChange={onAutoplayDelayChange}
								/>
							</PanelRow>
						)}
					</PanelBody>
				</Panel>
			</InspectorControls>
			<div {...useBlockProps()}>
				{!posts.length && !posts.error && <Spinner />}
				{posts.error && (
					<div>
						{__(
							'The URL is not valid, please try again.',
							'rtc-slideshow'
						)}
					</div>
				)}
				{Boolean(Array.isArray(posts) && posts.length) && (
					<div className="slideshow-container">
						{posts.map((post, i) => {
							return (
								<div
									key={i}
									className={`slide${activeSlide === i ? ' slide-active' : ''}`}
								>
									<div className="image">
										{post?._embedded[
											'wp:featuredmedia'
										][0] && (
											<img
												src={
													post._embedded[
														'wp:featuredmedia'
													][0].source_url
												}
												alt={
													post._embedded[
														'wp:featuredmedia'
													][0].alt_text
												}
												className={`wp-image-${post._embedded['wp:featuredmedia'][0].id}`}
												width={
													post._embedded[
														'wp:featuredmedia'
													][0].media_details.width
												}
												height={
													post._embedded[
														'wp:featuredmedia'
													][0].media_details.height
												}
											/>
										)}
									</div>
									<div className="content">
										<h2>
											<a
												href={post.link}
												target="_blank"
												rel="noreferrer"
											>
												{decodeHTMLEntities(
													post.title.rendered
												)}
											</a>
										</h2>
										<p className="date">
											{date('F j, Y', post.date)}
										</p>
										{post.excerpt?.rendered && (
											<div className="excerpt">
												{htmlToElem(
													post.excerpt.rendered.replace(
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
													onClick={() => {
														setActiveSlide(i);
														// cancel autoplay
														if (isAutoplaying) {
															disableAutoplay();
														}
													}}
													className={
														i === activeSlide
															? 'pagination-active'
															: ''
													}
													aria-label={`Go to Slide ${i + 1} of ${posts.length}`}
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
									aria-label={__(
										'Next Slide',
										'rtc-slideshow'
									)}
									onClick={() => onNextSlideClick(true)}
								>
									<span>Next</span>
								</button>
								<button
									className="prev"
									aria-label={__(
										'Previous Slide',
										'rtc-slideshow'
									)}
									onClick={onPrevSlideClick}
								>
									<span>Previous</span>
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
