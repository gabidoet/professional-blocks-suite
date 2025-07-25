/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
    InspectorControls,
    RichText,
    MediaUpload,
    ColorPicker,
    useBlockProps,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    ToggleControl,
    RangeControl,
    SelectControl,
    Dashicon,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Edit component for Content Slider block
 */
export default function Edit({ attributes, setAttributes }) {
    const {
        slides,
        showArrows,
        showDots,
        autoPlay,
        autoPlayDelay,
        pauseOnHover,
        infiniteLoop,
        transitionEffect,
        transitionDuration,
        sliderHeight,
        arrowColor,
        arrowBackgroundColor,
        arrowSize,
        dotColor,
        dotActiveColor,
        dotSize,
        contentAlignment,
    } = attributes;

    const [currentSlide, setCurrentSlide] = useState(0);

    const blockProps = useBlockProps({
        className: 'pbs-content-slider',
        style: {
            '--slider-height': `${sliderHeight}px`,
            '--arrow-color': arrowColor,
            '--arrow-bg-color': arrowBackgroundColor,
            '--arrow-size': `${arrowSize}px`,
            '--dot-color': dotColor,
            '--dot-active-color': dotActiveColor,
            '--dot-size': `${dotSize}px`,
        },
    });

    const addSlide = () => {
        const newSlide = {
            id: Date.now(),
            title: `Slide ${slides.length + 1}`,
            content: 'New slide content.',
            backgroundImage: '',
            backgroundColor: '#f8f9fa',
        };
        setAttributes({ slides: [...slides, newSlide] });
    };

    const removeSlide = (slideIndex) => {
        if (slides.length > 1) {
            const newSlides = slides.filter((_, index) => index !== slideIndex);
            setAttributes({ slides: newSlides });
            if (currentSlide >= newSlides.length) {
                setCurrentSlide(newSlides.length - 1);
            }
        }
    };

    const updateSlide = (slideIndex, property, value) => {
        const newSlides = [...slides];
        newSlides[slideIndex] = { ...newSlides[slideIndex], [property]: value };
        setAttributes({ slides: newSlides });
    };

    const goToSlide = (slideIndex) => {
        setCurrentSlide(slideIndex);
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Slider Settings', 'professional-blocks-suite')} initialOpen={true}>
                    <ToggleControl
                        label={__('Show Navigation Arrows', 'professional-blocks-suite')}
                        checked={showArrows}
                        onChange={(value) => setAttributes({ showArrows: value })}
                    />
                    <ToggleControl
                        label={__('Show Dots Navigation', 'professional-blocks-suite')}
                        checked={showDots}
                        onChange={(value) => setAttributes({ showDots: value })}
                    />
                    <ToggleControl
                        label={__('Auto Play', 'professional-blocks-suite')}
                        checked={autoPlay}
                        onChange={(value) => setAttributes({ autoPlay: value })}
                    />
                    {autoPlay && (
                        <>
                            <RangeControl
                                label={__('Auto Play Delay (ms)', 'professional-blocks-suite')}
                                value={autoPlayDelay}
                                onChange={(value) => setAttributes({ autoPlayDelay: value })}
                                min={1000}
                                max={10000}
                                step={500}
                            />
                            <ToggleControl
                                label={__('Pause on Hover', 'professional-blocks-suite')}
                                checked={pauseOnHover}
                                onChange={(value) => setAttributes({ pauseOnHover: value })}
                            />
                        </>
                    )}
                    <ToggleControl
                        label={__('Infinite Loop', 'professional-blocks-suite')}
                        checked={infiniteLoop}
                        onChange={(value) => setAttributes({ infiniteLoop: value })}
                    />
                    <SelectControl
                        label={__('Transition Effect', 'professional-blocks-suite')}
                        value={transitionEffect}
                        options={[
                            { label: __('Slide', 'professional-blocks-suite'), value: 'slide' },
                            { label: __('Fade', 'professional-blocks-suite'), value: 'fade' },
                        ]}
                        onChange={(value) => setAttributes({ transitionEffect: value })}
                    />
                    <RangeControl
                        label={__('Slider Height (px)', 'professional-blocks-suite')}
                        value={sliderHeight}
                        onChange={(value) => setAttributes({ sliderHeight: value })}
                        min={200}
                        max={800}
                        step={10}
                    />
                </PanelBody>

                <PanelBody title={__('Slide Management', 'professional-blocks-suite')} initialOpen={false}>
                    <Button
                        isPrimary
                        onClick={addSlide}
                        style={{ marginBottom: '10px' }}
                    >
                        {__('Add New Slide', 'professional-blocks-suite')}
                    </Button>
                    <p>{__('Current Slides:', 'professional-blocks-suite')} {slides.length}</p>
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <div className="pbs-slider-container">
                    <div className="pbs-slider-wrapper">
                        <div className="pbs-slides">
                            {slides.map((slide, index) => (
                                <div
                                    key={slide.id}
                                    className={`pbs-slide ${index === currentSlide ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: slide.backgroundColor,
                                        backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        textAlign: contentAlignment,
                                        display: index === currentSlide ? 'flex' : 'none',
                                    }}
                                >
                                    <div className="pbs-slide-content">
                                        <RichText
                                            tagName="h3"
                                            className="pbs-slide-title"
                                            value={slide.title}
                                            onChange={(value) => updateSlide(index, 'title', value)}
                                            placeholder={__('Slide title...', 'professional-blocks-suite')}
                                        />
                                        <RichText
                                            tagName="p"
                                            className="pbs-slide-text"
                                            value={slide.content}
                                            onChange={(value) => updateSlide(index, 'content', value)}
                                            placeholder={__('Slide content...', 'professional-blocks-suite')}
                                        />
                                        <div style={{ marginTop: '15px' }}>
                                            <MediaUpload
                                                onSelect={(media) => updateSlide(index, 'backgroundImage', media.url)}
                                                allowedTypes={['image']}
                                                render={({ open }) => (
                                                    <Button onClick={open} isSecondary>
                                                        {slide.backgroundImage ? __('Change Background', 'professional-blocks-suite') : __('Set Background', 'professional-blocks-suite')}
                                                    </Button>
                                                )}
                                            />
                                            {slides.length > 1 && (
                                                <Button
                                                    onClick={() => removeSlide(index)}
                                                    isDestructive
                                                    isSmall
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    {__('Remove Slide', 'professional-blocks-suite')}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {showArrows && (
                            <>
                                <button
                                    className="pbs-slider-arrow pbs-slider-prev"
                                    onClick={() => goToSlide(currentSlide > 0 ? currentSlide - 1 : slides.length - 1)}
                                >
                                    <Dashicon icon="arrow-left-alt2" />
                                </button>
                                <button
                                    className="pbs-slider-arrow pbs-slider-next"
                                    onClick={() => goToSlide(currentSlide < slides.length - 1 ? currentSlide + 1 : 0)}
                                >
                                    <Dashicon icon="arrow-right-alt2" />
                                </button>
                            </>
                        )}
                    </div>

                    {showDots && (
                        <div className="pbs-slider-dots">
                            {slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`pbs-slider-dot ${index === currentSlide ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

