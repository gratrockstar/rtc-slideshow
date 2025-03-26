import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
registerBlockType(metadata.name, {
	// eslint-disable-next-line @wordpress/i18n-text-domain
	title: __('RTC Slideshow', metadata.textdomain),
	// eslint-disable-next-line @wordpress/i18n-text-domain
	description: __(
		'A slideshow built from an external API call.',
		metadata.textdomain
	),
	icon: 'images-alt',
	supports: {
		html: false,
		interactivity: true,
		reusable: false,
		align: ['wide', 'full'],
	},
	attributes: {
		align: {
			type: 'string',
			default: 'full',
		},
		domain: {
			type: 'string',
			default: 'https://wptavern.com',
		},
		showNavigation: {
			type: 'boolean',
			default: true,
		},
		showPagination: {
			type: 'boolean',
			default: true,
		},
		autoplay: {
			type: 'boolean',
			default: false,
		},
		autoplayDelay: {
			type: 'number',
			default: 2000,
		},
		posts: {
			type: 'object',
		},
	},
	/**
	 * @see ./edit.js
	 */
	edit: Edit,

	/**
	 * @see ./save.js
	 */
	save,
});
