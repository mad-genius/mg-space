$(function() {

    if($('.no-grid').length){
        $('.no-grid').mgSpace({
            rowMargin:0, 
            targetPadding:90,
            breakpointColumns: [
                {
                    breakpoint: 0,
                    column: 1
                },
                {
                    breakpoint: 568,
                    column: 2
                },
                {
                    breakpoint: 768,
                    column: 3
                }                
            ]
        });
    }

    if($('.mg-history').length){
        $('.mg-history').mgSpace({useHash: true});
    }

    if($('.mg-space-multiple').length){
        $('.mg-space-init4').mgSpace({useHash: true});
    }

    // Chrome Dev Tools Screen Sizing Clone
    function gvwh(){var i=window,t="inner";return"innerWidth"in window||(t="client",i=document.documentElement||document.body),i[t+"Width"]+"px"+' &times; '+i[t+"Height"]+"px"}$("body").append('<div id="size" style="position:fixed;bottom:0;right:0;background:#ddd;padding:0 6px;font-size:16px;font-family:sans-serif;z-index:9999"></div>'),$("#size").append(gvwh()),$(window).resize(function(){$("#size").html(gvwh())});   
}); // END DOC READY