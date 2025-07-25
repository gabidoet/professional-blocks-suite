/**
 * Content Slider Frontend JavaScript
 * 
 * Handles slider functionality on the frontend
 */

document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.pbs-content-slider');
    
    sliders.forEach(slider => {
        initSlider(slider);
    });
});

function initSlider(sliderElement) {
    const slides = sliderElement.querySelectorAll('.pbs-slide');
    const prevButton = sliderElement.querySelector('.pbs-slider-prev');
    const nextButton = sliderElement.querySelector('.pbs-slider-next');
    const dots = sliderElement.querySelectorAll('.pbs-slider-dot');
    
    let currentSlide = 0;
    let autoPlayInterval = null;
    
    // Get settings from data attributes
    const autoPlay = sliderElement.dataset.autoPlay === 'true';
    const autoPlayDelay = parseInt(sliderElement.dataset.autoPlayDelay) || 5000;
    const pauseOnHover = sliderElement.dataset.pauseOnHover === 'true';
    const infiniteLoop = sliderElement.dataset.infiniteLoop === 'true';
    const transitionEffect = sliderElement.dataset.transitionEffect || 'slide';
    const transitionDuration = parseInt(sliderElement.dataset.transitionDuration) || 500;
    
    // Initialize slider
    showSlide(currentSlide);
    
    // Auto-play functionality
    if (autoPlay) {
        startAutoPlay();
        
        if (pauseOnHover) {
            sliderElement.addEventListener('mouseenter', stopAutoPlay);
            sliderElement.addEventListener('mouseleave', startAutoPlay);
        }
    }
    
    // Navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToPrevSlide();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToNextSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Keyboard navigation
    sliderElement.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPrevSlide();
        } else if (e.key === 'ArrowRight') {
            goToNextSlide();
        }
    });
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
            slides[index].style.display = 'flex';
        }
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentSlide = index;
    }
    
    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            showSlide(index);
        }
    }
    
    function goToNextSlide() {
        let nextIndex = currentSlide + 1;
        
        if (nextIndex >= slides.length) {
            nextIndex = infiniteLoop ? 0 : slides.length - 1;
        }
        
        goToSlide(nextIndex);
    }
    
    function goToPrevSlide() {
        let prevIndex = currentSlide - 1;
        
        if (prevIndex < 0) {
            prevIndex = infiniteLoop ? slides.length - 1 : 0;
        }
        
        goToSlide(prevIndex);
    }
    
    function startAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
        
        autoPlayInterval = setInterval(() => {
            goToNextSlide();
        }, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
}

