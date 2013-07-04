###
jquery.verticalScroll.js
@license under the incredibly permissive MIT License.
@Copyright © 2013 Takeharu.Oshida
###
(($) ->
  $.fn.verticalScroll = (config) ->
    defaults =
      buffer:20
      duration:50
      easing:"linear"
      height:400
      response:"nomal"
      max:0

    options = $.extend defaults, config

    switch options.response
      when "quick" then magnification = 1.0
      when "lazy" then magnification = 0.3
      else magnification = 0.5

    $(@).each (i,el) ->
      $el = $(el)
      startTouch = {}
      endTouch = {}

      getInnerHeight = ->
        ret = 0;
        $el.children().each (i,e) ->
          ret += $(e).height();
        ret;

      getTransitionProp = ->
        "-webkit-transform #{(options.duration/1000)}s #{options.easing}"

      getTransformProp = (y) ->
        "translate3d(0,#{y}px,0)"

      if options.max is 0 then options.max = getInnerHeight();
      transitionProp = getTransitionProp();
      emulate = ->
        # var matrix,currentTransformY,nextTransformY,stY,edY;
        matrix = new WebKitCSSMatrix($($el.children()[0]).css('-webkit-transform'))
        currentTransformY = matrix.f
        stY = startTouch.pageY || 0
        edY = endTouch.pageY || 0
        nextTransformY = currentTransformY + ((edY - stY)*magnification)

        #top position
        if nextTransformY > options.buffer
          nextTransformY = options.buffer
          $el.one "touchend",->
            scroll(0)

        #bottom position
        if nextTransformY < -1*(options.max + options.buffer)
          nextTransformY = -1*(options.max + options.buffer)
          $el.one "touchend",->
            scroll((-1*options.max))

        scroll(nextTransformY)

      scroll = (nextTransformY) ->
        #emulate scroll
        $el.children().each (i,e) ->
          $(e).css({
            webkitTransition:transitionProp
            webkitTransform:getTransformProp(nextTransformY)
          })

      handleTouchStart = (e) ->
        #e.preventDefault()
        startTouch = endTouch = e.originalEvent.targetTouches[0] || {}

      handleTouchMove = (e) ->
        e.preventDefault()
        endTouch = e.originalEvent.targetTouches[0] || {}
        emulate()

      handleTouchEnd = (e) ->
        #e.preventDefault()
        startTouch = endTouch = {}
        false

      initialize = ->
        $el.css({
          "height":options.height
          "overflow-y":"hidden"
        })
        .on("touchstart", handleTouchStart)
        .on("touchend", handleTouchEnd)
        .on("touchmove",handleTouchMove)

      initialize()
  @
) jQuery
