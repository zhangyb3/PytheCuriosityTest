// pages/personal/organization_edit.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{

    teacherPhone:13828494261,
    organizationName:'辅导班',
    organizationId:123,

  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    wx.request({
      url: config.PytheRestfulServerURL + '/org/query',
      data: {
        orgId:this.data.organizationId,
      },
      method: 'GET',
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

  inputOrganizationName:function(e){
    console.log(e.detail.value);
    this.setData({
      organizationName:e.detail.value,
    });
  },

  inputTeacherPhone:function(e){
    console.log(e.detail.value);
    this.setData({
      teacherPhone:e.detail.value,
    });
  },

  searchTeacherByPhone:function(e){
    wx.navigateTo({
      url: 'teacher_add'+'?'
            +"teacherPhone="+this.data.teacherPhone
            +'&'
            +'organizationId='+this.data.organizationId,
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