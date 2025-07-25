import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from '../../../blocks/' + 'professional-button' + '/block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit,
    save,
});
