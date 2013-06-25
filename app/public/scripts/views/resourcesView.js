(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "helpers/vent", "views/emptyView", "views/resourceView", "bootstrap.tooltip"], function(Marionette, vent, EmptyView, ResourceView) {
    var ResourcesView, _ref;

    return ResourcesView = (function(_super) {
      __extends(ResourcesView, _super);

      function ResourcesView() {
        _ref = ResourcesView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ResourcesView.prototype.tagName = "ul";

      ResourcesView.prototype.className = "nav nav-tabs nav-stacked";

      ResourcesView.prototype.emptyView = EmptyView;

      ResourcesView.prototype.itemView = ResourceView;

      ResourcesView.prototype.initialize = function() {
        var options,
          _this = this;

        options = {
          placement: "right",
          delay: {
            show: 300,
            hide: 100
          }
        };
        vent.on("nodeClicked", function(topic) {
          vent.trigger("setTopic", topic);
          _this.collection.url = "/webdevelopment/" + topic.toLowerCase();
          return _this.collection.fetch({
            success: function() {
              _this.cached = new Backbone.Collection(_this.collection.models);
              return $("a[rel=tooltip]").tooltip(options);
            }
          });
        });
        return vent.on("filter", function(params) {
          _this.collection.reset(_this.cached.models, {
            silent: true
          });
          if ((params.mediaType != null) && params.mediaType !== "all") {
            _this.collection.models = _.filter(_this.collection.models, function(resource) {
              return _.contains(resource.get('mediaType'), params.mediaType);
            });
          }
          if ((params.level != null) && params.level !== "all") {
            _this.collection.models = _this.collection.where({
              level: params.level
            });
          }
          return _this.render();
        });
      };

      return ResourcesView;

    })(Marionette.CollectionView);
  });

}).call(this);
