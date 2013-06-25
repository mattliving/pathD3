(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "models/resource"], function(Marionette, Resource) {
    var Resources, _ref;

    return Resources = (function(_super) {
      __extends(Resources, _super);

      function Resources() {
        _ref = Resources.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Resources.prototype.model = Resource;

      Resources.prototype.comparator = function(model) {
        return model.get('title');
      };

      return Resources;

    })(Backbone.Collection);
  });

}).call(this);
