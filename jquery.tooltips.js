// ======================
// = jquery tips plugin =
// ======================
(function($) {
    $.tooltip = {defaults : {}};
    $.fn.tooltip = function(options) {
        var config = $.extend({
            tipTemplate: '_CONTENT_',
            spinner: '<h3>Loading...</h3>',
            delay: 150,
            position: 'right',
            width: 250,
            followMouse: true,
            popup: false,
            ajax: false,
            ajaxOptions: {}
        }, $.tooltip.defaults, options);
        
        return this.each(function() {
            var $this = $(this);
            var $tip;
            var timer_in, timer_out;
            var tip_content, tip_title;
            var title = $this.attr('title');

            var showTooltip = function(){
                if (config.ajax && !$tip.hasClass('tooltip-loaded')) {
                    $.ajax($.extend({
                        url: $this.attr('href'),
                        type: 'GET',
                        async: false,
                        data: {},
                        success: function(response) {
                            $tip.html(config.tipTemplate.replace(/_CONTENT_/, response));
                            $tip.addClass('tooltip-loaded')
                        } }, config.ajaxOptions));
                }
                if (config.delay == 0) {
                    $tip.show();
                } else {
                    clearTimeout(timer_out);
                    timer_in = setTimeout(function() { $tip.show(); }, config.delay);
                }
            }

            var hideTooltip = function(){
                if (config.delay == 0) {
                    $tip.hide();
                } else {
                    clearTimeout(timer_in);
                    timer_out = setTimeout(function() { $tip.hide(); }, 100);
                }
            }


            if ($this.next('.tooltip-box').length == 0) $this.after('<div class="tooltip-box"></div>');
            
            if (config.ajax) {
                tip_content = config.spinner;
            } else if (title && title != '') {
                title = title.split('|');
                if (title.length > 1) {
                    tip_title = title[0];
                    tip_content = title[1];
                } else {
                    tip_content = title[0];
                }
            } else {
                tip_content = $this.next('.tooltip-box').html();
            }
            
            $tip = $this.next('.tooltip-box');

            if (($this.attr('rel') && $this.attr('rel').search('jquery-tipped') == -1) || !$this.attr('rel')) {
                $tip
                    .html(config.tipTemplate.replace(/_CONTENT_/, (tip_title ? '<h3>' + tip_title + '</h3>': '') + tip_content))
                    .css({ position: 'absolute' })
                    .css({width: config.width});
                $this
                    .removeAttr('title')
                    .attr('rel', 'jquery-tipped')
                    .bind(config.popup ? 'click' : 'mouseenter', showTooltip)
                    
                if ( config.popup ) {
                    $tip.find('.tooltip-closer').bind('click', hideTooltip);
                } else { 
                    $this.bind('mouseleave', hideTooltip);
                }

                if ( config.followMouse && !config.popup ){
                    $this.bind('mousemove', function(e) {
                        $tip.css({
                            left: (config.position == 'left' ? e.pageX - 15 - config.width: e.pageX + 15),
                            top: e.pageY - 15
                        });
                    })
                }
            }
        });
    }
})(jQuery);