// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var mgSpace = "mgSpace",
        defaults = {
            autoSelector: '.mg-space-init',
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
            trigger: "mg-trigger",
            targetsWrapper: "mg-targets",
            target: "mg-target",
            targetPadding: 120,
            useHash: false, // Set to true for history
            useArrow: true
        };

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
                    var rowItem = $(window.location.hash+' .'+mgs.trigger).parent();
                    if (!$(rowItem).hasClass(mgs.row+'-open')) {
                        mg.openRow(rowItem); 
                    }                    
                }, 400);
            }

            // ADD ROW MARGIN IF GREATER THAN ZERO
            if (mgs.rowMargin > 0) {
                $(mg.element).prepend('<style scoped>.mg-row{margin-bottom:'+mgs.rowMargin+'px}</style>');
            }
            
            $(mg.element).on('click', '.'+mgs.trigger, function (ev) {
                ev.preventDefault();
                ev.stopPropagation();

                mg.rowController(this);

                if (mgs.useHash) {
                    mg.activateHash($(this).attr('href'));
                }
            });

            $(mg.element).on('click', '.mg-close', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                
                var targetItem = $(this).parent().attr('data-target');
                mg.closeRow($('#'+targetItem));
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
                    var targetItem = $('.'+mgs.target+'-open').attr('data-target');
                    $('.'+mgs.target+'-open').css('top',$('#'+targetItem).offset().top+$('#'+targetItem).height() + mgs.rowMargin );
                    $('.mg-space').css('height',$('.'+mgs.target+'-open').height()+mgs.targetPadding);
                    if (mgs.useArrow) {
                        $('.mg-arrow').css({
                            left: $('#'+targetItem).offset().left + parseInt($('#'+targetItem).css('padding-left')) + $('#'+targetItem).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
                        });
                    }
                }
            });

            $(window).off('hashchange').on('hashchange', function(e) {
                setTimeout(function () {
                    mg.rowController(window.location.hash+' .'+mgs.trigger);
                }, 400);
            });
        },

        rowController: function (element) {
            var mg = this,
                mgs = this.settings,
                rowItem = $(element).parent(),
                itemCurrent = $(rowItem).attr('data-row');

            if ($(rowItem).hasClass(mgs.row+'-open')) {
                // Close Row
                mg.closeRow(rowItem);

            } else if ($('.'+mgs.row+'-open[data-row="' + itemCurrent + '"]').length) {
                console.log('Same Row');

                $('.'+mgs.row+'-open').removeClass(mgs.row+'-open');
                $(rowItem).addClass(mgs.row+'-open');
                mg.closeTarget();

                mg.resizeSpace(rowItem);
                mg.openTarget(rowItem);
                mg.scrollToTop(rowItem);

            } else if ($('.mg-space').hasClass('mg-space-open')) {
                console.log('New Row');

                $('.'+mgs.row+'-open').removeClass(mgs.row+'-open');
                mg.closeTarget();

                $('.mg-space').slideToggle(400, function () {
                    mg.openRow(rowItem);
                });

            } else {
                // Open Row
                mg.openRow(rowItem);
            };
        },

        openRow: function (element) {
            var mg = this,
                mgs = this.settings;

            console.log('Open Row');

            $(element).addClass(mgs.row+'-open');
            mg.openSpace(element);
            mg.openTarget(element);
            mg.scrollToTop(element);
        },

        closeRow: function (element) {
            var mg = this,
                mgs = this.settings;

            console.log('Close Row');

            $(element).removeClass(mgs.row+'-open');
            mg.closeTarget();
            mg.closeSpace();
        },        

        openTarget: function (element) {
            var mgs = this.settings,
                itemId = $(element).attr('id'),
                itemOffset = $(element).offset(),
                itemHeight = $(element).height(),
                itemTarget = '[data-target="' + itemId + '"]';

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
        },

        closeTarget: function () {
            var mgs = this.settings;

            $('.'+mgs.target+'-open').css('z-index',1);
            $('.mg-close').remove();
            $('.'+mgs.target+'-open').slideToggle(400, function () {
                $(this).removeClass(mgs.target+'-open').removeAttr('style');
            });
        },            

        openSpace: function (element) {
            var mgs = this.settings,
                itemCurrent = $(element).attr('data-row'),
                itemId = $(element).attr('id'),
                itemOffset = $(element).offset(),
                itemTarget = '[data-target="' + itemId + '"]',
                targetHeight = null;

            $(itemTarget).css('position','fixed').show();
            targetHeight = $(itemTarget).height();

            if (!$('.mg-space[data-row="' + itemCurrent + '"]').length) {
                $('.mg-space').remove();
                $('.'+mgs.rowsWrapper).find('[data-row="' + itemCurrent + '"]').last().after('<div class="mg-space sm-12 lg-12" data-row="' + itemCurrent + '"><div class="mg-arrow"></div></div>');
            }


            $('.mg-space[data-row="' + itemCurrent + '"]').css({
                height: targetHeight + mgs.targetPadding,
                marginBottom: mgs.rowMargin
            }).slideToggle(400, function() {
                $('.mg-space').addClass('mg-space-open');
                if (mgs.useArrow) {
                    $('.mg-arrow').css({
                        left: itemOffset.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
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
            var mgs = this.settings,
                itemId = $(element).attr('id'),
                itemOffset = $(element).offset(),
                itemTarget = '[data-target="' + itemId + '"]',
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
                        left: itemOffset.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - parseInt($('#content > .container').css('margin-left')) - 10
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

                $(this).attr('data-row', parent+'-'+j);
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

    // automatically find and run mgSpace
    $(function() {
        $( defaults.autoSelector ).mgSpace();
    });

})( jQuery, window, document );