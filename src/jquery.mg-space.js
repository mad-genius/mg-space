/*
*  __  __  _____    _____ 
* |  \/  |/ ____|  / ____|
* | \  / | |  __  | (___  _ __   __ _  ___ ___ 
* | |\/| | | |_ |  \___ \| '_ \ / _` |/ __/ _ \
* | |  | | |__| |  ____) | |_) | (_| | (_|  __/
* |_|  |_|\_____| |_____/| .__/ \__,_|\___\___|
*                        | |
*                        |_|
* MG Space
*
* Copyright (c) 2016 Bryce Mullican (http://brycemullican.com)
*
* By Bryce Mullican (@BryceMullican)
* Licensed under the MIT license.
*
* @link http://github.com/?
* @author Bryce Mullican
* @version 1.0.0
*/
;(function ( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var mgSpace = "mgSpace",
        defaults = {
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
                },
                {
                    breakpoint: 1200,
                    column: 4
                }
            ],
            rowsWrapper: "mg-rows",
            row: "mg-row",
            rowMargin: 25, // Set to zero for gridless
            targetsWrapper: "mg-targets",
            target: "mg-target",
            targetPadding: 120,
            useHash: false, // Set to true for history
            hashTitle: "#item", // Must include `#` hash symbol           
            useArrow: true           
        },
        afterChange = true,
        activatingHash = false;

    // The actual plugin constructor
    function MGSpace ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = mgSpace;
        this.init();
    }

    // Avoid MGSpace.prototype conflicts
    $.extend(MGSpace.prototype, {
        init: function () {

            var mg = this,
                mgs = this.settings,
                cols = mg.flowColumns($('.'+mgs.row, this.element));

            // SET CURRENT NUMBER OF COLUMNS
            $('.'+mgs.rowsWrapper).attr('data-cols',cols);

            // CHECK FOR HASH
            if (window.location.hash && mgs.useHash) {
                setTimeout(function () {
                    var sectionID =  window.location.hash.replace(mgs.hashTitle, "").split('-'),
                        rowItem = '[data-section="' + sectionID[0] + '"][data-id="' + sectionID[1] + '"]';
                    //console.log('LOADING HASH');
                    if (!$(rowItem).hasClass(mgs.row+'-open')) {
                        activatingHash = true;
                        mg.openRow(rowItem);
                    }
                }, 400);
            }

            // ADD ROW MARGIN IF GREATER THAN ZERO
            if (mgs.rowMargin > 0) {
                $(mg.element).prepend('<style scoped>.mg-row{margin-bottom:'+mgs.rowMargin+'px}</style>');
            }

            $('.'+mgs.row, this.element).each(function(){
                $(this).attr('data-id', $(this).index()+1);
            });

            $('.'+mgs.target, this.element).each(function(){
                $(this).attr('data-id', $(this).index()+1);
            });            
            
            $(mg.element).on('click', '.'+mgs.row, function (ev) {
                ev.preventDefault();
                ev.stopPropagation();

                activatingHash = false;
                mg.rowController(this);
            });

            $(mg.element).on('click', '.mg-close', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();

                var targetItem = $(this).parent().attr('data-id');
                mg.closeRow($('.'+mgs.row+'-open[data-id="' + targetItem + '"]'));
            });

            // CHANGE COLUMNS ON RESIZE EVENT
            $(window).on('resize', function (argument) {
                var cols = mg.flowColumns($('.'+mgs.row, mg.element));
                if (cols != $('.'+mgs.rowsWrapper).attr('data-cols')) {
                    $('.'+mgs.rowsWrapper).attr('data-cols',cols);

                    // Close
                    $('.'+mgs.target+'-open').removeClass(mgs.target+'-open').removeAttr('style');
                    $('.'+mgs.row+'-open').removeClass(mgs.row+'-open');
                    $('.mg-space').remove();
                }


                if($('.'+mgs.target+'-open').length){
                    var targetItem = $('.'+mgs.target+'-open').attr('data-id');
                    $('.'+mgs.target+'-open').css('top',$('.'+mgs.row+'-open[data-id="' + targetItem + '"]').offset().top+$('.'+mgs.row+'-open[data-id="' + targetItem + '"]').height() + mgs.rowMargin );
                    $('.mg-space').css('height',$('.'+mgs.target+'-open').height()+mgs.targetPadding);
                    if (mgs.useArrow) {
                        $('.mg-arrow').css({
                            left: $('.'+mgs.row+'-open[data-id="' + targetItem + '"]').position().left + parseInt($('.'+mgs.row+'-open[data-id="' + targetItem + '"]').css('padding-left')) + $('.'+mgs.row+'-open[data-id="' + targetItem + '"]').width()/2 - 10,
                        });                        
                    }
                }
            });

            $(window).off('hashchange').on('hashchange', function(e) {
                setTimeout(function () {
                    var sectionID =  window.location.hash.replace(mgs.hashTitle, "").split('-'),
                        rowItem = '[data-section="' + sectionID[0] + '"][data-id="' + sectionID[1] + '"]';
                    //console.log('HASH CHANGE');
                    if (!$(rowItem).hasClass(mgs.row+'-open')) {
                        activatingHash = true;
                        mg.rowController(rowItem);
                    }
                }, 400);                
            });
        },

        rowController: function (element) {
            var mg = this,
                mgs = this.settings,
                rowItem = element,
                itemSection = $(rowItem).attr('data-section'),
                itemRow = $(rowItem).attr('data-row');

            // Before Anything Fire Event
            $(mg.element).trigger('beforeChange', [mg, rowItem]);

            if ($(rowItem).hasClass(mgs.row+'-open')) {
                // Close Row
                mg.closeRow(rowItem);

            } else if ($('.'+mgs.row+'-open[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').length) {
                // Same Row
                //console.log('Same Row');
                mg.closeTarget();
                mg.resizeSpace(rowItem);
                mg.openTarget(rowItem);
                mg.scrollToTop(rowItem);

            } else if ($('.mg-space').hasClass('mg-space-open')) {
                // New Row
                //console.log('New Row');
                mg.closeTarget();
                afterChange = false;
                $('.mg-space').slideToggle(400, function () {
                    mg.openRow(rowItem);
                    $(mg.element).trigger('afterChange', [mg, rowItem]);
                });

            } else {
                // Open Row
                mg.openRow(rowItem);
            };
            //After Everything Fire Event
            if (afterChange) {
               $(mg.element).trigger('afterChange', [mg, rowItem]); 
            }
            afterChange = true;
        },

        openRow: function (element) {
            var mg = this,
                mgs = this.settings,
                rowItem = element;

            // Before Open Row Event Handler
            $(mg.element).trigger('beforeOpenRow', [mg, rowItem]);

            //console.log('Open Row');
            mg.openSpace(element);
            mg.openTarget(element);
            mg.scrollToTop(element);            

            // Before Open Row Event Handler
            $(mg.element).trigger('afterOpenRow', [mg, rowItem]);
        },

        closeRow: function (element) {
            var mg = this,
                mgs = this.settings;

            //console.log('Close Row');

            $(element).removeClass(mgs.row+'-open');
            mg.closeTarget();
            mg.closeSpace();
        },        

        openTarget: function (element) {
            var mg = this,
                mgs = this.settings,
                rowItem = element,
                itemId = $(rowItem).attr('data-id'),
                itemOffset = $(rowItem).offset(),
                itemHeight = $(rowItem).height(),
                itemTarget = $('.'+mgs.target+'[data-id="' + itemId + '"]', mg.element);

            $(rowItem).addClass(mgs.row+'-open');
            $(itemTarget).prepend('<a href="#" class="mg-close"></a>');

            $(itemTarget)
                .removeAttr('style')
                .addClass(mgs.target+'-open')
                .css({
                    position: 'absolute',
                    top: itemOffset.top + itemHeight + mgs.rowMargin,
                    zIndex: 2,
                    paddingTop: mgs.targetPadding/2,
                    paddingBottom: mgs.targetPadding/2
                })
                .slideToggle();

            if (mgs.useHash && !activatingHash) {
                var section = $(rowItem).attr('data-section'),
                    id = $(rowItem).attr('data-id');
                if (false) {

                } else {
                    mg.activateHash(mgs.hashTitle+section+'-'+id);
                }
            }
        },

        closeTarget: function () {
            var mgs = this.settings;

            $('.'+mgs.row+'-open').removeClass(mgs.row+'-open');
            $('.'+mgs.target+'-open').css('z-index',1);
            $('.mg-close').remove();
            $('.'+mgs.target+'-open').slideToggle(400, function () {
                $(this).removeClass(mgs.target+'-open').removeAttr('style');
            });
        },            

        openSpace: function (element) {
            var mg = this,
                mgs = this.settings,
                itemSection = $(element).attr('data-section'),
                itemRow = $(element).attr('data-row'),
                itemId = $(element).attr('data-id'),
                itemPosition = $(element).position(),
                itemTarget = $('.'+mgs.target+'[data-id="' + itemId + '"]', mg.element),
                targetHeight = null;

            $(itemTarget).css('position','fixed').show();
            targetHeight = $(itemTarget).height();

            if (!$('.mg-space[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').length) {
                $('.mg-space').remove();
                $('.'+mgs.rowsWrapper).find('[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').last().after('<div class="mg-space" data-section="' + itemSection + '" data-row="' + itemRow + '"><div class="mg-arrow"></div></div>');
            }

            $('.mg-space[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').css({
                height: targetHeight + mgs.targetPadding,
                marginBottom: mgs.rowMargin
            }).slideToggle(400, function() {
                $('.mg-space').addClass('mg-space-open');
                if (mgs.useArrow) {
                    $('.mg-arrow').css({
                        left: itemPosition.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - 10,
                    });
                    $('.mg-arrow').animate({top:-9}, 200);
                }
            });
        },

        closeSpace: function (element) {
            var mgs = this.settings;

            $('.mg-space').slideToggle(400, function () {
                $('.mg-space').removeClass('mg-space-open');
                if (mgs.useArrow) {
                    $('.mg-arrow').animate({top:0}, 200);
                }
            });
        },

        resizeSpace: function (element) {
            var mg = this,
                mgs = this.settings,
                itemId = $(element).attr('data-id'),
                itemPosition = $(element).position(),
                itemTarget = $('.'+mgs.target+'[data-id="' + itemId + '"]', mg.element),
                targetHeight = null;

            $(itemTarget).css('position','fixed').show();
            targetHeight = $(itemTarget).height();

            if (mgs.useArrow) {
                $('.mg-arrow').animate({top:0});
            }

            $('.mg-space').animate({
                height: targetHeight + mgs.targetPadding
            }, 400, function () {
                if (mgs.useArrow) {
                    $('.mg-arrow').css({
                        left: itemPosition.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - 10,
                    });
                    $('.mg-arrow').animate({top:-9}, 200);
                }

            });
        },

        flowColumns: function (cols) {
            var mg = this,
                mgs = this.settings,
                j = 0,
                k = 1,
                col = 1,
                parent = null,
                new_parent = $(mg.element).index();

            $.each(mgs.breakpointColumns, function( idx, val ) {
                if (mg.getViewportWidth() > val.breakpoint) {
                    col = val.column
                }
            });

            $(cols).each(function(idx) {
                
                if(parent==null) {
                    parent=new_parent;
                }

                if(parent != new_parent){
                    parent=$(mg.element).index();
                }
                $(this).attr('data-section', parent);
                $(this).attr('data-row', j);
                if(k==col){
                    j++,
                    k=0;
                }
                k++;
                
            });
            return col;
        },

        getViewportWidth: function () {
           var e = window, a = 'inner';
           if (!('innerWidth' in window )) {
               a = 'client';
               e = document.documentElement || document.body;
           }
           return e[ a+'Width' ];
        },

        activateHash: function (hash) {
            if(history.pushState) {
                history.pushState(null, null, window.location.origin + window.location.pathname + window.location.search + hash);
            } else {
                // Otherwise fallback to the hash update for sites that don't support the history api
                window.location.hash = hash;
            }
        },

        scrollToTop: function (element) {
            $('html, body').animate({
                scrollTop: $(element).offset().top
            }, 400);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ mgSpace ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + mgSpace ) ) {
                $.data( this, "plugin_" + mgSpace, new MGSpace( this, options ) );
            }
        });
    };

})( jQuery, window, document );