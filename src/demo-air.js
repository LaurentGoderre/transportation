data = {};
selected = "CANADA";
var demoHack=false;

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
        console.log("data in filterData: ", data)
        return data.numMov;
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
          return i18next.t(d.key, {ns: "area"});
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
        d3.json("data/" + selected + "_numMovements.json", function(err, filedata) {
          data[selected] = filedata;
          showData();
         });
     } else {
       showData();
     }
    }
  }

  function showData() {
    //change area chart title to match selected province
    d3.select(".dashboard h4").text(i18next.t(selected, {ns: "provinces"}));

    areaChart(chart, settings, data[selected]);
  }

  function showAirport() {
    console.log("showAirport")


    console.log("settings: ", settings)

    //clear area labels
    var labelsToClear = document.getElementsByClassName("area-label");
    var i;
    for (i = 0; i < labelsToClear.length; i++) {
        labelsToClear[i].innerHTML='';
    }

    //Load total data for province corresponding to selected airport
    d3.json("data/ON_numMovements.json", function(err, filedata) {
      selected = "ON";
      data[selected] = filedata;
      showData();
    });
    //dim the ON area chart
    d3.selectAll(".data .area1").classed("inactive", true);
    d3.selectAll(".data .area2").classed("inactive", true);

    //Add airport data on top
    demoHack=true;
    d3.json("data/ON_YOW_numMovements.json", function(err, filedata) {
       selected = "ON_YOW";
       data[selected] = filedata;

      var chartOverlay = d3.select("#demo")
        .append("svg")
          .attr("id", "airport");

      areaChart(chartOverlay, settings, data[selected]);
      
    });
    console.log("data: ", data)

    
  }

  //
//   data = {};
// selected = "ca";

// onInput = function() {
//  selected = "nb"

//  if (!data[selected]) {
//    d3.json(selected + ".json", function(err, data) {
//      showData();
//    });
//  } else {
//    showData();
//  }
// }

// showData() {
//  areaChart(svg, settings, data[selected]);
// }

// d3.queue()
//  .defer(d3.json, "ca.json")
//  .await(funnction(err, caData) {
//    data.ca = caData;
//    showData();
//  });
 //

i18n.load(["src/i18n"], function() {
  d3.queue()
    // .defer(d3.json, "data/worldpop.json")
    .defer(d3.json, "data/CANADA_numMovements.json")
    .await(function(error, data) {
      areaChart(chart, settings, data);
    });
});

$(document).on("input change", function(event) {
  uiHandler(event);
});