const $blogs = $('.js-blog-entry');

$blogs.each((index, elm) => {
    const eleImage = $(elm).find('.js-post-image');
    LoadImage(eleImage);
});

function LoadImage(elm) {
    let notFoundImage = "/images/default-post.png";
    let realImageSrc = $(elm).data("src-image");
    $(elm).attr("onerror", "this.onerror=null; this.src='" + notFoundImage + "';");
    $(elm).attr("src", realImageSrc);
}

// Animation Logo
// let heading = document.querySelector("#wainiidev-logo a");
// let count = 0;
// let countTwo = heading.dataset.title.length;

// setTimeout(myFunc, 1000);

// function myFunc() {
//     let name = heading.dataset.title;
//     heading.innerHTML = "";

//     setInterval(() => {
//         runFunc();
//     }, 1200);

//     function runFunc() {
//         if (count < name.length) {
//             let createSpan = document.createElement("span");
//             createSpan.setAttribute("class", " ");
//             createSpan.setAttribute("class", "animationOne");
//             createSpan.innerHTML = name.charAt(count);
//             heading.append(createSpan);
//             count++;
//         } else {
//             heading.children[countTwo - 1].className = "animationTwo";
//             countTwo--;
//             if (countTwo <= 0) {
//                 heading.innerHTML = " ";
//                 count = 0;
//                 countTwo = heading.dataset.title.length;
//             }
//         }
//     }
// }
