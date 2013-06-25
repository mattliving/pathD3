(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette"], function(Marionette) {
    var Resource, _ref;

    return Resource = (function(_super) {
      __extends(Resource, _super);

      function Resource() {
        _ref = Resource.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      Resource.prototype.defaults = {
        id: null,
        path: "",
        topic: [],
        level: "",
        title: "",
        mediaType: [],
        description: "",
        link: "",
        authors: [
          {
            name: "",
            twitter: "",
            facebook: "",
            google: ""
          }
        ],
        cost: null
      };

      return Resource;

    })(Backbone.Model);
  });

}).call(this);
