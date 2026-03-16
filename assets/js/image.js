$(function(){
	// 이미지 슬라이드 시간
	const slidersTime = 5*1000;
	
	/* 이미지 슬라이드 시작 */
	const sliders = document.querySelectorAll('.image.main');

    sliders.forEach((slider) => {
        const images = Array.from(slider.getElementsByTagName('img'));
        const dotsContainer = slider.querySelector('.dots-container');
        
        if (images.length === 0) return;

        // [함수] 모든 이미지 중 가장 높은 값을 찾아 슬라이더 높이로 고정
        function fixMaxHeight() {
            let maxHeight = 0;
            images.forEach(img => {
                if (img.offsetHeight > maxHeight) {
                    maxHeight = img.offsetHeight;
                }
            });
            if (maxHeight > 0) {
                slider.style.height = maxHeight + 'px';
            }
        }

        // 초기화
        images[0].classList.add('active');

        if (images.length > 1) {
            let currentIndex = 0;
            let slideInterval;

            // 도트 생성
            images.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetTimer();
                });
                if (dotsContainer) dotsContainer.appendChild(dot);
            });

            const dots = slider.querySelectorAll('.dot');

            function goToSlide(index) {
                images.forEach(img => img.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));
                images[index].classList.add('active');
                dots[index].classList.add('active');
                currentIndex = index;
            }

            function startTimer() {
                slideInterval = setInterval(() => {
                    goToSlide((currentIndex + 1) % images.length);
                }, slidersTime);
            }

            function resetTimer() {
                clearInterval(slideInterval);
                startTimer();
            }

            // 이미지 로드 완료 시점들에 높이 계산 실행
            window.addEventListener('load', fixMaxHeight);
            window.addEventListener('resize', fixMaxHeight);
            
            // 이미 로드된 경우를 대비해 즉시 실행
            setTimeout(fixMaxHeight, 500); 

            startTimer();
        } else {
            // 이미지가 1개일 때도 높이는 잡아야 함
            window.addEventListener('load', fixMaxHeight);
        }
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
