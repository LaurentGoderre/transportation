export default {
  aspectRatio: 19 / 3,
  alt: i18next.t("alt", {ns: "airports"}),
  filterData: function(data) {
    const obj = {};
    data.rank.map((d) => {
      const keys = Object.keys(d);
      keys.splice(keys.indexOf("year"), 1);

      for (const key of keys) {
        if (!obj[key]) {
          obj[key] = [];
        }
        obj[key].push({
          year: d.year,
          rank: d[key]
        });
      }
    });

    return Object.keys(obj).map(function(k) {
      return {
        id: k,
        dataPoints: obj[k]
      };
    });
  },
  x: {
    getValue: function(d) {
      return d.year;
    },
    getText: function(d) {
      return d.year;
    }
  },
  r: {
    inverselyProportional: true, // if true, bubble size increases with rank
    getValue: function(d) {
      return d.rank;
    }
  },
  z: { // Object { id: "total", dataPoints: (21) […] }, and similarly for id: local, id: itin
    getId: function(d) {
      return d.id;
    },
    getClass: function(...args) {
      return this.z.getId.apply(this, args);
    },
    getText: function(d) {
      return i18next.t(d.id, {ns: "area"});
    },
    getDataPoints: function(d) {
      return d.dataPoints;
    },
  },
  width: 990
};
