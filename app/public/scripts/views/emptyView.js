(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "helpers/vent"], function(Marionette, vent) {
    var NoItemsView, _ref;

    return NoItemsView = (function(_super) {
      __extends(NoItemsView, _super);

      function NoItemsView() {
        _ref = NoItemsView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      NoItemsView.prototype.template = $("#noItemsTemplate");

      return NoItemsView;

    })(Marionette.ItemView);
  });

}).call(this);
