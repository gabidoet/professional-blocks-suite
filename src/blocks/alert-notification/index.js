import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';
import save from './save';
import metadata from '../../../blocks/' + 'alert-notification' + '/block.json';

registerBlockType(metadata.name, {
    ...metadata,
    edit,
    save,
});
