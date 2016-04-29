$(function() {
	$(".main-content .features").mgSpace();

    $('.main-content .features').on('afterOpenTarget', function(event, mgSpace, itemTarget){
        var cols = mgSpace.setColumns();

        //For responsive slick you must wrap in screen width tests and set them seperately
        //you can not use slicks "responsive" option.
        $(".slider-inner").slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1,          
        });                

    });

    $('.main-content .features').on('afterCloseTarget', function(event, mgSpace){
        if ($('.slick-initialized').length) {
            $(".slider-inner").slick("destroy", true);
        }
    });
});