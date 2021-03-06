
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
    mapContext: {},
    latitude: '',
    longitude: '',
    search_org_list: [],
    list_mode: 'index_search_org',
    nearbyOrgsOnMap: [],

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
        refreshNearbyOrgsOnMap(that);
      }
    });

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [
            {
              id: 1,
              iconPath: '/images/location.png',
              position: {
                left: 20,
                top: res.windowHeight - 80,
                width: 50,
                height: 50
              },
              clickable: true
            },
            {
              id: 4,
              iconPath: '/images/position.png',
              position: {
                left: res.windowWidth / 2 - 15,
                top: res.windowHeight / 2 - 30,
                width: 30,
                height: 30
              },
              clickable: true
            }
          ]
        })
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
    this.data.mapContext = wx.createMapContext('nearby_org_map');
    this.moveToPosition();
  },
  onShow: function () {
    
    
  },

  controlTap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.moveToPosition();
        break;
      
      default: break;
    }
  },

  regionChange: function () {
    var that = this;
    this.data.mapContext.getCenterLocation({
      success: function (res) {
        console.log(res.longitude);        
        console.log(res.latitude);
        that.data.longitude = res.longitude;
        that.data.latitude = res.latitude;
        //定位后局部刷新
        //refreshNearbyOrgsOnMap(that);
      }
    });
    
  },

  moveToPosition: function (e) {
    console.log(e);
    this.data.mapContext.moveToLocation();
  },

  markerTap:function(e){
    console.log(e);
    var org = {};
    org.id = e.markerId;

    wx.request({
      url: config.PytheRestfulServerURL + '/org/query',
      data: {
        orgId: org.id,
      },
      method: 'GET',
      success: function (res) {
        org = res.data.data.organization;
        var manager = res.data.data.manager;

        wx.showModal({
          title: '机构信息',
          content: org.name + '; 地址：' + org.address
          + '; 负责人：' + manager.username + ';      点击确定查看详细',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.openLocation({
                latitude: org.latitude,
                longitude: org.longitude,
                scale: 28
              });
            }
          }
        })
      },
      fail: function(res){

      },
      complete: function(res){

      }
    });
    
  },


  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})

function refreshNearbyOrgsOnMap(the)
{
  var that = the;

  wx.request({
    url: config.PytheRestfulServerURL + '/nearbyOrgsOnMap',
    data: {
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      quantity: 100,
    },
    method: 'POST',
    success: function (res) {
      // success
      console.log(res.data.data);
      
      var results = res.data.data;
      for(var count = 0; count < results.length; count++)
      {
        that.data.nearbyOrgsOnMap[count] = results[count];
        that.data.nearbyOrgsOnMap[count].iconPath = '/images/marker.png';
        that.data.nearbyOrgsOnMap[count].width = 50;
        that.data.nearbyOrgsOnMap[count].height = 60;
      }

      that.setData({
        nearbyOrgsOnMap: that.data.nearbyOrgsOnMap,
      });

    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })

}