// Generated by CoffeeScript 1.6.2
/*
jquery.verticalScroll.js
@license under the incredibly permissive MIT License.
@Copyright © 2013 Takeharu.Oshida
*/
(function($) {
  $.fn.verticalScroll = function(config) {
    var defaults, magnification, options;

    defaults = {
      buffer: 20,
      duration: 50,
      easing: "linerar",
      height: 400,
      response: "nomal",
      max: 0
    };
    options = $.extend(defaults, config);
    switch (options.response) {
      case "quick":
        magnification = 1.0;
        break;
      case "lazy":
        magnification = 0.3;
        break;
      default:
        magnification = 0.5;
    }
    return $(this).each(function(i, el) {
      var $el, emulate, endTouch, getInnerHeight, getTransformProp, getTransitionProp, handleTouchEnd, handleTouchMove, handleTouchStart, initialize, scroll, startTouch, transitionProp;

      $el = $(el);
      startTouch = {};
      endTouch = {};
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
        return "translate3d(0," + y + "px,0)";
      };
      if (options.max === 0) {
        options.max = getInnerHeight();
      }
      transitionProp = getTransitionProp();
      emulate = function() {
        var currentTransformY, edY, matrix, nextTransformY, stY;

        matrix = new WebKitCSSMatrix($($el.children()[0]).css('-webkit-transform'));
        currentTransformY = matrix.f;
        stY = startTouch.pageY || 0;
        edY = endTouch.pageY || 0;
        nextTransformY = currentTransformY + ((edY - stY) * magnification);
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
        return $el.children().each(function(i, e) {
          return $(e).css({
            webkitTransition: transitionProp,
            webkitTransform: getTransformProp(nextTransformY)
          });
        });
      };
      handleTouchStart = function(e) {
        return startTouch = endTouch = e.originalEvent.targetTouches[0] || {};
      };
      handleTouchMove = function(e) {
        e.preventDefault();
        endTouch = e.originalEvent.targetTouches[0] || {};
        return emulate();
      };
      handleTouchEnd = function(e) {
        startTouch = endTouch = {};
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
