//app.js
const EventProxy = require('./utils/eventproxy.js');
const api = require('./config/api');
const {
    getWXUserInfo,
    login
} = require('./utils/util');
import wechat from './utils/wechat.js'
const geo = require('./utils/geo');
const les = require('./utils/les-data');
const {saInit} = require('./utils/sa_wxmp');

const eventProxy = new EventProxy();

App({
    /*
     * system
     * */
    onLaunch: function (options) {
        console.log(options.scene);


        saInit();
    },

    onShow: function (options) {
        if (options) {
            if (options.scene == 1036) {
                this.globalData.canLaunchApp = true;
            } else if (options.scene == 1089 || options.scene == 1090) {

            } 
        } else {
            this.globalData.canLaunchApp = false;
        }
        if (this.globalData.isFirst) {
            this.globalData.isFirst = false;
            return;
        }

        var that = this;
        //判读cookie是否过期，如果过期则自动重新登录
        let expired = wx.getStorageSync('cookieExpired'),
            now = +new Date() / 1000;

        if (now > expired) {
            login().then(function (resp) {
                that.bindUserInfo(resp);
            }).catch(function (error) {
                // that.handleAuthDeny();
            });
        }
    },

    onHide: function () {

    },
    // 统一的错误日志上报
    onError: function (msg) {

    },

    getUserInfo: function (cb) {
        return getWXUserInfo();
    },

    wechat,
    // eventProxy
    eventProxy: eventProxy,
    // api 地址
    api: api,
    // 全局对象
    globalData: {
        userInfo: null,
        isLogin: false, // 是否登录了
        hasAuth: true, // 是否授权登录了
        hasLock: false, // 是否被解锁
        isFirst: true, // 是否第一次打开,
        canLaunchApp: false, //能否唤起APP
        SN_TYPE:'a65ae48e', // 唯一标识，写死（大数据埋点用的）
        saMpid: 'a65ae48e' // 2018-5-28埋点，看起来跟上面一个一样。
    },

    //
    bindUserInfo: function (resp) {
        console.log('111111',resp)
        resp = resp || {};
        var data = resp.data;
        var code = resp.code;
        //
        if (code == 0) {
            if (data && data.nickname) {
                try {
                    this.globalData.userInfo = wx.getStorageSync('userInfo');
                } catch (e) {
                    this.globalData.userInfo = {}
                }
                this.globalData.userInfo.nickname = data.nickname;
                this.globalData.userInfo.custLevel = data.custLevel || '';
                this.globalData.isLogin = true;
            } else {
                this.globalData.hasLock = true;
            }
        } else {
            this.globalData.isLogin = false;
        }
    },

    // 授权失败
    handleAuthDeny: function () {
        //this.globalData.hasAuth = false;
    }
});
