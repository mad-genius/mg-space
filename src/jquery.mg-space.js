$(function() {
    $('.mg-trigger').on('click', function (ev) {
        ev.preventDefault();
        ev.stopPropagation();

        var mg_row = $(this).parent(),
        mg_row_parent = $(mg_row).parent(),
        mg_row_height = $(mg_row).height();
        mg_row_current = $(mg_row).attr('data-row'),
        mg_row_offset = $(mg_row).offset(),
        mg_row_target = $(mg_row).attr('id'),
        mg_row_target_height = 0;    

        if ($(mg_row).hasClass('mg-row-open')) {
            // THIS ROW IS OPEN
            // console.log('THIS ROW IS OPEN. CLOSE IT');

            $('.mg-target-open.mg-target').slideToggle(400, function () {
                $(mg_row).removeClass('mg-row-open');
                $(this).removeClass('mg-target-open').removeAttr('style');
            });
            $('.mg-space').slideToggle(400, function () {
                $('.mg-space').remove();            
            });        

        } else {
            // THIS ROW IS NOT OPEN. CHECK ROW.
            // console.log('THIS ROW IS NOT OPEN. CHECK ROW.');
            if ($('.mg-row-open[data-row="' + mg_row_current + '"]').length) {
                // MY ROW IS OPEN. OPEN TARGET
                // console.log('MY ROW IS OPEN. OPEN TARGET');

                // CLOSE OTHER TARGET
                $('.mg-row-open').removeClass('mg-row-open');
                $('.mg-target-open.mg-target').css('z-index',1);
                $('.mg-target-open.mg-target').slideToggle(400, function () {
                    $(this).removeClass('mg-target-open').removeAttr('style');
                });

                // Open ME
                $(mg_row).addClass('mg-row-open');
                $('[data-target="' + mg_row_target + '"]').css('position','fixed').show();

                mg_row_target_height = $('[data-target="' + mg_row_target + '"]').height();

                $('.mg-space').animate({
                    height: mg_row_target_height + 120
                }, 400, function () {
                    $('#mg-arrow').css({
                        left: mg_row_offset.left + parseInt($(mg_row).css('padding-left')) + $(mg_row).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
                    });
                });                            

                $('[data-target="' + mg_row_target + '"]')
                    .removeAttr('style')
                    .addClass('mg-target-open')
                    .css({
                        position: 'absolute',
                        top: mg_row_offset.top + mg_row_height + 25,
                        zIndex: 2
                    })
                    .slideToggle();                       
            } else {
                // MY ROW IS NOT OPEN. CHECK MGSPACE.
                // console.log('MY ROW IS NOT OPEN. CHECK MGSPACE.');            
                if ($('.mg-space').is(':visible')) {
                    // MGSPACE IS OPEN. CLOSE OLD MGSPACE/TARGET. OPEN NEW MGSPACE/TARGET.
                    // console.log('MGSPACE IS OPEN. CLOSE OLD MGSPACE/TARGET. OPEN NEW MGSPACE/TARGET');

                    $('.mg-target-open.mg-target').slideToggle(400, function () {
                        $('.mg-row-open').removeClass('mg-row-open');
                        $(this).removeClass('mg-target-open').removeAttr('style');
                    });

                    $('.mg-space').slideToggle(400, function () {
                        $('.mg-space').remove();

                        mg_row_offset = $(mg_row).offset();

                        // Open ME
                        $(mg_row).addClass('mg-row-open');
                        $('[data-target="' + mg_row_target + '"]').css('position','fixed').show();

                        mg_row_target_height = $('[data-target="' + mg_row_target + '"]').height();

                        $('[data-target="' + mg_row_target + '"]')
                            .removeAttr('style')
                            .addClass('mg-target-open')
                            .css({
                                position: 'absolute',
                                top: mg_row_offset.top + mg_row_height + 25,
                                zIndex: 2
                            })
                            .slideToggle();

                        // Open Row
                        $(mg_row_parent).find('[data-row="' + mg_row_current + '"]').last().after('<div class="mg-space sm-12 lg-12" data-row="' + mg_row_current + '"><div id="mg-arrow"></div></div>');
                        $('.mg-space[data-row="' + mg_row_current + '"]').css('height', mg_row_target_height+120).slideToggle(400, function() {
                            $('#mg-arrow').css({
                                left: mg_row_offset.left + parseInt($(mg_row).css('padding-left')) + $(mg_row).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
                            });
                        });

                    });                
                } else {
                    // OPEN MGSPACE. OPEN TARGET.
                    // console.log('OPEN MGSPACE. OPEN TARGET');
                    $(mg_row).addClass('mg-row-open');
                    $('[data-target="' + mg_row_target + '"]').css('position','fixed').show();

                    mg_row_target_height = $('[data-target="' + mg_row_target + '"]').height();               

                    $('[data-target="' + mg_row_target + '"]')
                        .removeAttr('style')
                        .addClass('mg-target-open')
                        .css({
                            position: 'absolute',
                            top: mg_row_offset.top + mg_row_height + 25,
                            zIndex: 2
                        })
                        .slideToggle();

                    // Open Row
                    $(mg_row_parent).find('[data-row="' + mg_row_current + '"]').last().after('<div class="mg-space sm-12 lg-12" data-row="' + mg_row_current + '"><div id="mg-arrow"></div></div>');
                    $('.mg-space[data-row="' + mg_row_current + '"]').css('height', mg_row_target_height+120).slideToggle(400, function() {
                        $('#mg-arrow').css({
                            left: mg_row_offset.left + parseInt($(mg_row).css('padding-left')) + $(mg_row).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
                        });
                    });                               
                }
            }
        }
    }); // END MG-TRIGGER CLICK HANDLER

    var cols = columnFlow('.mg-rows .mg-row');
    $('.mg-rows').attr('data-cols',cols);

    $(window).resize(function () {
        var cols = columnFlow('.mg-rows .mg-row');
        if (cols != $('.mg-rows').attr('data-cols')) {
            $('.mg-rows').attr('data-cols',cols);

            // Close
            $('.mg-target-open').removeClass('mg-target-open').removeAttr('style');
            $('.mg-row-open').removeClass('mg-row-open');
            $('.mg-space').remove();
        }


        if($('.mg-target-open.mg-target').length){
            var mg_row = $('.mg-target-open.mg-target').data('target');
            $('.mg-target-open.mg-target').css('top',$('#'+mg_row).offset().top+$('#'+mg_row).height()+25);
            $('#mg-arrow').css({
                left: $('#'+mg_row).offset().left + parseInt($('#'+mg_row).css('padding-left')) + $('#'+mg_row).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
            });        
        }

    }); // END COLUMN FLOW RESIZE
}); // END DOC READY

var getViewportWidth = function () {
   var e = window, a = 'inner';
   if (!('innerWidth' in window )) {
       a = 'client';
       e = document.documentElement || document.body;
   }
   return e[ a+'Width' ];
};

function columnFlow (cols) {
    var j = 0,
        k = 1,
        col = 1,
        fired = false,
        parent = null;
    
    if (getViewportWidth() > 768) {
        col = 3;
    } else if(getViewportWidth() > 568) {
        col = 2;
    } else {
        col = 1;
    }

    $( cols ).each(function(idx) {
        var new_parent = $(this).parent().index();
        
        if(parent==null) {
            parent=$(this).parent().index();
        }
        
        if(parent != new_parent){
            j=0,
            k=1,
            parent=$(this).parent().index();
        }        

        $(this).attr('data-row', j);
        if(k==col){
            j++,
            k=0;
        }        
        k++;        
        
    });

    return col;    
};