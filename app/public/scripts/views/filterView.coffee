define ["marionette", "helpers/vent", "bootstrap.dropdown"], 
(Marionette, vent) ->
  
  class FilterView extends Marionette.ItemView

    template: '#filterTemplate'

    ui:
      type: '#filterType h4'
      level: '#filterLevel h4'

    events: 
      'click #filterType .dropdown-menu li': 'filterType'
      'click #filterLevel .dropdown-menu li': 'filterLevel'

    initialize: ->
      @params = {}

      vent.on 'setTopic', (topic) =>
        @ui.type.html('Type<b class="caret"></b>')
        @ui.level.html('Level<b class="caret"></b>')

    filterType: (e) ->
      e.preventDefault()
      text = $(e.currentTarget).text()
      @params.mediaType = text.toLowerCase().replace(/s$/, "")
      vent.trigger 'filter', @params
      if text is "" then text = "Type"
      @ui.type.html(text + '<b class="caret"></b>')

    filterLevel: (e) ->
      e.preventDefault()
      text = $(e.currentTarget).text()
      @params.level = text.toLowerCase().replace(/s$/, "")
      vent.trigger 'filter', @params
      if text is "" then text = "Level"
      @ui.level.html(text + '<b class="caret"></b>')
