// Generated by CoffeeScript 1.6.2
/*
jquery.verticalScroll.js
@license under the incredibly permissive MIT License.
@Copyright © 2013 Takeharu.Oshida
*/
(function($) {
  $.fn.verticalScroll = function(config) {
    var defaults, options;

    defaults = {
      buffer: 20,
      duration: 50,
      easing: "linear",
      height: 400,
      max: 0,
      translate3d: false,
      maginification: 0.5
    };
    options = $.extend(defaults, config);
    switch (options.magnification) {
      case "quick":
        options.magnification = 1.0;
        break;
      case "lazy":
        options.magnification = 0.3;
        break;
      default:
        if (isNaN(Number(options.magnification))) {
          options.magnification = 0.5;
        }
    }
    return $(this).each(function(i, el) {
      var $el, currentTransformY, emulate, endTouch, getInnerHeight, getTransformProp, getTransitionProp, handleTouchEnd, handleTouchMove, handleTouchStart, initialize, isEndTouch, scroll, startTouch, transitionProp;

      $el = $(el);
      startTouch = {};
      endTouch = {};
      currentTransformY = 0;
      isEndTouch = false;
      getInnerHeight = function() {
        var ret;

        ret = 0;
        $el.children().each(function(i, e) {
          return ret += $(e).height();
        });
        return ret;
      };
      getTransitionProp = function() {
        return "-webkit-transform " + (options.duration / 1000) + "s " + options.easing;
      };
      getTransformProp = function(y) {
        if (options.translate3d) {
          return "translate3d(0," + y + "px,0)";
        } else {
          return "translateY(" + y + "px)";
        }
      };
      if (options.max === 0) {
        options.max = getInnerHeight();
      }
      transitionProp = getTransitionProp();
      emulate = function() {
        var edY, nextTransformY, stY;

        stY = startTouch.pageY || 0;
        edY = endTouch.pageY || 0;
        nextTransformY = currentTransformY + ((edY - stY) * options.magnification);
        if (nextTransformY > options.buffer) {
          nextTransformY = options.buffer;
          $el.one("touchend", function() {
            return scroll(0);
          });
        }
        if (nextTransformY < -1 * (options.max + options.buffer)) {
          nextTransformY = -1 * (options.max + options.buffer);
          $el.one("touchend", function() {
            return scroll(-1 * options.max);
          });
        }
        return scroll(nextTransformY);
      };
      scroll = function(nextTransformY) {
        if (isEndTouch) {
          return false;
        }
        return $el.children().each(function(i, e) {
          return $(e).css({
            webkitTransition: transitionProp,
            webkitTransform: getTransformProp(nextTransformY)
          });
        });
      };
      handleTouchStart = function(e) {
        var matrix;

        isEndTouch = false;
        matrix = new WebKitCSSMatrix($($el.children()[0]).css('-webkit-transform'));
        currentTransformY = matrix.f;
        startTouch = e.originalEvent.targetTouches[0] || {};
        return endTouch = e.originalEvent.targetTouches[0] || {};
      };
      handleTouchMove = function(e) {
        e.preventDefault();
        endTouch = e.originalEvent.targetTouches[0] || {};
        return emulate();
      };
      handleTouchEnd = function(e) {
        var lastTouch;

        if (options.magnification > 1) {
          lastTouch = e.originalEvent.changedTouches[0] || {};
          if (startTouch.pageY - endTouch.pageY > 0) {
            lastTouch.pageY = lastTouch.pageY - 10;
          } else {
            lastTouch.pageY = lastTouch.pageY + 10;
          }
          endTouch.pageY = lastTouch.pageY;
          emulate();
        }
        isEndTouch = true;
        startTouch = {};
        endTouch = {};
        return false;
      };
      initialize = function() {
        return $el.css({
          "height": options.height,
          "overflow-y": "hidden"
        }).on("touchstart", handleTouchStart).on("touchend", handleTouchEnd).on("touchmove", handleTouchMove);
      };
      return initialize();
    });
  };
  return this;
})(jQuery);
