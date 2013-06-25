(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["marionette", "helpers/vent", "d3", "bootstrap.tooltip", "bootstrap.popover"], function(Marionette, vent, d3) {
    var NetworkView;

    return NetworkView = (function(_super) {
      var addChildren, allData, collide, curLinksData, curNodesData, filterLinks, filterNodes, force, h, links, linksG, mapNodes, nodes, nodesG, radius, setupData, svg, tick, toggleSelected, update, updateLinks, updateNodes, w;

      __extends(NetworkView, _super);

      allData = void 0;

      curNodesData = void 0;

      curLinksData = void 0;

      links = void 0;

      nodes = void 0;

      linksG = void 0;

      nodesG = void 0;

      force = void 0;

      svg = void 0;

      w = void 0;

      h = void 0;

      radius = 70;

      function NetworkView(selection, data) {
        w = parseInt($(selection).css("width"), 10);
        h = parseInt($(selection).css("height"), 10);
        this.network.call(this, selection, data);
      }

      NetworkView.prototype.network = function(selection, data) {
        allData = setupData(data);
        force = d3.layout.force().on("tick", tick).gravity(0).charge(-150).linkDistance(300).size([w, h]);
        svg = d3.select(selection).append("svg").attr("width", w).attr("height", h);
        svg.append("svg:rect").attr("width", w).attr("height", h).attr("fill", "none");
        linksG = svg.append("g").attr("id", "links");
        nodesG = svg.append("g").attr("id", "nodes");
        return update.call(this);
      };

      update = function() {
        curLinksData = filterLinks(allData.links, curNodesData);
        force.links(curLinksData);
        updateLinks();
        force.nodes(curNodesData);
        updateNodes();
        return force.start();
      };

      setupData = function(data) {
        var nodesMap;

        nodesMap = mapNodes(data.nodes);
        data.links.forEach(function(l) {
          l.source = nodesMap.get(l.source);
          return l.target = nodesMap.get(l.target);
        });
        curNodesData = data.nodes.filter(function(d) {
          if (d.id === "HTML" || d.id === "CSS" || d.id === "JavaScript") {
            return d;
          }
        });
        return data;
      };

      mapNodes = function(nodes) {
        var nodesMap;

        nodesMap = d3.map();
        nodes.forEach(function(n) {
          return nodesMap.set(n.id, n);
        });
        return nodesMap;
      };

      filterNodes = function(allNodes) {
        var filteredNodes;

        filteredNodes = allNodes.filter(function(d) {
          if (d.id === "HTML" || d.id === "CSS" || d.id === "JavaScript") {
            return d;
          }
        });
        return filteredNodes;
      };

      filterLinks = function(allLinks, curNodes) {
        curNodes = mapNodes(curNodes);
        return allLinks.filter(function(l) {
          return curNodes.get(l.source.id) && curNodes.get(l.target.id);
        });
      };

      updateLinks = function() {
        links = linksG.selectAll(".link").data(curLinksData, function(d) {
          return d.source.id + "-" + d.target.id;
        });
        links.enter().append("line").attr("class", "link");
        return links.exit().remove();
      };

      updateNodes = function() {
        var nodeEnter;

        nodes = nodesG.selectAll(".node").data(curNodesData, function(d) {
          return d.id;
        });
        nodeEnter = nodes.enter().append("g").attr("class", "node").call(force.drag);
        nodeEnter.append("circle").attr("r", 0).style("fill", "#f5f5f5").transition().duration(500).attr("r", radius - 2);
        nodeEnter.append("text").attr("id", "topic").attr("text-anchor", "middle").style("font-size", "0px").text(function(d) {
          return d.id;
        }).transition().duration(500).attr("dy", ".4em").style("font-size", "20px");
        nodeEnter.append("text").attr("id", "description").attr("text-anchor", "middle").attr("y", ".8em").style("font-size", "0px").text(function(d) {
          return d.description.what;
        });
        nodes.on("mouseover", function(d) {
          if (!d.selected) {
            d3.select(this).select("circle").transition().duration(400).style("fill", "#ff7700");
            d3.select(this).select("#topic").transition().duration(400).style("font-size", "25px");
            $(d3.select(this).select("circle")).popover({
              placement: function() {
                if (d.y > $(document).innerHeight() / 2) {
                  return "top";
                } else {
                  return "bottom";
                }
              },
              title: "What is " + d.id + "?",
              content: d.description.what,
              container: "body"
            });
            return $(d3.select(this).select("circle")).popover("show");
          }
        }).on("mouseout", function(d) {
          if (!d.selected) {
            d3.select(this).select("circle").transition().duration(400).style("fill", "#f5f5f5");
            d3.select(this).select("#topic").transition().duration(400).style("font-size", "20px");
            return $(d3.select(this).select("circle")).popover("hide");
          }
        }).on("click", function(d) {
          vent.trigger("nodeClicked", d.id);
          addChildren(d);
          return toggleSelected(d);
        });
        return nodes.exit().remove();
      };

      addChildren = function(d) {
        if (d.selected === false) {
          curNodesData.length = 0;
          curNodesData.push(d);
          allData.links.forEach(function(e, i) {
            if (e.source.id === d.id && curNodesData.indexOf(e.target) === -1) {
              return curNodesData.push(e.target);
            } else {
              if (e.target.id === d.id && curNodesData.indexOf(e.source) === -1) {
                return curNodesData.push(e.source);
              }
            }
          });
        }
        return update();
      };

      toggleSelected = function(d) {
        nodes.each(function(e) {
          if (d !== e) {
            return e.selected = false;
          }
        });
        d.selected = (d.selected ? false : true);
        return nodes.selectAll("circle").style("fill", function(e) {
          if (e.selected) {
            return "#3b9ece";
          } else {
            return "#eee";
          }
        });
      };

      tick = function(e) {
        nodes.attr("transform", function(d) {
          var damper;

          if (d.selected === true) {
            damper = 0.1;
            d.x = d.x + (w / 2 - d.x) * (damper + 0.71) * e.alpha;
            d.y = d.y + (h / 2 - d.y) * (damper + 0.71) * e.alpha;
          }
          d.x = Math.max(radius, Math.min(w - radius, d.x));
          d.y = Math.max(radius, Math.min(h - radius, d.y));
          return "translate(" + d.x + "," + d.y + ")";
        });
        return links.attr("x1", function(d) {
          return d.source.x;
        }).attr("y1", function(d) {
          return d.source.y;
        }).attr("x2", function(d) {
          return d.target.x;
        }).attr("y2", function(d) {
          return d.target.y;
        });
      };

      collide = function(alpha) {
        var quadtree;

        quadtree = d3.geom.quadtree(nodesG.selectAll("circle"));
        return function(d) {
          var nx1, nx2, ny1, ny2, padding, r;

          padding = 1;
          r = radius + padding;
          nx1 = d.x - r;
          nx2 = d.x + r;
          ny1 = d.y - r;
          ny2 = d.y + r;
          return quadtree.visit(function(quad, x1, y1, x2, y2) {
            var l, x, y;

            if (quad.point && (quad.point !== d)) {
              x = d.x - quad.point.x;
              y = d.y - quad.point.y;
              l = Math.sqrt(x * x + y * y);
              r = radius + radius + padding;
              if (l < r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
              }
            }
          });
        };
      };

      return NetworkView;

    })(Marionette.View);
  });

}).call(this);
