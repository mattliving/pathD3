define ["marionette", "helpers/vent", "bootstrap.dropdown"], 
(Marionette, vent) ->
  
  class FilterView extends Marionette.ItemView

    template: '#filterTemplate'

    ui:
      type: '#type'

    events: 
      'click .dropdown-menu li': 'filter'

    initialize: ->
      vent.on 'setTopic', (topic) =>
        @ui.type.html('All<b class="caret"></b>')

    filter: (e) ->
      e.preventDefault()
      text = $(e.currentTarget).text()
      @ui.type.html(text + '<b class="caret"></b>')
      vent.trigger 'filter', text.toLowerCase().replace(/s$/, "")
