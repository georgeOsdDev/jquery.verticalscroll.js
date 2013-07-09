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
      max:0
      translate3d:false
      maginification:0.5

    options = $.extend defaults, config

    switch options.magnification
      when "quick" then options.magnification = 1.0
      when "lazy" then options.magnification = 0.3
      else
        if isNaN(Number(options.magnification)) then options.magnification = 0.5

    $(@).each (i,el) ->
      $el = $(el)
      startTouch = {}
      endTouch = {}
      currentTransformY = 0
      isEndTouch = false

      getInnerHeight = ->
        ret = 0;
        $el.children().each (i,e) ->
          ret += $(e).height();
        ret;

      getTransitionProp = ->
        "-webkit-transform #{(options.duration/1000)}s #{options.easing}"

      getTransformProp = (y) ->
        if options.translate3d then "translate3d(0,#{y}px,0)" else "translateY(#{y}px)"

      if options.max is 0 then options.max = getInnerHeight();
      transitionProp = getTransitionProp();
      emulate = ->
        # var matrix,currentTransformY,nextTransformY,stY,edY;
        # matrix = new WebKitCSSMatrix($($el.children()[0]).css('-webkit-transform'))
        # currentTransformY = matrix.f
        stY = startTouch.pageY || 0
        edY = endTouch.pageY || 0
        nextTransformY = currentTransformY + ((edY - stY)*options.magnification)

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
        if isEndTouch then return false
        #emulate scroll
        $el.children().each (i,e) ->
          $(e).css({
            webkitTransition:transitionProp
            webkitTransform:getTransformProp(nextTransformY)
          })

      handleTouchStart = (e) ->
        #e.preventDefault()
        isEndTouch = false
        matrix = new WebKitCSSMatrix($($el.children()[0]).css('-webkit-transform'))
        currentTransformY = matrix.f
        startTouch = e.originalEvent.targetTouches[0] || {}
        endTouch = e.originalEvent.targetTouches[0] || {}

      handleTouchMove = (e) ->
        e.preventDefault()
        endTouch = e.originalEvent.targetTouches[0] || {}
        emulate()

      handleTouchEnd = (e) ->
        #e.preventDefault()
        if (options.magnification > 1)
          lastTouch = e.originalEvent.changedTouches[0] || {}
          if startTouch.pageY - endTouch.pageY > 0 then lastTouch.pageY = lastTouch.pageY-10 else lastTouch.pageY = lastTouch.pageY+10
          endTouch.pageY = lastTouch.pageY
          emulate()
        isEndTouch = true
        startTouch = {}
        endTouch = {}
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
