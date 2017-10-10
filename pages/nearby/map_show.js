
var listViewUtil = require("../../utils/listViewUtil.js");
var netUtil = require("../../utils/netUtil.js");
var utils = require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var fileSys = require("../../utils/file.js");

Page({
  data: {

    latitude: '',
    longitude: '',
    search_org_list: [],
    list_mode: 'index_search_org',

  },
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        // success
        console.log(res);
        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;
        console.log('now position : ' + JSON.stringify(that.data));

        that.setData({
          nowLatitude: that.data.latitude,
          nowLongitude: that.data.longitude,
        });
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {

      }
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {



  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})