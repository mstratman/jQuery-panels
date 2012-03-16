/*
 * jQuery Panels - 1.0
 * https://github.com/mstratman/jQuery-panels
 *
 * Copyright 2012 Mark A. Stratman
 *
*/
/* Note this expects a very particular set of html. In this example,
 * the "SOMETHING" should be unique for each panel, and is used as
 * an identifier to match the link with the panel div.
 *
 * <div id="my_panels"> <!-- your outer container that you call panels() on. -->
 *   <ul>
 *     <li><a id="trigger_SOMETHING" href="#">Desc here</a></li>
 *   </ul>
 * </div>
 * <div id="panel_SOMETHING">
 *    contents...
 * </div>
 */
/*
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function JqueryPanels(target, options) {
    this.target = target;
    this.options = options;

    var _close_all_panels = function($this, duration) {
        $(".panel", $this.target).hide(duration);
        $(".panel_links .active", $this.target).removeClass("active");
    };

    var _panel_open = function($this, id, duration) {
        $("#panel_" + id).show(duration);
        $("#trigger_" + id).parent('li').addClass('active');
    };
    var _panel_close = function($this, id, duration) {
        $("#panel_" + id).hide(duration);
        $("#trigger_" + id).parent('li').removeClass('active');
    };
    var _panel_toggle = function($this, id, duration) {
        if ($("#panel_" + id).is(":visible")) {
            _panel_close($this, id, duration);
        } else {
            _panel_open($this, id, duration);
        }
    };

    var _init = function($this) {
        return $this.target.each(function() {
            var container = $(this);
            $("ul", container).each(function() {
                var ul = $(this);
                if (! ul.hasClass('panel_links')) {
                    ul.addClass('panel_links');
                }
                $("a", ul).each(function() {
                    var a = $(this);
                    var id = a.attr('id');
                    if (!id) { return true; }
                    id = id.replace(/^trigger_/, '');

                    if (! a.hasClass('panel_trigger')) {
                        a.addClass('panel_trigger');
                    }

                    var panel = $("#panel_" + id);
                    panel.hide();
                    if (! panel.hasClass('panel')) {
                        panel.addClass('panel');
                    }
                });
            });

            $(".panel_trigger", container).click(function() {
                var id = $(this).attr('id');
                if (id) {
                    id = id.replace(/^trigger_/, '');
                    if ($this.options.onlyAllowOneOpenPanel && $("#panel_" + id).is(":hidden")) {
                        _close_all_panels($this,"fast");
                    }
                    _panel_toggle($this, id, "fast");
                }
                return false;
            });

            $(".panel_trigger").parent('li').click(function() {
                var id = $(this).find('a').attr('id');
                if (id) {
                    id = id.replace(/^trigger_/, '');
                    if ($this.options.onlyAllowOneOpenPanel && $("#panel_" + id).is(":hidden")) {
                        _close_all_panels($this, "fast");
                    }
                    _panel_toggle($this, id, "fast");
                }
                return false;
            });

            if ($this.options.closeAllOnBodyClick) {
                $('body').click(function(){
                    _close_all_panels($this, "fast");
                    $('.panel', $this.target).click(function(event){
                        event.stopPropagation();
                        return false;
                    });
                });
            }
        });
    };

    JqueryPanels.prototype.closeAllPanels = function(duration) {
        _close_all_panels(this, duration);
    };
    JqueryPanels.prototype.panelOpen = function(id, duration) {
        _panel_open(this, id, duration);
    };
    JqueryPanels.prototype.panelClose = function(id, duration) {
        _panel_close(this, id, duration);
    };
    JqueryPanels.prototype.panelToggle = function(id, duration) {
        _panel_toggle(this, id, duration);
    };

    _init(this);
}

(function($) {
    $.fn.panels = function(method) {
        var args = arguments;
        var rv = undefined;
        var all = this.each(function() {
            var obj = $(this).data('panels');
            if (typeof method == 'object' || ! method || ! obj) {
                // TODO: why was it like this, rather than just
                //       a simple if(!obj) {...}
                var options = $.extend({}, $.fn.panels.defaults, method || {});
                if (! obj) {
                    obj = new JqueryPanels($(this), options);
                    $(this).data('panels', obj);
                }
            } else {
                if (typeof JqueryPanels.prototype[method] == "function") {
                    rv = JqueryPanels.prototype[method].apply(obj, Array.prototype.slice.call(args, 1));
                    return rv;
                } else {
                    $.error('Method ' +  method + ' does not exist in panels plugin');
                }
            }
        });
        if (rv == undefined) {
            return all;
        } else {
            return rv;
        }
    };

    $.fn.panels.defaults = {
        onlyAllowOneOpenPanel : true,
        closeAllOnBodyClick   : false
    };

})(jQuery);
