//index.js
//获取应用实例
var app = getApp();
var u = require('../../utils/util.js');
var cityUtil = require('../../utils/city.js');
Page({
    data: {},
    onLoad: function () {
        console.log('onLoad');
        var that = this;
        cityUtil.init(that);
        var city = this.data.city;
        var oldPro = '-请选择-';
        var oldCity = '-请选择-';
        var oldArea = '-请选择-';
        var oldProIdx = 0;
        var oldCityIdx = 0;
        var oldAreaIdx = 0;
        if (oldPro) {
            oldProIdx = u.arrIndexOf(city.province, oldPro);
            oldCityIdx = u.arrIndexOf(city.city[oldPro], oldCity);
            oldAreaIdx = u.arrIndexOf(city.district[oldCity], oldArea);
        }
        this.setData({
            'city.provinceIndex': oldProIdx,
            'city.cityIndex': oldCityIdx,
            'city.districtIndex': oldAreaIdx,
            'city.selectedProvince': oldPro,
            'city.selectedCity': oldCity,
            'city.selectedDistrct': oldArea
        });
    },
    onShow:function () {
        var sCity = u.getLS('selectCity');
        if (sCity) {
            this.setData({
                sCity: sCity
            })
        }
    },
    tapList: function () {
        u.toPage('/pages/selectCity/selectCity');
    }
});
