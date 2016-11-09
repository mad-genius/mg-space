/*
*  __  __  _____   _____ 
* |  \/  |/ ____| / ____|
* | \  / | |  __ | (___  _ __   __ _  ___ ___    _  ___ 
* | |\/| | | |_ | \___ \| '_ \ / _` |/ __/ _ \  (_)/ __| 
* | |  | | |__| | ____) | |_) | (_| | (_|  __/_ | |\__ \
* |_|  |_|\_____||_____/| .__/ \__,_|\___\___(_)| ||___/
*                       | |                    _| |
*                       |_|                   |___,
* MG Space
*
* Copyright (c) 2016 Bryce Mullican (http://brycemullican.com)
*
* By Bryce Mullican (@BryceMullican)
* Licensed under the MIT license.
*
* @link https://github.com/Mad-Genius/mg-space
* @author Bryce Mullican
* @version 1.0.0
*/
;(function ( $, window, document, undefined ) {

    "use strict";

    // Create the defaults once
    var mgSpace = "mgSpace",
        defaults = {

            // Breakpoints at which the accordian changes # of columns
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

            // Default selectors
            rowWrapper: ".mg-rows",
            row: ".mg-row",
            targetWrapper: ".mg-targets",
            target: ".mg-target",
            trigger: ".mg-trigger",
            close: ".mg-close",

            // Default target padding top/bottom and row bottom margin
            rowMargin: 25, // Set to zero for gridless
            targetPadding: 120, // Padding top/bottom inside target gets divided by 2

            useHash: false, // Set to true for history
            useOnpageHash: false, // Set true for onpage history
            hashTitle: "#/item-", // Must include `#` hash symbol

            // MISC          
            useIndicator: true
        },
        shouldClick = true,
        activatingHash = false;

    // The actual plugin constructor
    function MGSpace ( element, options ) {
        var _ = this;

        _.$mgSpace = $(element);
        _.options = $.extend( {}, defaults, options );
        _._defaults = defaults;
        _._name =  mgSpace;
        _.init();

        //console.log('MADE IT HERE');
    }

    // Avoid MGSpace.prototype conflicts
    $.extend(MGSpace.prototype, {
        init: function () {
            var _ = this,
                cols = _.setColumns();

            // Set Columns
            $(_.options.rowWrapper, _.$mgSpace).attr('data-cols', cols);

            _.$rows = _.$mgSpace.find(_.options.rowWrapper).children('');
            _.$targets = _.$mgSpace.find(_.options.targetWrapper).children('');

            // Set Rows and Targets
            _.setRows($(_.$rows, _.$mgSpace));
            _.setRows($(_.$targets, _.$mgSpace));

            // Add Row Margin if Greater Than Zero (0)
            if (_.options.rowMargin > 0) {
                _.$mgSpace.prepend('<style scoped>'+_.options.row+'{margin-bottom:'+_.options.rowMargin+'px}</style>');
            }


            // NEED TO BUILD BETTER CLICK HANDLER
            _.$mgSpace.on('click.mg', _.options.trigger, function (event) {
                event.preventDefault();
            });

            // CLICK HANDLING SHOULD GO THROUGH ROW CONTROLLER
            _.$mgSpace.on('click.mg.trigger', _.options.trigger, {mgSpace:_}, _.clickHandler);
            _.$mgSpace.on('click.mg.close', _.options.close, {close:true, mgSpace:_}, _.clickHandler);

            $(window).on('resize.mg', function () {
                cols = _.setColumns();
                _.setRows($(_.options.row, _.$mgSpace));

                if (cols != $(_.options.rowWrapper).attr('data-cols')) {
                    $(_.options.rowWrapper).attr('data-cols',cols);

                    // Close
                    $(_.options.target+'-open').removeClass(_.stripDot(_.options.target)+'-open').removeAttr('style');
                    $(_.options.row+'-open').removeClass(_.stripDot(_.options.row)+'-open');
                    $('.mg-space').remove();

                    _.$mgSpace.trigger('afterCloseTarget', [_]);
                }


                if($(_.options.target+'-open').length){
                    _.resizeSpace(_.options.row+'-open');
                }                
            });

            // LOAD HASH IF EXISTS
            if (window.location.hash && _.options.useHash) {
                setTimeout(function () {
                    var sectionID =  window.location.hash.replace(_.options.hashTitle, "").split('-'),
                        rowItem = _.options.row+'[data-section="' + sectionID[0] + '"][data-id="' + sectionID[1] + '"]';

                    if (sectionID[0] == _.$mgSpace.index()) {
                         activatingHash = true;
                        _.openRow(rowItem);
                    }

                }, 400);
            }

            $(window).on('hashchange.mg', function () {
                if (window.location.hash && _.options.useOnpageHash) {
                    var sectionID =  window.location.hash.replace(_.options.hashTitle, "").split('-'),
                        rowItem = _.options.row+'[data-section="' + sectionID[0] + '"][data-id="' + sectionID[1] + '"]';

                    _.scrollToTop(rowItem);
                    activatingHash = true;

                    if (sectionID[0] == _.$mgSpace.index()) {
                        _.closeRow(300);

                        setTimeout(function () {
                            _.openRow(rowItem);
                        }, 400);
                    }
                } else {
                    _.closeRow(300);
                }               
            });            
        },

        rowController: function (element, event) {
            var _ = this,
                $rowItem = $(element).closest(_.options.row),
                itemSection = $rowItem.attr('data-section'),
                itemRow = $rowItem.attr('data-row');

            _.$mgSpace.off('click.trigger', _.options.trigger, _.clickHandler);

            if ((event.data && event.data.close) || $rowItem.hasClass(_.stripDot(_.options.row)+'-open')) {
                _.closeRow(300);
            } else {
                if ($(_.options.row+'-open[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').length) {
                    // Same Row
                    //console.log('Same Row');

                    _.closeTarget(200);
                    _.resizeSpace($rowItem);
                    _.openTarget($rowItem);
                    _.scrollToTop($rowItem);                    
                } else if ($('.mg-space').hasClass('mg-space-open')) {
                    // New Row
                    //console.log('New Row');

                    _.closeTarget(200);
                    $('.mg-space').slideToggle(300, function () {
                        _.openRow($rowItem);
                    });
                } else {
                    _.openRow($rowItem);
                }
            }
        },

        openRow: function (element) {
            var _ = this;

            // Before Open Row Event Handler
            _.$mgSpace.trigger('beforeOpenRow', [_, element]);

            //console.log('Open Row');

            $(_.options.row+'-open').removeClass(_.stripDot(_.options.row)+'-open');

            _.openSpace(element);
            _.openTarget(element);
            _.scrollToTop(element); 
            
            // After Open Row Event Handler
            _.$mgSpace.trigger('afterOpenRow', [_, element]);
        },

        closeRow: function (speed) {
            var _ = this;

            //console.log('Close Row');

            _.closeTarget(speed);
            _.closeSpace(speed);
        },        

        openTarget: function (element) {
            var _ = this,
                itemSection = $(element).attr('data-section'),
                itemId = $(element).attr('data-id'),
                $itemTarget = $(_.options.target+'[data-section="' + itemSection + '"][data-id="' + itemId + '"]', _.$mgSpace);

            //console.log('Open Target');

            // Before Open Target Event Handler
            _.$mgSpace.trigger('beforeOpenTarget', [_]);

            $(element).addClass(_.stripDot(_.options.row)+'-open');

            // Offset Bug in Chrome Hack ON
            $('body').css('overflowY','scroll');

            $itemTarget.prepend('<a href="#" class="'+_.stripDot(_.options.close)+'"></a>');

            $itemTarget
                .removeAttr('style')
                .addClass(_.stripDot(_.options.target)+'-open')
                .css({
                    position: 'absolute',
                    top: $('.mg-space').position().top + $('.mg-space').parent().position().top,
                    zIndex: 2,
                    paddingTop: _.options.targetPadding/2,
                    paddingBottom: _.options.targetPadding/2
                })
                .slideDown(300, function(){
                    _.$mgSpace.on('click.mg.trigger', _.options.trigger, {mgSpace:_}, _.clickHandler);
                    $(_.options.close).fadeIn(200);

                    // After Open Target Event Handler
                    _.$mgSpace.trigger('afterOpenTarget', [_, $itemTarget]);                    
                });

            // Offset Bug in Chrome Hack OFF
            $('body').removeAttr('style');

            if (_.options.useHash && !activatingHash) {
                _.activateHash(_.options.hashTitle+itemSection+'-'+itemId);
            }

            activatingHash = false;
        },

        closeTarget: function (speed) {
            var _ = this;

            //console.log('Close Target');

            // Before Close Target Event Handler
            _.$mgSpace.trigger('beforeCloseTarget', [_]);

            $(_.options.row+'-open').removeClass(_.stripDot(_.options.row)+'-open');
            $(_.options.target+'-open').css('z-index',1);
            $(_.options.close).remove();
            $(_.options.target+'-open').slideUp(speed, function () {
                $(this).removeClass(_.stripDot(_.options.target)+'-open').removeAttr('style');
                _.$mgSpace.on('click.mg.trigger', _.options.trigger, {mgSpace:_}, _.clickHandler);


                // After Close Target Event Handler
                _.$mgSpace.trigger('afterCloseTarget', [_]);                
            });              
        },            

        openSpace: function (element) {           
            var _ = this,
                itemSection = $(element).attr('data-section'),
                itemRow = $(element).attr('data-row'),
                itemId = $(element).attr('data-id'),
                itemPosition = $(element).position(),
                $itemTarget = $(_.options.target+'[data-section="' + itemSection + '"][data-id="' + itemId + '"]', _.$mgSpace),
                targetHeight = 0;

            //console.log('Open Space');

            targetHeight = $itemTarget.css('position','fixed').show().height();

            if (!$('.mg-space[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').length) {
                $('.mg-space').remove();
                $(_.options.rowWrapper).find('[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').last().after('<div class="mg-space" data-section="' + itemSection + '" data-row="' + itemRow + '"><div class="mg-indicator"></div></div>');
            }

            $('.mg-space[data-section="' + itemSection + '"][data-row="' + itemRow + '"]').css({
                height: targetHeight + _.options.targetPadding,
                marginBottom: _.options.rowMargin
            }).slideDown(300, function() {
                $('.mg-space').addClass('mg-space-open');
                if (_.options.useIndicator) {
                    $('.mg-indicator').css({
                        left: itemPosition.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - 10,
                    });
                    $('.mg-indicator').animate({top:-9}, 200);
                }
            });                        
        },

        closeSpace: function (speed) {
            var _ = this;

            //console.log('Close Space');            

            $('.mg-space').slideUp(speed, function () {
                $('.mg-space').removeClass('mg-space-open');
                if (_.options.useIndicator) {
                    $('.mg-indicator').css({top:1});
                }
            });            
        },

        resizeSpace: function (element) {
            var _ = this,
                itemId = $(element).attr('data-id'),
                itemSection = $(element).attr('data-section'),
                itemPosition = $(element).position(),
                $itemTarget = $(_.options.target+'[data-section="' + itemSection + '"][data-id="' + itemId + '"]'),
                itemTargetOpen = $itemTarget.hasClass(_.stripDot(_.options.target+'-open')),
                targetHeight;

            if (!itemTargetOpen) {
                $itemTarget.css('position','fixed').show();
            } else {
                $(_.options.target+'-open').css('top',$(_.options.row+'-open').offset().top+$(_.options.row+'-open').height() + _.options.rowMargin );                
            }

            targetHeight = $itemTarget.height();

            if (_.options.useIndicator && !itemTargetOpen) {
                $('.mg-indicator').css({top:1});
            }

            if (!itemTargetOpen) {
                $('.mg-space').animate({
                    height: targetHeight + _.options.targetPadding
                }, 200, function () {
                    if (_.options.useIndicator) {
                        $('.mg-indicator').css({
                            left: itemPosition.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - 10,
                        });
                        $('.mg-indicator').animate({top:-9}, 200);
                    }
                });
            } else {
                $('.mg-space').css(
                    'height', targetHeight + _.options.targetPadding
                );

                if (_.options.useIndicator) {
                    $('.mg-indicator').css({
                        left: itemPosition.left + parseInt($(element).css('padding-left')) + $(element).width()/2 - 10,
                    });
                    $('.mg-indicator').animate({top:-9}, 200);
                }                                            
            }          
        },

        destroy: function () {
            var _ = this;

            // REMOVE PLUGIN
            _.$mgSpace.removeData("plugin_" + mgSpace);

            // TURN OFF EVENTS FIRST
            _.$mgSpace.off('.mg');
            $(window).off('.mg');

            // REMOVE DATA ATTRS
            $('.mg-rows').removeAttr('data-cols');
            $('.mg-row, .mg-target').removeAttr('data-id');
            $('.mg-row, .mg-target').removeAttr('data-section');
            $('.mg-row, .mg-target').removeAttr('data-row');

            // REMOVE INLINE STYLES
            $('.mg-row, .mg-target').removeAttr('style');

            // REMOVE ADDED CLASSES
            $('.mg-row, .mg-target').removeClass('mg-row mg-target');

            // REMOVE MG SPACE
            $('.mg-space').remove();
        },

        setColumns: function () {
            var _ = this,
                cols = 1;

            $.each(_.options.breakpointColumns, function( idx, val ) {
                if (_.getViewportWidth() > val.breakpoint) {
                    cols = val.column;
                }
            });

            return cols;
        },

        setRows: function (rows) {
            var _ = this,
                row = 0,
                colCount = 1,
                cols = _.setColumns(),
                parent = null,
                newParent = _.$mgSpace.index();                

            rows.each(function(idx) {
                
                if(parent === null) {
                    parent = newParent;
                }

                if(parent != newParent){
                    parent = _.$mgSpace.index();
                }

                $(this).attr('data-id', idx + 1);
                $(this).attr('data-section', parent);

                if (!$(this).parent().hasClass(_.stripDot(_.options.targetWrapper))) {
                    $(this).attr('data-row', row);
                    $(this).addClass(_.stripDot(_.options.row));
                } else {
                    $(this).addClass(_.stripDot(_.options.target));
                }

                if(colCount==cols){
                    row++;
                    colCount=0;
                }
                colCount++;
                
            });            
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
        },

        clickHandler: function(event) {
            var _ = event.data.mgSpace;

            if (shouldClick) {
                event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();

                _.rowController(this, event);
            }

        },        

        stripDot: function (string) {
            return string.replace('.', '');
        }

    }); //END $.extend

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