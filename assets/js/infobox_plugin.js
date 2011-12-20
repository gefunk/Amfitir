/**
 * @author Rahul
 */
(function ($m) {
    /* $m == Microsoft.Maps namespace */
    /* Add "Microsoft.Maps.Ext" namespace if it doesn't exist
    This is used to hold the custom InfoBox functionality */
    if (!$m.Ext) { $m.Ext = {}; }

    /* Microsoft.Maps.Ext.InfoBox extension */
    var InfoBox = $m.Ext.InfoBox = function (title, desc, map) {
        return new InfoBox.fn.init(title, desc, map);
    };
    InfoBox.prototype = InfoBox.fn = {
        init: function (title, desc, map) {
            this._element = null;
            this._title = title;
            this._description = desc;
            this._map = map;
        },
        title: function (v) {
            if (v !== undefined) {
                this._title = v;
                return this;
            }
            return this._title;
        },
        description: function (v) {
            if (v !== undefined) {
                this._description = v;
                return this;
            }
            return this._description;
        },
        show: function (e) {
            /* Get location of Pushpin */
            var loc = this.map().
                tryLocationToPixel(
                    e.target.getLocation(), Microsoft.Maps.PixelReference.page
                );
            if (this._element === null) {
                /* Create <div> to show as InfoBox */
                this._element = $('<div>').
                    addClass('infobox').
                    appendTo($(document.body)).
                    html('<h4>' + this.title() + '</h4>' + this.description());
            }
            /* Show InfoBox and set position*/
            this._element.show().css({
                position: 'absolute',
                /* offset the infobox a little */
                top: loc.y - 10,
                left: loc.x + 10
            });
        },
        hide: function () {
            /* Hide InfoBox from view */
            if (this._element !== null) {
                this._element.hide();
            }
        },
        map: function (v) {
            if (v) {
                this._map = v;
                return this;
            }
            return this._map;
        }
    };
    InfoBox.fn.init.prototype = InfoBox.fn;

    /* Microsoft.Maps.Pushpin extensions */
    (function (proto) {
        if (!proto.setInfoBox) {
            proto.setInfoBox = function (infoBox) {
                this.removeInfoBox();
                this.infobox = infoBox;
                /* attach event handlers */
                this.infoboxMouseOverHandler = $m.Events.addHandler(
                    this,
                    "mouseover",
                    function (e) {
                        infoBox.show(e);
                    });
                this.infoboxMouseOutHandler = $m.Events.addHandler(
                    this,
                    "mouseout",
                    function (e) {
                        infoBox.hide(e);
                    });
            };
        }
        if (!proto.removeInfoBox) {
            proto.removeInfoBox = function () {
                /* detach event handlers */
                $m.Events.removeHandler(this.infoboxMouseOverHandler);
                $m.Events.removeHandler(this.infoboxMouseOutHandler);
                this.infobox = null;
            };
        }
    })($m.Pushpin.prototype);
})(Microsoft.Maps);
