function swiper_resp(window) {
    if ($(window).width() < 1200) {
        spv = 2;
    } 
    if ($(window).width() < 775) {
        spv = 1;
    } else spv = 3;
}

swiper_resp($(window));

var swiper = new Swiper('.swiper-container', {
    slidesPerView: spv,
    spaceBetween: 30,
    loop: true,
    loopFillGroupWithBlank: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
});

// TOGGLE NEW POST
$(document).ready(function() {
    $(".new-post").click(function() {
        $(".overlay").toggleClass("active");
    })
    $(".close").click(function() {
        $(".overlay").toggleClass("active");
    })
})