// pages/ask/teacherInfo.js
var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    checkTeacher: {},
  },
  onLoad:function(parameters){
    
    console.log(parameters);
    this.data.checkTeacher.userId = parameters.userId;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/question/teacher/detail',
      data: {
        userId: this.data.checkTeacher.userId,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        that.data.checkTeacher = res.data.data;
        that.setData({
          checkTeacher: that.data.checkTeacher,
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });


  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})