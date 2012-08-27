/*!
 * jQuery Slider Evolution - for jQuery 1.3+
 * http://codecanyon.net/item/jquery-slider-evolution/270714?ref=aeroalquimia
 *
 * Copyright 2011, Eduardo Daniel Sada
 * http://codecanyon.net/wiki/buying/howto-buying/licensing/
 *
 * Revision: 2.2.1 (06 June 2012) - Paul Dickerson
 * Added support for no-js, added slide counter, rewrapped els
 * asscessible text options, remove unused animations
 * Version: 2.0.0 (24 Feb 2012) - Base
 *
 * Includes jQuery Easing v1.3
 * http://gsgd.co.uk/sandbox/jquery/easing/
 * Copyright (c) 2008 George McGinley Smith
 * jQuery Easing released under the BSD License.
 */

(function($) {
  var is_ie6 = ($.browser.msie && parseInt($.browser.version, 10) < 7 && parseInt($.browser.version, 10) > 4);

  if (is_ie6) {
    try { document.execCommand("BackgroundImageCache", false, true); } catch(err) {}
  };

  // for jQuery 1.3
  if ($.proxy === undefined)
  {
    $.extend({
      proxy: function( fn, thisObject ) {
        if ( fn ) {
          proxy = function() { return fn.apply( thisObject || this, arguments ); };
        };
        return proxy;
      }
    });
  };
  
  $.extend( $.easing, {
    easeOutCubic: function (x, t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    }
  });
  
  // start slider object
  SliderObject = function(el, options) {
    this.create(el, options);
  };

  $.extend(SliderObject.prototype, {

      version   : "2.0.1",

      create: function(el, options) {
      
        this.defaults = {
          name            : 'hero-content-slider',

          navigation      : true,    // so see any options below set to true
          arrows          : true,    // Show next/prev arrows
          control         : true,    // show play/pause toggle
          selector        : false,   // show coin selectors
          timer           : false,   // show timer
          counter         : true,    // show counter, # of # 

          hideControls    : false,   // to hide all controls set to true

          pauseOnClick    : false,   // allow pause on slider click
          pauseOnHover    : false,   // allow pause on slider hover
          loop            : true,    // loop through all slide continuously 
          slideshow       : true,    // start slideshow on load

          delay           : 4500,    // in ms
          duration        : 600,     // in ms
          bars            : 9,
          columns         : 7,
          rows            : 3,
          speed           : 80,      // in ms
          padding         : 8,
          easing          : 'easeOutCubic',

          prev            : 'Go to previous slide',
          next            : 'Go to next slide',
          pausePlay       : 'Pause/Play Toggle',

          //direction     : 'alternate', // left, right, alternate, random
		  //fade is the only transition setup right now to work correctly.
          transition      : 'fade', // fade, slip
          onComplete      : function() {}, //to do
          onSlideshowEnd  : function() {}  //to do
        };
        this.options      = {};
        this.transitions  = [
          'fade', 'square', 'bar', 'squarerandom', 'fountain', 'rain'
        ];
        this.dom          = {};
        this.img          = [];
        this.titles       = [];
        this.links        = [];
        this.imgInc       = 0;
        this.imgInterval  = 0;
        this.inc          = 0;
        this.order        = [];
        this.resto        = 0;
        this.selectores   = [];
        this.direction    = 0;
        this.degrees      = 0;
        this.timer        = 0;
        this.slides       = [];
        this.esqueleto    = {
          wrapper     : [],
          navigation  : [],
		      counter	    : [],
          timer       : [],
          selector    : [],
          control     : [],
          clock       : []
        };
		
		// end options
        
        this.events = {
          clicked : false,
          hovered : false,
          playing : false,
          paused  : false,
          stopped : false
        };

        this.element = $(el);
        var params = this.options;
        var self   = this;
        var slides = this.element.children("div");
		// get total num of all slides for counter
		var allSlides = this.element.children("div").length;
		// Start counter with num 1
		var curSlideNum = 1;
		
        if (slides.length < 2) {
          return false;
        }

        if (!options['width']) {
          options['width']  = 0;
          options['height'] = 0;

          var temp = {};
          
          // Through all the slides and setup the class with the largest found
          slides.children().each(function() {
            if ($(this).is("img")) {
              temp['width']  = $(this).outerWidth();
              temp['height'] = $(this).outerHeight();
              
              options['width']  = (temp['width'] >= options['width']) ? temp['width'] : 0;
              options['height'] = (temp['height'] >= options['height']) ? temp['height'] : 0;
            }
          });
          temp = null;

          if (options['width']==0 || options['height']==0) {
            options['width'] = options['height'] = null;
          }
        }

        this.options = $.extend(true, this.defaults, options);

        var optionClass = this.options.name + '-option';
        $.each(['navigation', 'selector', 'control', 'timer'], function(i, s) {
          if (self.options[s]) {
            optionClass += '-' + s ;
          }
        });
        
    // Creating HTML mockup
    this.esqueleto.wrapper = this.element.wrap('<div class="' + this.options.name + '-wrap '+ optionClass +'" />').parent();
		this.esqueleto.wrapper.css({});/*removed dynamic width and height call here*/
		this.element.css({ 'overflow': 'hidden', 'position': 'relative'});

        // Through all the slides and assign the appropriate classes
		slides.each(function(i) {
						
          if (i == 0) {
            $(this).addClass(self.options.name + '-slide-current');
		    
          }

          $(this).addClass(self.options.name + '-slide');
		  //add attr rel num for each slide - this is used for the counter 1 of 4 
		  $(this).addClass(self.options.name + '-slide-' + (i+1));
		  $(this).attr('rel', (i+1));
		  
          // Create the list of selectors (1 2 3 4)
          self.selectores = $(self.selectores).add($('<a href="#" class="' + self.options.name + '-selector" rel="'+(i+1)+'"><span class="' + self.options.name + '-selector-span ' + self.options.name + '-selector-'+(i+1)+'"><span>'+(i+1)+'</span></span></a>'));
          if (i == 0) {
            $(self.selectores).addClass(self.options.name + '-selector-current');
          }
        });
        
        
        
        if (this.options.navigation) {
          this.esqueleto.navigation = $('<div class="' + this.options.name + '-navigation" />').insertAfter(el);
          this.esqueleto.navigation.wrapAll('<div class="control-bar" />').wrapAll('<div class="control-bar-inner-wrap" />');
        }
       
        if(this.options.arrows){
          var arrowPrev = $('<a href="#" class="' + this.options.name + '-navigation-prev prevNext" rel="-1">' + this.options.prev + '</a>');
          var arrowNext = $('<a href="#" class="' + this.options.name + '-navigation-next prevNext" rel="+1">' + this.options.next + '</a>');
          this.esqueleto.navigation.append(arrowPrev, arrowNext);
        }
		
		// Add the list of selectors to the wrapper
        this.esqueleto.selector = $('<div class="' + this.options.name + '-selectors" />').appendTo(this.esqueleto.navigation);
        this.esqueleto.selector.append(this.selectores);
        
        if (!this.options.selector) {
          this.esqueleto.selector.hide();
        } else {
          if (this.rgbToHex(this.esqueleto.selector.css("color"))=="#FFFFFF") {
            var ouWidth = $('.' + this.options.name + '-selector').outerWidth(true);
            ouWidth = -((ouWidth * slides.length) / 2);
            this.esqueleto.selector.css({});
          }
        }
    		
    		if (this.options.control) {	
              this.esqueleto.control = $('<a href="#" class="' + this.options.name + '-control ' + this.options.name + '-control-pause">' + this.options.pauseplay + '</a>').appendTo(this.esqueleto.navigation);
            }
    			
    		if (this.options.counter) {
    			this.esqueleto.counter = $('<div id="' + this.options.name + '-counter"></div>');
    		  //this.esqueleto.counter.parent().wrapAll('<div class="control-bar" />').wrap('<div class="control-bar-inner-wrap" />');
    			this.esqueleto.counter.html('<span class="slide-num">' + curSlideNum + '</span>' + '<span class="of"> of </span>' + ' ' + allSlides).prependTo(this.esqueleto.navigation);
          this.esqueleto.counter.prepend('<span class="accessible">Viewing Slide</span>');
    			}
			   
         if(this.options.control && this.options.arrows){
          this.esqueleto.control.insertAfter(arrowPrev);
         }else{
          this.esqueleto.control.appendTo(this.esqueleto.navigation);
         }
         // shift counter and play/pause button over if arrows are off
         if(this.options.control && this.options.counter && this.options.arrows != true){
            this.esqueleto.control.insertAfter(this.esqueleto.counter);
            this.esqueleto.navigation.css({
              'paddingLeft' : '243px',
              'width' : '67px'
            });
         }

         // if arrow controls are off then move counter to the right
         if(this.options.arrows != true && this.options.control != true ){
            this.esqueleto.counter.css('float','right');
         }
         // if arrow controls and counter is off then move counter to the right
         if(this.options.arrows != true && this.options.counter !=true ){
            this.esqueleto.control.css('float','right');
         }
        
         // if hideControls true
        if(this.options.hideControls){
          this.esqueleto.navigation.remove();
        }

        if (this.options.timer) {
          this.esqueleto.timer          = $('<div class="' + this.options.name + '-timer"></div>').appendTo(this.esqueleto.navigation);//add .parent() for bar
          this.esqueleto.clock.mask     = $('<div class="' + this.options.name + '-timer-mask"></div>');
          this.esqueleto.clock.rotator  = $('<div class="' + this.options.name + '-timer-rotator"></div>');
          this.esqueleto.clock.bar      = $('<div class="' + this.options.name + '-timer-bar"></div>');
          this.esqueleto.clock.command  = this.rgbToHex(this.esqueleto.timer.css("color"));
          this.esqueleto.timer.append(this.esqueleto.clock.mask.append(this.esqueleto.clock.rotator), this.esqueleto.clock.bar);
        }
        
        this.addEvents();
        
        if (this.options.slideshow) {
          this.startTimer();
        } else {
          this.stopTimer();
        }
        
      },
      
      addEvents: function() {
        var self    = this;
        var wrapper = this.esqueleto.wrapper;
        var options = this.options;

        wrapper.hover(function() {
          wrapper.addClass(options.name + '-hovered');
          if (options.pauseOnHover && !self.events.paused) {
            self.events.hovered = true;
            self.pauseTimer();
          }
        }, function() {
          wrapper.removeClass(options.name + '-hovered');
          if (options.pauseOnHover && self.events.hovered) {
            self.startTimer();
          }
          self.events.hovered = false;
        });
  
        this.esqueleto.selector.children("a").click(function(event) {
          // Just go to the selected slide if not reproducing
          if (self.events.playing == false) {
            if ($(this).hasClass(options.name + '-selector-current') == false) {
              var stopped = self.events.stopped;
              self.stopTimer();
              self.callSlide($(this).attr('rel'));
			  
              if (!options.pauseOnClick && !stopped) {
                self.startTimer();
              }
            }
          }
          event.preventDefault();
        });

        if (options.navigation) {
          this.esqueleto.navigation.children("a.prevNext").click(function(event) {
            if (self.events.playing == false) {
              var stopped = self.events.stopped;
              self.stopTimer();
              
              self.callSlide($(this).attr("rel"));
              if (!options.pauseOnClick && !stopped) {
                self.startTimer();
              }
            }
            event.preventDefault();
          });
        };

        if (options.control) {
          this.esqueleto.control.click($.proxy(function(event) {
            if (this.events.stopped) {
              this.startTimer();
            } else {
              this.stopTimer();
            }
            this.events.hovered = false;
            event.preventDefault();
          }, this));
        };

      },

startTimer: function() {
        if (this.options.timer) {
          // usar el timer
          
          if (this.esqueleto.clock.command == "#000000") {
            // timer barra
            this.esqueleto.clock.bar.animate({"width": "100%"}, (this.resto > 0 ? this.resto : this.options.delay), "linear", $.proxy(function() {
              this.callSlide("+1");
              this.resto = 0;
              this.esqueleto.clock.bar.css({"width": 0});
              this.startTimer();
            }, this));
            
          } else if (this.esqueleto.clock.command = "#FFFFFF") {
            // timer circular
            
            this.timer = setInterval($.proxy(function() {

                var degreeCSS = "rotate("+this.degrees+"deg)";
                this.degrees += 2;
                this.esqueleto.clock.rotator.css({
                  "-webkit-transform" : degreeCSS,
                  "-moz-transform"    : degreeCSS,
                  "-o-transform"      : degreeCSS,
                  "transform"         : degreeCSS
                });
                
                if (jQuery.browser.msie) {
                  this.esqueleto.clock.rotator.get(0).style['msTransform'] = degreeCSS;
                }

                if(this.degrees > 180) {
                  this.esqueleto.clock.rotator.addClass(this.options.name + '-timer-rotator-move');
                  this.esqueleto.clock.mask.addClass(this.options.name + '-timer-mask-move');
                }
                if(this.degrees > 360) {
                  this.esqueleto.clock.rotator.removeClass(this.options.name + '-timer-rotator-move');
                  this.esqueleto.clock.mask.removeClass(this.options.name + '-timer-mask-move');
                  this.degrees = 0;
                  this.callSlide("+1");
                  this.resto = 0;
                }

            }, this), this.options.delay/180);

          }

        } else {
          // interval using js

          if (!this.timer) {
            this.timer = setInterval($.proxy(function() {
              this.callSlide("+1");
            }, this), this.options.delay);
          }
        
        }

        if (this.options.control) {
          this.esqueleto.control.removeClass(this.options.name + '-control-play');
          this.esqueleto.control.addClass(this.options.name + '-control-pause');
        }

        this.events.paused  = false;
        this.events.stopped = false;
        
        this.element.trigger("sliderPlay");
        return this;
      },
      
      pauseTimer: function() {
        clearInterval(this.timer);
        this.timer = "";
        if (this.options.timer) {
          this.esqueleto.clock.bar.stop(true);
          var percent = 100 - (parseInt(this.esqueleto.clock.bar.width(), 10) * 100 / this.options.width);
          this.resto = this.options.delay * percent / 100;
        }
        
        this.events.paused = true;

        if (this.options.control && !this.events.hovered) {
          this.esqueleto.control.removeClass(this.options.name + '-control-pause');
          this.esqueleto.control.addClass(this.options.name + '-control-play');
        }

        this.element.trigger("sliderPause");
        return this;
      },
      
      stopTimer: function() {
        clearInterval(this.timer);
        this.timer = "";
        if (this.options.timer) {
          this.esqueleto.clock.bar.stop();
          this.resto = 0;

          if (this.esqueleto.clock.command == "#000000") {
            this.esqueleto.clock.bar.css({"width": 0});
          } else if(this.esqueleto.clock.command == "#FFFFFF") {
            this.esqueleto.clock.rotator.removeClass(this.options.name + '-timer-rotator-move');
            this.esqueleto.clock.mask.removeClass(this.options.name + '-timer-mask-move');
            this.degrees = 0;
            var degreeCSS = "rotate("+this.degrees+"deg)";
            this.esqueleto.clock.rotator.css({
              "-webkit-transform" : degreeCSS,
              "-moz-transform"    : degreeCSS,
              "-o-transform"      : degreeCSS,
              "transform"         : degreeCSS
            });

            if (jQuery.browser.msie) {
              this.esqueleto.clock.rotator.get(0).style['msTransform'] = degreeCSS;
            }
          }
        }
        
        this.events.paused  = true;
        this.events.stopped = true;
        this.events.hovered = false;

        if (this.options.control) {
          this.esqueleto.control.removeClass(this.options.name + '-control-pause');
          this.esqueleto.control.addClass(this.options.name + '-control-play');
        }

        this.element.trigger("sliderStop");
        return this;
      },

      shuffle: function(arr) {
        for(var j, x, i = arr.length; i; j = parseInt(Math.random() * i, 10), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
        return arr;
      },

      rgbToHex: function(rgb) {
        if (rgb.match(/^#[0-9A-Fa-f]{6}$/)) {
          return rgb.toUpperCase();
        }
        var rgbvals = /rgb\((.+),(.+),(.+)\)/i.exec(rgb);
        if (!rgbvals) {
          return rgb.toUpperCase();
        }
        var rval = parseInt(rgbvals[1]);
        var gval = parseInt(rgbvals[2]);
        var bval = parseInt(rgbvals[3]);
        var pad = function(value) {
          return ((value.length < 2 ? '0' : '') + value).toUpperCase();
        };
        return ('#' + pad(rval.toString(16)) + pad(gval.toString(16)) + pad(bval.toString(16))).toUpperCase();
      },

     callSlide: function(slide) {
        if (this.events.playing) {
          return false;
        }
      
        var curSlide = this.element.children("." + this.options.name + '-slide-current');
        var curSel   = this.esqueleto.selector.children("." + this.options.name + '-selector-current');
        var options  = {};
		
        if (slide == "+1") {
          var nxtSlide = curSlide.next("." + this.options.name + '-slide');
          var nxtSel   = curSel.next();
          options = {"direction": "left"};
          
          if (nxtSlide.length <= 0) {
            if (this.options.loop) {
              nxtSlide = this.element.children("." + this.options.name + '-slide:first');
              nxtSel  = this.selectores.filter("a:first");
            } else {
              this.stopTimer();
              return false;
            }
          }
       } else if (slide == "-1") {
          var nxtSlide = curSlide.prev("." + this.options.name + '-slide');
          var nxtSel   = curSel.prev("a");
          options = {"direction": "right"};
          
          if (nxtSlide.length <= 0) {
            nxtSlide = this.element.children("." + this.options.name + '-slide:last');
            nxtSel  = this.selectores.filter("a:last");
          }
        } else {

          var nxtSlide = this.element.children("." + this.options.name + '-slide-' + slide);
          var nxtSel   = this.esqueleto.selector.children("." + this.options.name + '-selector[rel=' + slide + ']');
        }
        
        if (nxtSel.hasClass(this.options.name + '-selector-current') == false) {
          this.element.trigger("sliderChange", nxtSlide);
          this.transition(curSlide, curSel, nxtSlide, nxtSel, options);
        }
        return this;
      },
      
      transition: function(curSlide, curSel, nxtSlide, nxtSel, options)
      {
        if (typeof this.options.transition === 'object' && this.options.transition) {
          this.options.transition = $.merge([], this.options.transition);
          this.transitions = this.options.transition;
          this.options.transition = "random";
        }
        
        if (nxtSlide.attr('class') === undefined || !(nxtTrans = nxtSlide.attr('class').split(" ")[0].split(this.options.name + "-trans-")[1])) {
          nxtTrans = this.options.transition;
        }
        
        if (nxtTrans === 'random') {
          // Do not use the same previous transition, always choose a new
          var tmpTrans = '';
          while (tmpTrans == this.lastTransition || tmpTrans == '') {
            tmpTrans = this.shuffle(this.transitions)[0].toLowerCase();
          }
          nxtTrans = tmpTrans;
        }
        
        nxtTrans = nxtTrans.toLowerCase();
        this.lastTransition = nxtTrans;
        
        this["trans" + nxtTrans](curSlide, curSel, nxtSlide, nxtSel, options);
        return this;
      },
      
      transfade: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        this.events.playing = true;
    // update counter with assigned rel attr
     var currentClass = this.options.name + '-slide-current';
         
     nxtSlide.addClass(function(currentClass){
     var curSlideNum = nxtSlide.attr("rel");
     $(".slide-num").html(curSlideNum);
     }),
      
        nxtSlide.fadeIn(0).addClass(this.options.name + '-slide-next');
        curSel.removeClass(this.options.name + '-selector-current');
        nxtSel.addClass(this.options.name + '-selector-current ');
      
        curSlide.stop().fadeOut(this.options.duration, $.proxy(function() {
      
          curSlide.removeClass(this.options.name + '-slide-current');
          nxtSlide.addClass(this.options.name + '-slide-current');
          nxtSlide.removeClass(this.options.name + '-slide-next');
  
          this.element.trigger("sliderTransitionFinishes", nxtSlide);
          this.events.playing = false;
        }, this));
      },
      
      transbarleft: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transbar(curSlide, curSel, nxtSlide, nxtSel, {"direction": "left"});
      },

      transbarright: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transbar(curSlide, curSel, nxtSlide, nxtSel, {"direction": "right"});
      },

      transsquarerandom: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transsquare(curSlide, curSel, nxtSlide, nxtSel, {'effect': 'random'});
      },
      
      transslip: function(curSlide, curSel, nxtSlide, nxtSel, options)
      {
        options = $.extend(true, {'direction':'left'}, options);
        this.events.playing = true;
        // update counter with assigned rel attr
         var currentClass = this.options.name + '-slide-current';
             
         nxtSlide.addClass(function(currentClass){
         var curSlideNum = nxtSlide.attr("rel");
         $(".slide-num").html(curSlideNum);
         }),
        
        nxtSlide.css({"opacity" : 1});
        curSel.removeClass(this.options.name + '-selector-current');
        nxtSel.addClass(this.options.name + '-selector-current');

        nxtSlide.addClass(this.options.name + '-slide-next');
        
        if (options.direction == "left") {
          nxtSlide.css({"left":this.options.width});
          curSlide.animate({"left": -1600}, this.options.duration);
        } else if (options.direction == "right") {
          nxtSlide.css({"left":-this.options.width});
          curSlide.animate({"left": this.options.width}, this.options.duration);
        } else if (options.direction == "top") {
          nxtSlide.css({"top":this.options.height});
          curSlide.animate({"top": -this.options.height}, this.options.duration);
        } else if (options.direction == "bottom") {
          nxtSlide.css({"top":-this.options.height});
          curSlide.animate({"top": this.options.height}, this.options.duration);
        }
        
        nxtSlide.stop().animate({"left": 0, "top": 0}, this.options.duration, $.proxy(function() {
          curSlide.removeClass(this.options.name + '-slide-current');
          curSlide.css({"left":0});
          nxtSlide.addClass(this.options.name + '-slide-current');
          nxtSlide.removeClass(this.options.name + '-slide-next');
          this.events.playing = false;
          this.element.trigger("sliderTransitionFinishes", nxtSlide);
        }, this));
      },
      
      transsliptop: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transslip(curSlide, curSel, nxtSlide, nxtSel, {"direction": "top"});
      },

      transslipbottom: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transslip(curSlide, curSel, nxtSlide, nxtSel, {"direction": "bottom"});
      },

      transslipleft: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transslip(curSlide, curSel, nxtSlide, nxtSel, {"direction": "left"});
      },

      transslipright: function(curSlide, curSel, nxtSlide, nxtSel)
      {
        return this.transslip(curSlide, curSel, nxtSlide, nxtSel, {"direction": "right"});
      }

  });

	$.fn.slideshow = function(options, callback) {
		
    if (parseFloat($.fn.jquery) > 1.2) {
      var d = {};
      this.each(function() {
        var s = $(this);
        d = s.data("slider");
		
        if (!d) {
          d = new SliderObject(this, options, callback);
          s.data("slider", d);
        }
      });
      return d;
    } else {
      throw "The jQuery version that was loaded is too old. Slider Evolution requires jQuery 1.3+";
    }
  };

  // Key Bindings
                $(document).bind('keydown', function (e) {
                  var name = $("#hero-content-slider-wrap").find('div').eq(1);
                    var key = e.keyCode;
                        if (key === 37) {
                            e.preventDefault();
                            name.slideshow().callSlide("-1");
                        } else if (key === 39) {
                            e.preventDefault();
                            name.slideshow().callSlide("+1");
                        }
                    
                });

})(jQuery);

