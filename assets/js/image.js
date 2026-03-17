$(function() {
    const slidersTime = 4 * 1000;

    function initSlider($targetSection) {
        const sectionSliders = $targetSection.find('.image.main');

        sectionSliders.each(function() {
            const slider = this;
            const $images = $(slider).find('img');
            const $dotsContainer = $(slider).find('.dots-container');

            if ($images.length === 0) return;

            const fixMaxHeight = () => {
                let maxHeight = 0;
                $images.each(function() {
                    if (this.offsetHeight > maxHeight) maxHeight = this.offsetHeight;
                });
                if (maxHeight > 0) $(slider).css('height', maxHeight + 'px');
            };

            const updateInfo = ($currentImg) => {
                const fullSrc = $currentImg.attr('src');
                const fileName = fullSrc.split('/').pop().split('.').shift();
                const targetInfoId = '#' + fileName + '-info';

                $targetSection.find('.section-info').stop(true, true).hide();
                
                $(targetInfoId).fadeIn(600);
            };

            if (!$targetSection.data('slider-initialized')) {
                $images.eq(0).addClass('active');
                
                if ($images.length > 1) {
                    let currentIndex = 0;
                    let slideInterval;

                    $dotsContainer.empty();
                    $images.each((index) => {
                        const $dot = $('<span class="dot"></span>');
                        if (index === 0) $dot.addClass('active');
                        $dot.on('click', (e) => {
                            e.stopPropagation();
                            goToSlide(index);
                            resetTimer();
                        });
                        $dotsContainer.append($dot);
                    });

                    const $dots = $(slider).find('.dot');

                    const goToSlide = (index) => {
                        $images.removeClass('active').eq(index).addClass('active');
                        $dots.removeClass('active').eq(index).addClass('active');
                        currentIndex = index;
                        updateInfo($images.eq(index));
                    };

                    const startTimer = () => {
                        slideInterval = setInterval(() => {
                            goToSlide((currentIndex + 1) % $images.length);
                        }, slidersTime);
                    };

                    const resetTimer = () => {
                        clearInterval(slideInterval);
                        startTimer();
                    };

                    startTimer();
                }
                $targetSection.data('slider-initialized', true);
            }

            const $activeImg = $(slider).find('img.active');
            updateInfo($activeImg);

            setTimeout(fixMaxHeight, 450);
        });
    }

    $('a[href^="#section-"]').on('click', function(e) {
        const targetId = $(this).attr('href');
        const $targetSection = $(targetId);
        initSlider($targetSection);
    });

    $(window).on('resize', function() {
        $('[data-slider-initialized="true"]').each(function() {
            initSlider($(this));
        });
    });
});