// pages/index/orgInfo.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    organization: {},
    search_teacher_list: [],
    hide_teacher_list: false,
    teacher_edit: true,
  },
  onLoad:function(parameters){

    console.log(parameters);
    this.data.organization.id = parameters.orgId;
    
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/org/queryTeachers',
      data: {
        orgId: this.data.organization.id,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        if(res.statusCode == 200)
        {
          that.setData({
            search_teacher_list: res.data.data,
          });
        }
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