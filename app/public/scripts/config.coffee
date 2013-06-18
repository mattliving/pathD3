require.config
  paths:
    backbone: "../components/backbone/backbone-min"
    underscore: "../components/underscore/underscore-min"
    jquery: "../components/jquery/jquery.min"
    d3: "../components/d3/d3.min"
    text: "../components/requirejs/require"
    marionette: "../components/marionette/lib/backbone.marionette.min"
    'backbone.wreqr': "../components/backbone.wreqr/lib/amd/backbone.wreqr.min"
    'bootstrap.dropdown': "../components/bootstrap/js/bootstrap-dropdown"
    'bootstrap.tooltip': "../components/bootstrap/js/bootstrap-tooltip"
    'bootstrap.popover': "../components/bootstrap/js/bootstrap-popover"
    bootstrap: "vendor/bootstrap"

  shim:
    jquery: 
      exports: "jQuery"
    underscore: 
      exports: "_"
    backbone: 
      deps: ["jquery", "underscore"]
      exports: "Backbone"
    marionette: 
      deps: ["jquery", "underscore", "backbone"]
      exports: "Marionette"
    d3:
      exports: "d3"
    'bootstrap.popover':
      deps: ["bootstrap.tooltip"]
    bootstrap:
      deps: ["jquery"]

require ["app", "backbone"], (App, Backbone) ->

  App.start()
  Backbone.history.start()