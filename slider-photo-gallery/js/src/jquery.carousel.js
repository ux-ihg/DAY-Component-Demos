/**
 * Simple Carousel
 * Copyright (c) 2010 Tobias Zeising, http://www.aditu.de
 * Licensed under the MIT license
 * 
 * http://code.google.com/p/simple-carousel/
 * Version 0.3
 */
 (function ($) {
    $.fn.simplecarousel = function (params) {
        // set config
        var defaults = {
            width: 170,
            height: 120,
            vertical: false,
            auto: false,
            fade: false,
            current: 0,
            items: 0,
            slidespeed: 600,
            visible: 5,
            pagination: false,
            next: $(this).parent().find('.caro-next'),
            prev: $(this).parent().find('.caro-prev'),
            controls: true,
            deactivateNext: false,
            deactivatePrev: false
        };
        var config = $.extend(defaults, params);
        // configure carousel ul and li
        var ul = $(this);
        console.log(this);
        var li = ul.children('li');
        config.items = li.length;
        var height = config.height;
        var width = config.width;
        if (config.visible > 1) {
            if (config.vertical) height = height * config.visible;
            else width = width * config.visible;
        }
        ul.wrap('<div class="carousel-frame" style="width:' + width + 'px;height:' + height + 'px; overflow:hidden">');
        var container = ul.parent('.carousel-frame');
        if (!config.vertical) {
            ul.width(config.items * config.width);
            ul.height(config.height);
        } else {
            ul.width(config.width);
            ul.height(config.items * config.height);
        }
        ul.css('overflow', 'hidden');
        li.each(function (i, item) {
            $(item).width(config.width);
            $(item).height(config.height);
            if (!config.vertical) $(item).css('float', 'left');
            if (!config.controls){
                $(item).css('text-align','left');
            } 
        });
        
        //hide cta for each thumbnail
        $('.cbox-cta').hide();

        // on load show prev as disabled
        config.prev.attr('disabled', 'disabled');
        $('.caro-prev').addClass('deactivate-prev');
        
        //if items visible = total items do not show controls
        if(config.visible == config.items){
            config.prev.parent().remove();
            config.next.parent().remove();
        }else{
            // only when js is on show contorls
            config.prev.show();
            config.next.show();
        }

        // set the last li width to the with of the image - no padding or margin on right
        if(config.items == config.visible){
            var liw = $(this).find('li:last-child img').width();
            $(this).children('li:last-child').last().css('width',liw);
            $(this).children('li').css('text-align','left');
            config.prev.parent().remove();
            config.next.parent().remove();
        }

        // function for sliding the carousel
        var slide = function (dir, click) {
                if (typeof click == "undefined" & config.auto == false) return;
                if (dir == "next" && config.controls && config.current != config.items && config.deactivateNext == false) {
                    config.current += 1;
                        config.prev.removeAttr('disabled');
                        config.prev.removeClass('deactivate-prev');
                        console.log(config.current);
                    if (config.current == config.items - config.visible){
                         config.deactivateNext = true;
                         config.deactivatePrev = false;
                        config.next.attr('disabled', 'disabled');
                        config.next.addClass('deactivate-next');  
                         console.log("far right");
                    
                     }else{
                        config.deactivateNext = false;
                        
                     }
                } else if (dir == "prev" && config.controls && config.current != config.items && config.deactivatePrev == false && config.current !=0 ) {
                    config.deactivateNext = false;
                    config.current -= 1;
                    console.log(config.current);
                    config.next.removeAttr('disabled');
                    config.next.removeClass('deactivate-next');
                    if (config.current == config.items - config.items){
                         config.deactivatePrev = true;
                         config.deactivateNext = false;
                         config.prev.attr('disabled', 'disabled');
                         config.prev.addClass('deactivate-prev');  
                         console.log("far left");
                       
                     }   
                    } else {
                        ul.stop().animate();
                        
                    }
                
                // set pagination
                if (config.pagination != false) {
                    container.next('.carousel-pagination').find('li').removeClass('carousel-pagination-active')
                    container.next('.carousel-pagination').find('li:nth-child(' + (config.current + 1) + ')').addClass('carousel-pagination-active');

                }
                // fade
                if (config.fade != false) {
                    ul.fadeOut(config.fade, function () {
                        ul.css({
                            marginLeft: -1.0 * config.current * config.width
                        });
                        ul.fadeIn(config.fade);
                    });
                    // slide
                } else {
                    if (!config.vertical) ul.stop().animate({
                        marginLeft: -1.0 * config.current * config.width
                    }, config.slidespeed);
                    else ul.stop().animate({
                        marginTop: -1.0 * config.current * config.height
                    }, config.slidespeed);
                }
                if (typeof click != "undefined") config.auto = false;
                if (config.auto != false) setTimeout(function () {
                    slide('next');
                }, config.auto);
            }
            // include pagination
        if (config.pagination != false) {
            container.after('<ul class="carousel-pagination"></ul>');
            var pagination = container.next('.carousel-pagination');
            for (var i = 0; i < config.items; i++) {
                if (i == 0) pagination.append('<li class="carousel-pagination-active"></li>');
                else pagination.append('<li></li>');
            }
            pagination.find('li').each(function (index, item) {
                $(this).click(function () {
                    slide(index, true);
                });
            });
        }
        // set event handler for next and prev
        if (config.next != false) config.next.click(function () {
            slide('next', true);

        });
        if (config.prev != false) config.prev.click(function () {
            slide('prev', true);
        });
        // start auto sliding
        if (config.auto != false) setTimeout(function () {
            slide('next');
        }, config.auto);
    };
})(jQuery);