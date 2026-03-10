/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				// Article visible? Hide.
					if ($body.hasClass('is-article-visible'))
						$main._hide(true);

			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});

			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}

				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
					
		/* 이미지 슬라이드 */
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
	                }, 3000);
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
		/* 이미지 팝업 */
		const popup = document.getElementById('image-popup');
	    const popupContainer = document.getElementById('popup-image-container');
	    const closeBtn = document.querySelector('.close-popup');
	
	    // 1. 슬라이더 이미지 클릭 시 모달 열기
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
})(jQuery);

function showPic( el )
{
	var src = el.getAttribute('src');
};