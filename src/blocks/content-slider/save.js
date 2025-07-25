/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';

/**
 * Save component for Content Slider block
 */
export default function Save({ attributes }) {
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

    const blockProps = useBlockProps.save({
        className: 'pbs-content-slider',
        'data-auto-play': autoPlay,
        'data-auto-play-delay': autoPlayDelay,
        'data-pause-on-hover': pauseOnHover,
        'data-infinite-loop': infiniteLoop,
        'data-transition-effect': transitionEffect,
        'data-transition-duration': transitionDuration,
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

    return (
        <div {...blockProps}>
            <div className="pbs-slider-container">
                <div className="pbs-slider-wrapper">
                    <div className="pbs-slides">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`pbs-slide ${index === 0 ? 'active' : ''}`}
                                style={{
                                    backgroundColor: slide.backgroundColor,
                                    backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    textAlign: contentAlignment,
                                }}
                            >
                                <div className="pbs-slide-content">
                                    <RichText.Content
                                        tagName="h3"
                                        className="pbs-slide-title"
                                        value={slide.title}
                                    />
                                    <RichText.Content
                                        tagName="p"
                                        className="pbs-slide-text"
                                        value={slide.content}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {showArrows && (
                        <>
                            <button className="pbs-slider-arrow pbs-slider-prev">
                                <Dashicon icon="arrow-left-alt2" />
                            </button>
                            <button className="pbs-slider-arrow pbs-slider-next">
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
                                className={`pbs-slider-dot ${index === 0 ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

