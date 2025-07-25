import { __ } from '@wordpress/i18n';
import { RichText, useBlockProps } from '@wordpress/block-editor';

export default function Edit({ attributes, setAttributes }) {
    const { content } = attributes;
    const blockProps = useBlockProps();

    return (
        <div {...blockProps}>
            <RichText
                tagName="p"
                value={content}
                onChange={(value) => setAttributes({ content: value })}
                placeholder={__('Enter content...', 'professional-blocks-suite')}
            />
        </div>
    );
}
