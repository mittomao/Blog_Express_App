const $navbars = $('#wainiidev-main-menu li');
const pathName = window.location.pathname;
$navbars.each((index, item) => {
    $navbars.removeClass('active');
    let pathItem = $(item).find('a').attr('href');
    if (pathName === pathItem) {
        $(item).addClass('active');
        return false;
    } else {
        $($navbars[0]).addClass('active');
    }
});