data = {};
selected = "CANADA";
var numCommodities = 64; //for testing with radar

/* globals areaChart */
var chart = d3.select(".data")
    .append("svg")
      .attr("id", "demo"),
  id = "year",
  settings = {
      alt: i18next.t("alt", {ns: "area"}),
      datatable: {
        title: i18next.t("datatableTitle", {ns: "area"})
      },
      filterData: function(data) {
        return data.tonnage;
      },
      x: {

        getValue: function(d) {
          return new Date(d[id] + "-01");
        },
        getText: function(d) {
          return d[id];
        },
        ticks: 7
      },

      y: {
        label: i18next.t("y_label", {ns: "area"}),
        getValue: function(d, key) {
          if (typeof d[key] === 'string' || d[key] instanceof String) {
            return 0;
          }
          else return d[key] * 1.0/ 1000;
        },
        getText: function(d, key) {
          if (typeof d[key] === 'string' || d[key] instanceof String) {
            return d[key];
          }
          else return d[key] * 1.0/ 1000;
        }
      },

      z: {
        label: i18next.t("z_label", {ns: "area"}),
        getId: function(d) {
          return d.key;
        },
        getKeys: function(object) {
          var sett = this,
          keys = Object.keys(object[0]);
          keys.splice(keys.indexOf(id),1);
          if (keys.indexOf(sett.y.totalProperty) !== -1) {
            keys.splice(keys.indexOf(sett.y.totalProperty),1);
          }
          return keys;
        },
        getClass: function(d) {
          return this.z.getId.apply(this, arguments);
        },
        getText: function(d) {
          return i18next.t(d.key, {ns: "regions"});
        }
      },
      width: 900
    };

  uiHandler = function(event) {
    if (event.target.id === "groups"){
      selected = document.getElementById("groups").value;
      var labelsToClear = document.getElementsByClassName("area-label");
      var i;
      for (i = 0; i < labelsToClear.length; i++) {
          labelsToClear[i].innerHTML='';
      }
      if (!data[selected]) {
        d3.json("data/rail_meat_origATR_ON_BC_dest" + selected + ".json", function(err, filedata) {
          data[selected] = filedata;
          showData();
         });
      } else {
       showData();
      }
    }

   
  }

  function showData() {
    areaChart(chart, settings, data[selected]);
  }

  function showRadar() {
    //Adapted from http://bl.ocks.org/jeffthink/1630683
    var series, 
      hours,
      minVal,
      maxVal,
      w = 700,
      h = 700,
      vizPadding = {
          top: 10,
          right: 50,
          bottom: 15,
          left: 50
      },
      radius,
      radiusLength,
      ruleColor = "#CCC";

      loadData();
      buildBase();
      setScales();
      addAxes();
      draw();

      function loadData() {
        var randomFromTo = function randomFromTo(from, to){
           return Math.floor(Math.random() * (to - from + 1) + from);
        };

        series = [
          [],
          []
        ];

        hours = [];

        // var numCommodities = 64
        for (i = 0; i < numCommodities; i += 1) {
            series[0][i] = randomFromTo(0,20);
            series[1][i] = randomFromTo(5,15);
            hours[i] = i; //in case we want to do different formatting
        }

        mergedArr = series[0].concat(series[1]);

        minVal = d3.min(mergedArr);
        maxVal = d3.max(mergedArr);
        //give 25% of range as buffer to top
        maxVal = maxVal + ((maxVal - minVal) * 0.25);
        minVal = 0;

        //to complete the radial lines
        for (i = 0; i < series.length; i += 1) {
            series[i].push(series[i][0]);
        }      
    }

    function buildBase() {
        var viz = d3.select("#commgrid")
            .append('svg:svg')
            .attr('width', w)
            .attr('height', h)
            .attr('class', 'vizSvg');

        viz.append("svg:rect")
            .attr('id', 'axis-separator')
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 0)
            .attr('width', 0)
            .attr('height', 0);
        
        vizBody = viz.append("svg:g")
            .attr('id', 'body');
    }

    function setScales () {
      var heightCircleConstraint,
          widthCircleConstraint,
          circleConstraint,
          centerXPos,
          centerYPos;

      //need a circle so find constraining dimension
      heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
      widthCircleConstraint = w - vizPadding.left - vizPadding.right;
      circleConstraint = d3.min([
          heightCircleConstraint, widthCircleConstraint]);

      radius = d3.scaleLinear().domain([minVal, maxVal])
          .range([0, (circleConstraint / 2)]);
      radiusLength = radius(maxVal);

      //attach everything to the group that is centered around middle
      centerXPos = widthCircleConstraint / 2 + vizPadding.left;
      centerYPos = heightCircleConstraint / 2 + vizPadding.top;

      vizBody.attr("transform",
          "translate(" + centerXPos + ", " + centerYPos + ")");
    }

    function addAxes() {
      var radialTicks = radius.ticks(5),
          i,
          circleAxes,
          lineAxes;

      vizBody.selectAll('.circle-ticks').remove();
      vizBody.selectAll('.line-ticks').remove();

      circleAxes = vizBody.selectAll('.circle-ticks')
          .data(radialTicks)
          .enter().append('svg:g')
          .attr("class", "circle-ticks")
          .style("fill", "#3d3d3d")
          .style("font-size", "14px");

      circleAxes.append("svg:circle")
          .attr("r", function (d, i) {
              return radius(d);
          })
          .attr("class", "circle")
          .style("stroke", ruleColor)
          .style("fill", "none");

      circleAxes.append("svg:text")
          .attr("text-anchor", "middle")
          .attr("dy", function (d) {
              return -1 * radius(d);
          })
          .text(String);

      lineAxes = vizBody.selectAll('.line-ticks')
          .data(hours)
          .enter().append('svg:g')
          .attr("transform", function (d, i) {
              return "rotate(" + ((i / hours.length * 360) - 90) +
                  ")translate(" + radius(maxVal) + ")";
          })
          .attr("class", "line-ticks");

      lineAxes.append('svg:line')
          .attr("x2", -1 * radius(maxVal))
          .style("stroke", ruleColor)
          .style("fill", "none");

      lineAxes.append('svg:text')
          .text(String)
          .attr("text-anchor", "middle")
          .style("fill", "#3d3d3d")
          .style("font-size", "14px")
          .attr("transform", function (d, i) {
              return (i / hours.length * 360) < 180 ? null : "rotate(180)";
          });
    }

    function draw  () {
      var groups,
          lines,
          linesToUpdate;

      highlightedDotSize = 4;

      groups = vizBody.selectAll('.series')
          .data(series);
      groups.enter().append("svg:g")
          .attr('class', 'series')
          .style('fill', function (d, i) {
              if(i === 0){
                return "#96A8B2";
              } 
              // else {
              //   return "#024571";
              // }
          })
          .style('stroke', function (d, i) {
              if(i === 0){
                return "#96A8B2";
              } 
              // else {
              //   return "#024571";
              // }
          });
      groups.exit().remove();

      // lines = groups.append('svg:path')
      // lines = groups.enter().append('svg:path')
      lines = d3.selectAll(".series").append("svg:path")
          .attr("class", "line")
          // .attr("d", d3.svg.line.radial()
          .attr("d", d3.radialLine()
              .radius(function (d) {
                  return 0;
              })
              .angle(function (d, i) {
                  if (i === numCommodities) {
                      i = 0;
                  } //close the line
                  return (i / numCommodities) * 2 * Math.PI;
              }))
          .style("stroke-width", 3)
          .style("fill", "none");

      // lines.attr("d", d3.svg.line.radial()
      lines.attr("d", d3.radialLine()
          .radius(function (d) {
              return radius(d);
          })
          .angle(function (d, i) {
              if (i === numCommodities) {
                  i = 0;
              } //close the line
              return (i / numCommodities) * 2 * Math.PI;
          }));
    }

  }
 

i18n.load(["src/i18n"], function() {
  d3.queue()
    .defer(d3.json, "data/rail_meat_origATR_ON_BC_destQC.json")
    .await(function(error, data) {          
      showRadar();
    });
});

$(document).on("input change", function(event) {
  uiHandler(event);
});