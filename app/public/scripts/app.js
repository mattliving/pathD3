(function() {
  define(["marionette", "helpers/vent", "views/sidebarLayout", "views/networkView", "views/filterView", "views/resourcesView", "collections/resources", "webdev"], function(Marionette, vent, SidebarLayout, NetworkView, FilterView, ResourcesView, Resources, webdevData) {
    var app, sidebar,
      _this = this;

    app = new Marionette.Application();
    sidebar = new SidebarLayout();
    app.addRegions({
      side: '#side',
      main: '#main'
    });
    $(window).resize(function() {
      var h, offsetTop;

      h = $('.container-fluid').height();
      offsetTop = 40;
      $('#main').css('height', h - offsetTop);
      return $('#side').css('height', h - offsetTop);
    }).resize();
    app.addInitializer(function() {
      app.side.show(sidebar);
      sidebar.filter.show(new FilterView());
      return sidebar.resources.show(new ResourcesView({
        collection: new Resources()
      }));
    });
    $('#pathDD .dropdown-menu a').click(function(e) {
      var data;

      data = {
        nodes: [],
        links: []
      };
      return $.ajax({
        url: e.target.id + '/topics'
      }).done(function(topics) {
        var d, name, network, topic, _i, _j, _len, _len1, _ref;

        for (_i = 0, _len = topics.length; _i < _len; _i++) {
          topic = topics[_i];
          data.nodes.push({
            id: topic.name,
            description: topic.description
          });
          _ref = topic.dependancies;
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            d = _ref[_j];
            for (name in d) {
              data.links.push({
                source: name,
                target: topic.name
              });
            }
          }
        }
        return network = new NetworkView('#main', data);
      });
    });
    return app;
  });

}).call(this);
