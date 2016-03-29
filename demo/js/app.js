$(function() {

    if($('.mg-space-init2').length){
        $('.mg-space-init2').mgSpace({rowMargin:0, targetPadding:60});
    }

    if($('.mg-space-init3').length){
        $('.mg-space-init3').mgSpace({useHash: true});
    }

    if($('.mg-space-multiple').length){
        $('.mg-space-init4').mgSpace({useHash: true});
    }

    // Chrome Dev Tools Screen Sizing Clone
    function gvwh(){var i=window,t="inner";return"innerWidth"in window||(t="client",i=document.documentElement||document.body),i[t+"Width"]+"px"+' &times; '+i[t+"Height"]+"px"}$("body").append('<div id="size" style="position:fixed;bottom:0;right:0;background:#ddd;padding:0 6px;font-size:16px;font-family:sans-serif;z-index:9999"></div>'),$("#size").append(gvwh()),$(window).resize(function(){$("#size").html(gvwh())});   
}); // END DOC READY