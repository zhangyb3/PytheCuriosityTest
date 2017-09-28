
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var fileSys = require("../../utils/file.js");

Page({
  data:{

    latitude: '',
    longitude: '',

  },
  onLoad:function(parameters){
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function(res){
        // success
        console.log(res);
        that.data.latitude = res.latitude;
        that.data.longitude = res.longitude;
        console.log('now position : ' + JSON.stringify(that.data));
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete

        //加载附近机构列表
        var searchParameters = {
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          userId: wx.getStorageSync(user.UserID),
          pageNum: 1,
          pageSize: 10,

          query: '',
          subjectId: -1,
          userId: -1,
        };
        that.setData({
          search_org_list: [],
        });

        listViewUtil.loadList(that,'index_search_org',config.PytheRestfulServerURL,
        "/index/search/organization",
        10,
        searchParameters,
        function (netData){
          //取出返回结果的列表
          return netData.data;
        },
        function(item){
        
        },
        {},
        'GET'
        );

      }
    });

    
  },

  showOrgOnMap:function(e){
    wx.navigateTo({
      url: 'map_show',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})