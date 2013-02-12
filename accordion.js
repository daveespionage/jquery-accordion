/**
* accordion.js
*
* This depends on
* - jQuery
* - html structure where you have
* -- accordions with an accordion-item class (default: .accordion-item, change selector in options)
* -- content with content class (default: .accordion-content, change cselector in options)
* -- data-accordion attributes in each that has the unique signifier for the pair
* Example:
*  <div class="accordions">
*   <div class="accordion-item selected" data-accordion="uniquesignifierforthepair"></div>
*   <div class="accordion-content selected" data-accordion="uniquesignifierforthepair"></div>
*   <div class="accordions-item" data-accordion="otheruniquesignifierforthepair">
*   <div class="accordion-content" data-accordion="otheruniquesignifierforthepair"></div>
*  </div>
*
* <script>
*  $('.accordions').accordions();
* </script>
*/
(function($){
    $.fn.accordion = function(options) {
        var settings = {
            selector : '.accordion-item',           // default accordion class
            cselector: '.accordion-content',        // default accordion content class
            activeClass: 'selected',                // default selected state class
            hideOthers: true,                       // sets accordion to close other open items when triggered
            scrollOffset: 125,                      // amount to jump when content opens
            callback: function(e,ident){}           // default callback (does nothing)
        };
        options = $.extend( settings, options );    // get our options together
        return this.each (function () {
            // set up variables
            var o = options,
                container = this;
            var $parent = $(o.selector).parent(),
                $navitem = $(o.selector+'.selected',container);

            if($navitem.length > 0){
                // store which accordion we are on
                var ident = $navitem.attr('data-accordion');
                $parent.attr("data-accordion-current",ident);

                // set current accordion active
                $navitem.addClass(o.activeClass);

                if(options.hideOthers){
                    // hide other accordion contents
                    var notSelected = '[data-accordion!="' + ident + '"]';
                    $(o.cselector + notSelected, container).hide();
                    $(o.selector + notSelected, container).removeClass(o.activeClass);
                }
            }

            // add trigger event to accordions
            var $accordions = $(o.selector, container);
            $accordions.on('click.accordion',{o:o},displayAccordion);
        });

        // on click of one of accordions
        function displayAccordion(e) {
            e.preventDefault();

            var $that = $(this),
                o = e.data.o;
            var $parent = $that.parent();
            var current = $parent.attr("data-accordion-current"),
                ident = $that.attr("data-accordion"),
                elemPosition = function (element) {
                    return element.offset();
                };
            var $elem = $(o.cselector + '[data-accordion="' + ident + '"]', $parent),
                $item = $(o.selector + '[data-accordion="' + ident + '"]', $parent),
                $currelem = $(o.cselector + '[data-accordion="' + current + '"]', $parent),
                $curritem = $(o.selector + '[data-accordion="' + current + '"]', $parent);
            
            if ($elem.is(':hidden')) {
                // opening it
                // slide down content
                $elem.slideDown({
                    'complete' : function() {

                        var scrollToY = elemPosition($elem).top
                        //pop the window down a bit so we can see the content
                        window.scrollTo(0, scrollToY - o.scrollOffset);

                        // call callback
                        if($.isFunction(o.callback)) o.callback.apply(this,[e,ident]);

                    }
                });
                // set item to active
                $item.addClass(o.activeClass);

                // update current selected
                $parent.attr("data-accordion-current", ident)

                // check if we should hide others
                if(o.hideOthers){
                    if(ident !== current){
                        $currelem.slideUp();
                        $curritem.removeClass(o.activeClass);
                    }
                }
            } else {
                // closing it
                $elem.slideUp();
                $item.removeClass(o.activeClass);
            }
        }
    };
})(jQuery);
