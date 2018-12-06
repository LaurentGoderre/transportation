export default {
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
  datatable: false,
  width: 900
};
