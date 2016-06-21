var navs = $("nav .list-inline").data("navs");


if ($("#index").length) {
    var swiper = new Swiper('.g-verti', {
        pagination: '.list-inline',
        direction: 'vertical',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        mousewheelControl: true,
        bulletClass: 'list-inline li',
        paginationElement: 'li',
        slideActiveClass: 'active',
        bulletActiveClass: 'active',
        paginationBulletRender: function(index, className) {
            return '<li><a>' + navs[index] + '</a></li>';
        },
        onSlideChangeStart: function (swiper) {
            navCssSetting($("nav li.active"));
        }
    });

    var page1Swiper = new Swiper('.p1-hori', {
        pagination: '.guide',
        grabCursor: true,
        paginationClickable: true,
        loop: true,
        autoplay: 1500000,
        autoplayDisableOnInteraction: false,
        bulletClass: 'pag',
        paginationElement: 'a',
        slideActiveClass: 'active',
        bulletActiveClass: 'active',
    });

    var tempWrapSwiper = new Swiper('.ad-verti', {
        mousewheelControl: true,
        direction: 'vertical',
        loop: true,
        mousewheelForceToAxis: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });

    $(".pag").on("mouseover", function() {
        var index = $(this).index() + 1;
        page1Swiper.slideTo(index);
    });


    function navCssSetting($target) {
        var hoverPaddingLeft = parseInt($target.css('padding-left').replace("px", ""));
        var hoverOffsetLeft = $target.offset().left - hoverPaddingLeft / 2;
        var hoverWidth = $target.width() + hoverPaddingLeft;
        $target.parent().next().css({left: hoverOffsetLeft + hoverPaddingLeft + "px", width: hoverWidth + "px"});
    }

    $("nav li").on({
        mouseenter: function () {
            navCssSetting($(this));
        },
        mouseleave: function () {
            navCssSetting($("nav li.active"));
        }
    });

    var responsiveEvents = function () {
        navCssSetting($("nav li.active"));
    }

    var init = function () {
        $(window).on('load resize', function () {
            responsiveEvents();
        });
    }();
}
