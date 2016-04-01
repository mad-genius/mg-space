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
            rowWrapper: ".mg-rows",
            row: ".mg-row",
            rowMargin: 25, // Set to zero for gridless
            targetWrapper: ".mg-targets",
            target: ".mg-target",
            targetPadding: 120,
            trigger: ".mg-trigger",
            useHash: false, // Set to true for history
            hashTitle: "#item", // Must include `#` hash symbol           
            useArrow: true           
        },
        afterChange = true,
        activatingHash = false;

    // The actual plugin constructor
    function MGSpace ( element, options ) {
        var _ = this;

        _.$mgSpace = $(element);
        _.options = $.extend( {}, defaults, options );
        _._defaults = defaults;
        _._name = mgSpace;
        _.init();
    }

    // Avoid MGSpace.prototype conflicts
    $.extend(MGSpace.prototype, {
        init: function () {
            var _ = this,
                cols = _.flowColumns($(_.options.row, _.$mgSpace));

            // SET CURRENT NUMBER OF COLUMNS
            $(_.options.rowWrapper).attr('data-cols',cols);

            $(window).on('resize', function () {
                cols = _.flowColumns($(_.options.row, _.$mgSpace));
                $(_.options.rowWrapper).attr('data-cols', cols);
            });

            _.$mgSpace.on('click', _.options.trigger, function (event) {
                event.preventDefault();
                event.stopPropagation();

                console.log('Click Row');
            });

            _.$mgSpace.on('click', _.options.close, function (event) {
                event.preventDefault();
                event.stopPropagation();

                console.log('Click Close');
            });            
        },

        rowController: function (element) {
        },

        openRow: function (element) {
        },

        closeRow: function (element) {
        },        

        openTarget: function (element) {
        },

        closeTarget: function (element) {
        },            

        openSpace: function (element) {
        },

        closeSpace: function (element) {
        },

        resizeSpace: function (element) {
        },

        flowColumns: function (cols) {
            var _ = this,
                col = 1;

            $.each(_.options.breakpointColumns, function( idx, val ) {
                if (_.getViewportWidth() > val.breakpoint) {
                    col = val.column
                }
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