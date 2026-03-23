$(function() {
    $('li a[href^="#section"]').on('click', function() {
        if ( isMobile() && !localStorage.getItem('zoomGuideShown')) {
            showZoomGuide();
        }
    });
});

function showZoomGuide() 
{
    const $guide = $('#zoom-guide-overlay');
    
    $guide.addClass('active');

    setTimeout(function() {
        $guide.fadeOut(500, function() {
            $(this).removeClass('active').removeAttr('style');
            localStorage.setItem('zoomGuideShown', 'true');
        });
    }, 1000);
};

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}