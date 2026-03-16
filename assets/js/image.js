$(function(){
	const slidersTime = 4*1000;

    // [함수] 슬라이더 초기화 및 높이 재계산 로직
    function initSlider($targetSection) {
        const sectionSliders = $targetSection.find('.image.main');

        sectionSliders.each(function() {
            const slider = this;
            const $images = $(slider).find('img');
            const $dotsContainer = $(slider).find('.dots-container');

            if ($images.length === 0) return;

            // 높이 계산 함수
            const fixMaxHeight = () => {
                let maxHeight = 0;
                $images.each(function() {
                    // 팝업 내부에서 이미지가 로드된 후의 높이 측정
                    if (this.offsetHeight > maxHeight) maxHeight = this.offsetHeight;
                });
                if (maxHeight > 0) $(slider).css('height', maxHeight + 'px');
            };

            // 처음 열리는 경우에만 기본 설정 실행
            if (!$targetSection.data('slider-initialized')) {
                $images.eq(0).addClass('active');

                if ($images.length > 1) {
                    let currentIndex = 0;
                    let slideInterval;

                    // 도트 생성
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

            // 팝업이 열리는 애니메이션 시간을 고려하여 높이 재계산
            // 0.4~0.5초 정도 뒤에 계산해야 팝업이 다 열린 상태의 높이를 잡습니다.
            setTimeout(fixMaxHeight, 450);
        });
    }

    // --- 이벤트 바인딩 ---

    // 1. 섹션 링크 클릭 시 팝업 오픈 및 슬라이더 계산
    $('a[href^="#section-"]').on('click', function(e) {
        const targetId = $(this).attr('href');
        const $targetSection = $(targetId);

        // 여기서 팝업을 여는 코드 (이미 작성하신 팝업 로직 호출)
        // 예: $targetSection.fadeIn(); 또는 popup.style.display = 'block';

        // 슬라이더 초기화 및 재계산 함수 호출
        initSlider($targetSection);
    });

    // 2. 윈도우 리사이즈 시 모든 활성화된 슬라이더 높이 재조정
    $(window).on('resize', function() {
        $('[data-slider-initialized="true"]').each(function() {
            initSlider($(this));
        });
    });
	/* 이미지 슬라이드 종료 */	
	/* 이미지 팝업 시작*/
	const popup = document.getElementById('image-popup');
    const popupContainer = document.getElementById('popup-image-container');
    const closeBtn = document.querySelector('.close-popup');

    document.querySelectorAll('.image.main img').forEach(img => {
        img.addEventListener('click', function(e) {
			e.stopPropagation(); 
		
		    const parentSlider = this.closest('.image.main');
		    const siblingImages = Array.from(parentSlider.querySelectorAll('img'));
		    const clickedSrc = this.src; // 클릭한 이미지의 경로 저장
		
		    popupContainer.innerHTML = '';
		
		    siblingImages.forEach(srcImg => {
		        const newImg = document.createElement('img');
		        newImg.src = srcImg.src;
		        // 클릭한 이미지와 같은 경로라면 ID를 부여해서 나중에 스크롤 이동
		        if(srcImg.src === clickedSrc) {
		            newImg.id = "target-focus";
		        }
		        popupContainer.appendChild(newImg);
		    });
		
		    popup.style.display = 'block';
		
		    // 팝업이 뜨고 나서 클릭했던 이미지가 바로 보이도록 스크롤 이동
		    const target = document.getElementById('target-focus');
		    if(target) {
		        target.scrollIntoView();
		    } 
        });
    });

    // 2. 닫기 버튼 클릭 시 (여기서 stopPropagation이 핵심!)
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // 클릭 이벤트가 기존 팝업으로 전달되는 것을 막음
        
        popup.style.display = 'none';
        
        // 기존 팝업의 스크롤 상태를 유지하기 위해 overflow 설정은 건드리지 않거나 
        // 기존 환경에 맞춰 조절하세요.
    });

    // 3. 검은 배경 클릭 시 닫기
    popup.addEventListener('click', function(e) {
        // 클릭한 대상이 정확히 배경(overlay)일 때만 닫기
        if (e.target === popup || e.target.classList.contains('popup-content')) {
            e.stopPropagation();
            popup.style.display = 'none';
        }
    });

    // 4. 모달 안쪽(article) 클릭 시에는 닫히지 않도록 보호
    document.getElementById('popup-article').addEventListener('click', function(e) {
        e.stopPropagation();
    });	
	/* 이미지 팝업 종료 */	
});
