function util() {

}

var app = getApp();

util.prototype = {

    //数组去重
    arrUnique: function (arr) {//list去重
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    },
    // 将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // formatTime(new Date(),'yyyy-MM-dd hh:mm:ss.S'); ==> 2006-07-02 08:09:04.423
    // ormatTime(new Date(),'yyyy-M-d h:m:s.S'); ==> 2006-7-2 8:9:4.18
    formatTime: function (date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //获取秒数
    getTimestamp: function (date) {
        var timestamp;
        if ((typeof date) == 'object') {
            timestamp = Date.parse(date);
        } else if (date && (typeof date) == 'string') {
            timestamp = Date.parse(new Date(date.replace(/-/g, "/")));
        } else {
            timestamp = Date.parse(new Date());
        }
        return timestamp / 1000;
    },
    // obj对象转为json格式的字符串
    j2s: function (obj) {
        return JSON.stringify(obj);
    },
    // json格式的字符串转为obj
    s2j: function (str) {
        return JSON.parse(str);
    },
    // 获取(指定一天/当天)房源价格
    // param {Amount:xxx,SeparatePriceInfo:xxx,Date:xxx}
    getRoomPrice: function (data) {
        var price = '0';
        var roomPrice = data.Amount;
        var date = data.Date;
        if (!roomPrice) {
            roomPrice = this.s2j(roomInfo.price);
        }
        var dateStr = this.formatTime(new Date(), 'yyyy-MM-dd');
        if (date) {
            if (typeof date == 'object') {
                dateStr = this.formatTime(date, 'yyyy-MM-dd');
            } else {
                dateStr = date;
            }
        }

        var separatePrices = data.SeparatePriceInfo;
        if (separatePrices && separatePrices[dateStr] > 0) {
            price = separatePrices[dateStr];
        } else {
            if (roomPrice) {
                var dayMoney = roomPrice.DayMoney ? roomPrice.DayMoney : 0;
                var weekendMoney = roomPrice.WeekendMoney ? roomPrice.WeekendMoney : 0;
                var nowDate = new Date();
                if (date) {
                    if (typeof date == 'object') {
                        nowDate = date;
                    } else {
                        if (date && (typeof date) == 'string') {
                            nowDate = new Date(date.replace(/-/g, '/'));
                        } else {
                            nowDate = new Date(date);
                        }
                    }
                }
                if (nowDate.getDay() != 5 && nowDate.getDay() != 6) {
                    if (dayMoney > 0) {
                        price = dayMoney;
                    }
                } else {
                    if (weekendMoney > 0) {
                        price = weekendMoney;
                    } else {
                        price = dayMoney;
                    }
                }
            }
        }
        return price;
    },
    // 设置本地缓存
    setLS: function (key, val) {
        try {
            wx.setStorageSync(key, val);
        } catch (e) {
            //console.log(e);
        }
    },
    // 获取本地缓存
    getLS: function (key) {
        return wx.getStorageSync(key);
    },
    rmLS: function (key) {
        try {
            wx.removeStorageSync(key);
        } catch (e) {
            //console.log(e);
        }
    },
    //删除本地缓存
    rmAllLS: function () {
        try {
            wx.clearStorageSync();
        } catch (e) {
            //console.log(e);
        }
    },
    //跳转页面
    toPage: function (url) {
        wx.navigateTo({
            url: url
        })
    },
    //跳转页面
    closeAndToPage: function (url) {
        wx.redirectTo({
            url: url
        });
    },
    //switch跳转页面
    switchToPage: function (url) {
        wx.switchTab({
            url: url
        });
    },
    goBack: function () {
        wx.navigateBack();
    },
    //获取百分百
    getPercent: function (s) {
        var per = parseInt(s);
        return (per * 10 / 100).toFixed(1);
    },
    //字符串切割成数组
    splitToList: function (str, flag) {
        if (!!!flag) {
            flag = ',';
        }
        var res = new Array();
        if (str) {
            var list = str.split(flag);
            list.forEach(function (val) {
                if (val && val != 'null') {
                    res.push(val);
                }
            });
        }
        return res;
    },
    /**
     * 获取两天之间的日期列表
     * @param d1 日期(小)
     * @param d2 日期(大)
     * @returns {Array}
     */
    getTwoDateList: function (d1, d2) {
        var res = [];
        if (this.getTimestamp(new Date(d2.replace(/-/g, '/'))) > this.getTimestamp(new Date(d1.replace(/-/g, '/')))) {
            var d1Timstamp = this.getTimestamp(d1);
            var d2Timstamp = this.getTimestamp(d2);
            var a = (d2Timstamp - d1Timstamp) / 60 / 60 / 24 - 1;
            res.push(d1);
            for (var i = 0; i < a; i++) {
                res.push(this.formatTime(new Date((d1Timstamp + 60 * 60 * 24 * (i + 1)) * 1000), 'yyyy-MM-dd'));
            }
            res.push(d2);
            res = this.arrUnique(res);
        }
        return res;
    },
    //设置登录信息
    setLoginInfo: function (info) {
        var loginData = info.data.Data.userData;
        app.globalData.userId = loginData.userId;
        app.globalData.sessionKey = info.data.Data.sessionKey;
        app.globalData.userInfo.nickName = loginData.nickName;
        app.globalData.userInfo.gender = loginData.gender;
        app.globalData.userInfo.avatarUrl = loginData.avatar;
        app.globalData.userInfo.ageTag = loginData.ageTag;
        app.globalData.userInfo.userStatus = loginData.userStatus;
    },
    /**
     * toast
     * @param msg String
     * @param type 'success' 'loading'
     */
    toast: function (msg, type) {
        if (!type) {
            type = 'success';
        }
        wx.showToast({
            title: msg,
            icon: type,
            duration: 1000
        });
    },
    /**
     * 获取随机字符串
     * @param len 长度
     * @returns {string}
     */
    randomString: function (len) {
        len = len || 32;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var str = '';
        for (var i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },
    preViewImg: function (urls) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: urls // 需要预览的图片http链接列表
        })
    },
    arrIndexOf: function (arr, val) {
        var idx = 0;
        if (arr && val) {
            var a = arr;
            for (var i = 0; i < a.length; i++) {
                if (a[i] == val) {
                    idx = i;
                    break;
                }
            }
            return idx;
        } else {
            return idx;
        }
    }
};

util.prototype.constructor = util;
module.exports = new util();
