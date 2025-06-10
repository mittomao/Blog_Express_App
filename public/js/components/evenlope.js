$(document).ready(function () {
    $('.envelope-container').mouseenter(function () {
        $('.card').stop().animate({
            top: '-50px',
            zIndex: 99999
        }, 'slow');
    }).mouseleave(function () {
        $('.card').stop().animate({
            top: 0,
            zIndex: 1
        }, 'slow');
    });
});