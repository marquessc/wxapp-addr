var u = require('../../utils/util.js');
var c = require('../../utils/config.js');

Page({
    data: {
        navBar: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
        toView: 'searchWrapper',
        resCitys: []
    },
    onLoad: function () {
        //console.log('search-index onLoad');
        this.initData();
    },
    initData: function () {
        var hotCitys = [];
        var cfgTopCitys = c.cityObj.topCitys;
        cfgTopCitys.forEach(function (val) {
            hotCitys.push(val.city);
        });

        this.setData({
            hotCitys: hotCitys,
            citys: c.letterCitys
        });
    },
    selectCity: function (ev) {
        var city = ev.currentTarget.dataset.city;
        console.log('selectCity',city);
        u.setLS('selectCity', city);
        u.goBack();
    },
    tapNavBar: function (ev) {
        var nav = ev.currentTarget.dataset.nav;
        this.setData({
            toView: 'ui-citys__' + nav
        })
    },
    bindInput: function (ev) {
        var val = ev.detail.value;
        var citys = c.cityObj.citys;
        var res = [];
        if (val.length > 0) {
            citys.forEach(function (obj) {
                if (obj.city.indexOf(val) > -1 || obj.pinyin.indexOf(val) > -1) {
                    res.push(obj.city);
                }
            });
        }
        this.setData({
            resCitys: res
        })
    }

});
