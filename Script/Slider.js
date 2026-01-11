document.addEventListener("DOMContentLoaded", function () {

    const heroSliderModule = () => {
        const heroSection = document.querySelector('.hero-slider');
        if (!heroSection) return;

        const sliderContainer = heroSection.querySelector('.slider-container');
        const slides = heroSection.querySelectorAll('.slide');
        const prevBtn = heroSection.querySelector('.prev-btn');
        const nextBtn = heroSection.querySelector('.next-btn');
        const dotsContainer = heroSection.querySelector('.slider-dots');

        if (!sliderContainer || slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval;
        const autoPlayTime = 7000;

        if (dotsContainer) dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetTimer();
            });
            if (dotsContainer) dotsContainer.appendChild(dot);
        });

        const dots = heroSection.querySelectorAll('.dot');

        const goToSlide = (n) => {
            if (n >= slides.length) currentSlide = 0;
            else if (n < 0) currentSlide = slides.length - 1;
            else currentSlide = n;

            sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => goToSlide(currentSlide + 1);
        const prevSlide = () => goToSlide(currentSlide - 1);

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextSlide();
                resetTimer();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevSlide();
                resetTimer();
            });
        }

        const startTimer = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, autoPlayTime);
        };
        const stopTimer = () => clearInterval(slideInterval);
        const resetTimer = () => { stopTimer(); startTimer(); };

        startTimer();

        let startX = 0;
        let isDragging = false;
        const handleStart = (x) => { isDragging = true; startX = x; stopTimer(); };
        const handleEnd = (x) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - x;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide(); else prevSlide();
            }
            startTimer();
        };

        sliderContainer.addEventListener('touchstart', (e) => handleStart(e.touches[0].pageX), {passive: true});
        sliderContainer.addEventListener('touchend', (e) => handleEnd(e.changedTouches[0].pageX));
        sliderContainer.addEventListener('mousedown', (e) => { e.preventDefault(); handleStart(e.pageX); });
        sliderContainer.addEventListener('mouseup', (e) => handleEnd(e.pageX));

        heroSection.addEventListener('wheel', (e) => {
            stopTimer();
            setTimeout(startTimer, 2000);
        }, {passive: true});
    };

    const newsScrollerModule = () => {
        const scrollerContainer = document.querySelector('.scroller-container');
        if (!scrollerContainer) return;

        const scrollAmount = 300;
        const autoPlayTime = 6000;
        let scrollerTimer;
        let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        const startScrollerTimer = () => {
            clearInterval(scrollerTimer);
            scrollerTimer = setInterval(() => {
                if (scrollerContainer.classList.contains('active')) return;

                targetScroll = scrollerContainer.scrollLeft;

                const maxScroll = scrollerContainer.scrollWidth - scrollerContainer.clientWidth;
                if (scrollerContainer.scrollLeft >= maxScroll - 5) {
                    scrollerContainer.scrollTo({ left: 0, behavior: 'smooth' });
                    targetScroll = 0;
                } else {
                    scrollerContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    targetScroll += scrollAmount;
                }
            }, autoPlayTime);
        };

        const stopScrollerTimer = () => clearInterval(scrollerTimer);
        startScrollerTimer();

        scrollerContainer.addEventListener('touchstart', () => {
            stopScrollerTimer();
            scrollerContainer.classList.add('active');
        }, {passive: true});

        scrollerContainer.addEventListener('touchend', () => {
            scrollerContainer.classList.remove('active');
            targetScroll = scrollerContainer.scrollLeft;
            setTimeout(startScrollerTimer, 2000);
        });

        const lerpFactor = 1;

        let currentScroll = scrollerContainer.scrollLeft;
        let targetScroll = scrollerContainer.scrollLeft;
        let isAnimating = false;

        const smoothLoop = () => {
            if (!isAnimating) return;

            currentScroll += (targetScroll - currentScroll) * lerpFactor;
            scrollerContainer.scrollLeft = currentScroll;

            if (Math.abs(targetScroll - currentScroll) > 0.5) {
                requestAnimationFrame(smoothLoop);
            } else {
                isAnimating = false;
                scrollerContainer.scrollLeft = targetScroll;
            }
        };

        if (!isTouchDevice) {
            let isDown = false;
            let startX;
            let startScrollLeft;

            scrollerContainer.addEventListener('mousedown', (e) => {
                isDown = true;
                stopScrollerTimer();
                scrollerContainer.classList.add('active');
                startX = e.pageX - scrollerContainer.offsetLeft;
                startScrollLeft = scrollerContainer.scrollLeft;

                targetScroll = scrollerContainer.scrollLeft;
                currentScroll = scrollerContainer.scrollLeft;
                isAnimating = false;

                scrollerContainer.style.cursor = 'grabbing';
            });

            const stopDrag = () => {
                isDown = false;
                scrollerContainer.classList.remove('active');
                scrollerContainer.style.cursor = 'grab';
                targetScroll = scrollerContainer.scrollLeft;
                currentScroll = scrollerContainer.scrollLeft;
                startScrollerTimer();
            };

            scrollerContainer.addEventListener('mouseleave', stopDrag);
            scrollerContainer.addEventListener('mouseup', stopDrag);

            scrollerContainer.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - scrollerContainer.offsetLeft;
                const walk = (x - startX) * 2;
                scrollerContainer.scrollLeft = startScrollLeft - walk;
            });

            scrollerContainer.addEventListener('wheel', (evt) => {
                if (window.matchMedia("(hover: hover)").matches) {
                    evt.preventDefault();
                    stopScrollerTimer();

                    if (!isAnimating) currentScroll = scrollerContainer.scrollLeft;

                    const maxScroll = scrollerContainer.scrollWidth - scrollerContainer.clientWidth;
                    const delta = evt.deltaY * 4.0;
                    targetScroll += delta;

                    targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

                    if (!isAnimating) {
                        isAnimating = true;
                        requestAnimationFrame(smoothLoop);
                    }

                    clearTimeout(window.scrollTimeout);
                    window.scrollTimeout = setTimeout(startScrollerTimer, 2000);
                }
            }, {passive: false});
        }
    };

    heroSliderModule();
    newsScrollerModule();
});