/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from '../../../blocks/content-slider/block.json';

/**
 * Register the Content Slider block
 */
registerBlockType(metadata.name, {
    ...metadata,
    edit,
    save,
});

