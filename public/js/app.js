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

const $blogs = $('.js-blog-entry');

$blogs.each((index, elm) => {
    const eleImage = $(elm).find('.js-post-image');
    LoadImage(eleImage);
});

function LoadImage(elm){
    let notFoundImage = "/images/default-post.png";
    let realImageSrc = $(elm).data("src-image");	
    $(elm).attr("onerror", "this.onerror=null; this.src='" + notFoundImage + "';");			
    $(elm).attr("src", realImageSrc);	
}
