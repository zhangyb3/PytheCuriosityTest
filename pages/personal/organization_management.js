// pages/personal/organization_management.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

    

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var organizationId = wx.getStorageSync(user.OrganizationID);
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/org/managerQuery',
      data: {
        managerId: wx.getStorageSync(user.TeacherID),
        // managerId: 1,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        that.setData({
          organization: res.data.data,
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

  addOrganization:function(){
    console.log('add organization');
    wx.navigateTo({
      url: 'organization_edit?setupOrganization=true',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });
  },

  organizationEditOperationPage:function(e){
    console.log('go to organization edit page');
    wx.navigateTo({
      url: 'organization_edit?editOrganization=true&'
            +'orgId='+e.currentTarget.dataset.org.id,
      success: function(res){
        // success
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