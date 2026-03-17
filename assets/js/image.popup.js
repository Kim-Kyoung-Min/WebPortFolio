$(function(){
	/* 이미지 팝업 시작 */
	const popup = document.getElementById('image-popup');
	const popupContainer = document.getElementById('popup-image-container');
	const closeBtn = document.querySelector('.close-popup');
	
	document.querySelectorAll('.image.main img').forEach(img => {
	    img.addEventListener('click', function(e) {
	        e.stopPropagation(); 
	        
	        const parentSlider = this.closest('.image.main');
	        const siblingImages = Array.from(parentSlider.querySelectorAll('img'));
	        const clickedSrc = this.src; 
	        
	        popupContainer.innerHTML = '';
	
	        siblingImages.forEach(srcImg => {
	            const wrapper = document.createElement('div');
	            wrapper.className = 'popup-item-group';
	            wrapper.style.cssText = "width: 100%; margin-bottom: 5rem; display: block;";
	            
	            const newImg = document.createElement('img');
	            newImg.src = srcImg.src;
	            newImg.style.cssText = "width: 100%; height: auto; display: block; border-radius: 4px;";
	            
	            if(srcImg.src === clickedSrc) {
	                newImg.id = "target-focus";
	            }
	            
	            const fileName = srcImg.src.split('/').pop().split('.').shift();
	            const targetInfo = document.getElementById(fileName + '-info');
	            
	            if (targetInfo) {
	                const infoDiv = document.createElement('div');
	                
	                infoDiv.className = 'popup-info-content';
	                
	                infoDiv.innerHTML = targetInfo.innerHTML;
	                
	                infoDiv.style.cssText = `
	                    display: block !important; 
	                    opacity: 1 !important; 
	                    visibility: visible !important; 
	                    padding: 1rem;
	                `;
	
	                wrapper.appendChild(infoDiv);
	            }
	            
	            wrapper.appendChild(newImg);
	            
	            popupContainer.appendChild(wrapper);
	        });
	        
	        popup.style.display = 'block';
	        
	        setTimeout(() => {
	            const target = document.getElementById('target-focus');
	            if(target) {
	                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
	            } 
	        }, 150);
	    });
	});
	
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation(); // 클릭 이벤트가 기존 팝업으로 전달되는 것을 막음
        
        popup.style.display = 'none';
    });

    popup.addEventListener('click', function(e) {
        if (e.target === popup || e.target.classList.contains('popup-content')) {
            e.stopPropagation();
            popup.style.display = 'none';
        }
    });

    document.getElementById('popup-article').addEventListener('click', function(e) {
        e.stopPropagation();
    });	
	/* 이미지 팝업 종료 */		
	
});