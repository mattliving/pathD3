(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "helpers/vent"], function(Marionette, vent) {
    var SidebarLayout, _ref;

    return SidebarLayout = (function(_super) {
      __extends(SidebarLayout, _super);

      function SidebarLayout() {
        _ref = SidebarLayout.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      SidebarLayout.prototype.id = 'sideBarLayout';

      SidebarLayout.prototype.template = '#sidebarLayout';

      SidebarLayout.prototype.regions = {
        filter: '#filter',
        resources: '#resources'
      };

      return SidebarLayout;

    })(Marionette.Layout);
  });

}).call(this);
