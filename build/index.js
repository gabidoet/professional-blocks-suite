/**
 * Professional Blocks Suite - Compiled JavaScript
 * 
 * This file contains the compiled JavaScript for all blocks
 */

(function() {
    'use strict';
    
    // Debug: Check if WordPress block editor is available
    if (typeof wp === 'undefined' || typeof wp.blocks === 'undefined') {
        console.error('PBS: WordPress block editor not available');
        return;
    }
    
    console.log('PBS: Starting block registration...');
    
    const { registerBlockType } = wp.blocks;
    const { RichText, useBlockProps, InspectorControls, MediaUpload, ColorPicker } = wp.blockEditor;
    const { PanelBody, Button } = wp.components;
    const { __ } = wp.i18n;
    const { createElement: el, Fragment } = wp.element;

    // Hero Banner Block
    console.log('PBS: Registering Hero Banner block...');
    registerBlockType('pbs/hero-banner', {
        apiVersion: 3,
        title: '*Hero Banner',
        icon: 'format-image',
        category: 'custom-blocks',
        attributes: {
            title: {
                type: 'string',
                default: 'Hero Title'
            },
            subtitle: {
                type: 'string',
                default: 'Hero subtitle text'
            },
            backgroundImage: {
                type: 'string',
                default: ''
            },
            backgroundColor: {
                type: 'string',
                default: '#007cba'
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { title, subtitle, backgroundImage, backgroundColor } = attributes;
            
            const blockProps = useBlockProps({
                className: 'pbs-hero-banner',
                style: {
                    backgroundColor: backgroundColor,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#ffffff',
                    position: 'relative'
                }
            });

            return el(Fragment, null,
                el(InspectorControls, null,
                    el(PanelBody, { title: __('Hero Settings'), initialOpen: true },
                        el(MediaUpload, {
                            onSelect: function(media) { setAttributes({ backgroundImage: media.url }); },
                            allowedTypes: ['image'],
                            render: function(obj) {
                                return el(Button, {
                                    onClick: obj.open,
                                    isPrimary: true
                                }, backgroundImage ? __('Change Background') : __('Set Background'));
                            }
                        }),
                        el('div', { style: { marginTop: '15px' } },
                            el('label', null, __('Background Color')),
                            el(ColorPicker, {
                                color: backgroundColor,
                                onChange: function(color) { setAttributes({ backgroundColor: color }); }
                            })
                        )
                    )
                ),
                el('div', blockProps,
                    el('div', {
                        style: {
                            position: 'relative',
                            zIndex: 2,
                            padding: '40px 20px',
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '8px'
                        }
                    },
                        el(RichText, {
                            tagName: 'h1',
                            value: title,
                            onChange: function(value) { setAttributes({ title: value }); },
                            placeholder: __('Enter hero title...'),
                            style: {
                                fontSize: '3rem',
                                fontWeight: 'bold',
                                margin: '0 0 20px 0',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }
                        }),
                        el(RichText, {
                            tagName: 'p',
                            value: subtitle,
                            onChange: function(value) { setAttributes({ subtitle: value }); },
                            placeholder: __('Enter hero subtitle...'),
                            style: {
                                fontSize: '1.2rem',
                                margin: '0',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }
                        })
                    )
                )
            );
        },
        save: function(props) {
            const { attributes } = props;
            const { title, subtitle, backgroundImage, backgroundColor } = attributes;
            
            const blockProps = useBlockProps.save({
                className: 'pbs-hero-banner',
                style: {
                    backgroundColor: backgroundColor,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: '#ffffff',
                    position: 'relative'
                }
            });

            return el('div', blockProps,
                el('div', {
                    style: {
                        position: 'relative',
                        zIndex: 2,
                        padding: '40px 20px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px'
                    }
                },
                    el(RichText.Content, {
                        tagName: 'h1',
                        value: title,
                        style: {
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            margin: '0 0 20px 0',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                        }
                    }),
                    el(RichText.Content, {
                        tagName: 'p',
                        value: subtitle,
                        style: {
                            fontSize: '1.2rem',
                            margin: '0',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }
                    })
                )
            );
        }
    });

    // Simple Testimonial Block
    console.log('PBS: Registering Testimonial block...');
    registerBlockType('pbs/testimonial', {
        apiVersion: 3,
        title: '*Testimonial',
        icon: 'format-quote',
        category: 'custom-blocks',
        attributes: {
            content: {
                type: 'string',
                default: 'Testimonial content'
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            return el('div', blockProps,
                el(RichText, {
                    tagName: 'blockquote',
                    value: attributes.content,
                    onChange: function(content) { setAttributes({ content }); },
                    placeholder: __('Enter testimonial...'),
                    style: { fontStyle: 'italic', fontSize: '1.2rem' }
                })
            );
        },
        save: function(props) {
            const blockProps = useBlockProps.save();
            return el('div', blockProps,
                el(RichText.Content, {
                    tagName: 'blockquote',
                    value: props.attributes.content,
                    style: { fontStyle: 'italic', fontSize: '1.2rem' }
                })
            );
        }
    });

    // Simple Call to Action Block
    registerBlockType('pbs/call-to-action', {
        apiVersion: 3,
        title: '*Call to Action',
        icon: 'megaphone',
        category: 'custom-blocks',
        attributes: {
            content: {
                type: 'string',
                default: 'Call to action content'
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            return el('div', blockProps,
                el(RichText, {
                    tagName: 'div',
                    value: attributes.content,
                    onChange: function(content) { setAttributes({ content }); },
                    placeholder: __('Enter call to action...'),
                    style: { textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }
                })
            );
        },
        save: function(props) {
            const blockProps = useBlockProps.save();
            return el('div', blockProps,
                el(RichText.Content, {
                    tagName: 'div',
                    value: props.attributes.content,
                    style: { textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0' }
                })
            );
        }
    });

    // Simple Feature Box Block
    registerBlockType('pbs/feature-box', {
        apiVersion: 3,
        title: '*Feature Box',
        icon: 'star-filled',
        category: 'custom-blocks',
        attributes: {
            content: {
                type: 'string',
                default: 'Feature content'
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            return el('div', blockProps,
                el(RichText, {
                    tagName: 'div',
                    value: attributes.content,
                    onChange: function(content) { setAttributes({ content }); },
                    placeholder: __('Enter feature content...'),
                    style: { border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }
                })
            );
        },
        save: function(props) {
            const blockProps = useBlockProps.save();
            return el('div', blockProps,
                el(RichText.Content, {
                    tagName: 'div',
                    value: props.attributes.content,
                    style: { border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }
                })
            );
        }
    });

    // Simple Content Slider Block
    registerBlockType('pbs/content-slider', {
        apiVersion: 3,
        title: '*Content Slider',
        icon: 'slides',
        category: 'custom-blocks',
        attributes: {
            content: {
                type: 'string',
                default: 'Slider content'
            }
        },
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const blockProps = useBlockProps();
            
            return el('div', blockProps,
                el(RichText, {
                    tagName: 'div',
                    value: attributes.content,
                    onChange: function(content) { setAttributes({ content }); },
                    placeholder: __('Enter slider content...'),
                    style: { border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }
                })
            );
        },
        save: function(props) {
            const blockProps = useBlockProps.save();
            return el('div', blockProps,
                el(RichText.Content, {
                    tagName: 'div',
                    value: props.attributes.content,
                    style: { border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }
                })
            );
        }
    });

    console.log('PBS: All blocks registered successfully!');

})();
