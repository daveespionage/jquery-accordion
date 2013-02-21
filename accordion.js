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
;(function($, window, document, undefined){
    var pluginName = 'accordion',
        counter = 1,
        defaults = {
        selector : '.accordion-item',           // default accordion class
        cselector: '.accordion-content',        // default accordion content class
        activeClass: 'selected',                // default selected state class
        hideOthers: true,                       // sets accordion to close other open items when triggered
        scrollOffset: 125,                      // amount to jump when content opens
        callback: function(e,o,ident,current){}           // default callback (does nothing)
    };

    // the actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend( defaults, options );    // get our options together
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function(){
        // set up variables
        var o = this.options,
            $parent = $(this.element),
            $navitems = $(o.selector),
            $selected = $navitems.filter('.'+o.activeClass);

        // store parent selector
        o.counter = counter;

        // initialize current store
        $parent.attr("data-accordion-current",'');
        $parent.addClass('accordion_' + counter);
        counter++;


        if($selected.length > 0){
            // store which accordion we are on
            var ident = $selected.attr('data-accordion');
            $parent.attr("data-accordion-current",ident);

            if(o.hideOthers){
                // hide other accordion contents
                var notSelected = '[data-accordion!="' + ident + '"]';
                $(o.cselector + notSelected, $parent).hide();
                $(o.selector + notSelected, $parent).removeClass(o.activeClass);
            }
        }

        // add trigger event to accordions
        var $accordions = $parent.find(o.selector);
        $accordions.data('plugin_'+pluginName+'_counter',o.counter);
        $parent.data('plugin_'+pluginName+'_options',o);
        $accordions.on('click.accordion',displayAccordion);
    };


    // on click of one of accordions
    function displayAccordion(e) {
        e.preventDefault();

        var counter = $(this).data('plugin_'+pluginName+'_counter'),
            ident = $(this).attr("data-accordion"),
            $parent = $('.accordion_' + counter),
            o = $parent.data('plugin_'+pluginName+'_options'),
            current = $parent.attr("data-accordion-current"),
            $elem = $parent.find(o.cselector + '[data-accordion="' + ident + '"]'),
            $item = $parent.find(o.selector + '[data-accordion="' + ident + '"]'),
            $currelem = $parent.find(o.cselector + '[data-accordion="' + current + '"]'),
            $curritem = $parent.find(o.selector + '[data-accordion="' + current + '"]'),
            elemPosition = function (element) {
                return element.offset();
            };



        if ($elem.is(':hidden')) {
            // opening it
            // slide down content
            $elem.slideDown({
                'complete' : function() {

                    var scrollToY = elemPosition($elem).top;
                    //pop the window down a bit so we can see the content
                    window.scrollTo(0, scrollToY - o.scrollOffset);

                    // call callback
                    if($.isFunction(o.callback)) o.callback.apply(this,[e,o,ident,current]);

                }
            });
            // set item to active
            $item.addClass(o.activeClass);

            // update current selected
            $parent.attr("data-accordion-current", ident);

            // check if we should hide others
            if(o.hideOthers){
                if(ident !== current){
                    $currelem.slideUp();
                    $curritem.removeClass(o.activeClass);
                }
            }
        } else {
            // closing it
            $elem.slideUp({
                'complete' : function() {
                    // call callback
                    if($.isFunction(o.callback)) o.callback.apply(this,[e,o,ident,current]);
                }
            });
            $item.removeClass(o.activeClass);
        }
    }

    $.fn[pluginName] = function(options){
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin( this, options ));
            }
        });
    };
})(jQuery, window, document);
