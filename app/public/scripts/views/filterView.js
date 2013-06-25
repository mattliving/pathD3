(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "helpers/vent", "bootstrap.dropdown"], function(Marionette, vent) {
    var FilterView, _ref;

    return FilterView = (function(_super) {
      __extends(FilterView, _super);

      function FilterView() {
        _ref = FilterView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      FilterView.prototype.template = '#filterTemplate';

      FilterView.prototype.ui = {
        type: '#filterType h4',
        level: '#filterLevel h4'
      };

      FilterView.prototype.events = {
        'click #filterType .dropdown-menu li': 'filterType',
        'click #filterLevel .dropdown-menu li': 'filterLevel'
      };

      FilterView.prototype.initialize = function() {
        var _this = this;

        this.params = {};
        return vent.on('setTopic', function(topic) {
          _this.ui.type.html('Type<b class="caret"></b>');
          return _this.ui.level.html('Level<b class="caret"></b>');
        });
      };

      FilterView.prototype.filterType = function(e) {
        var text;

        e.preventDefault();
        text = $(e.currentTarget).text();
        this.params.mediaType = text.toLowerCase().replace(/s$/, "");
        vent.trigger('filter', this.params);
        if (text === "") {
          text = "Type";
        }
        return this.ui.type.html(text + '<b class="caret"></b>');
      };

      FilterView.prototype.filterLevel = function(e) {
        var text;

        e.preventDefault();
        text = $(e.currentTarget).text();
        this.params.level = text.toLowerCase().replace(/s$/, "");
        vent.trigger('filter', this.params);
        if (text === "") {
          text = "Level";
        }
        return this.ui.level.html(text + '<b class="caret"></b>');
      };

      return FilterView;

    })(Marionette.ItemView);
  });

}).call(this);
