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
    user: {},
    org: {},
  },
  onLoad:function(parameters){

    console.log(parameters);
    this.data.organization.id = parameters.orgId;
    this.data.organization.managerId = parameters.orgManagerId;
    this.data.user.teacherId = wx.getStorageSync(user.TeacherID);
    this.setData({
      user: this.data.user,
      org: this.data.organization,
    });
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
        if(res.data.status == 200)
        {
          that.setData({
            search_teacher_list: res.data.data,
          });
        }
        else
        {
          console.log("400");
          that.setData({
            search_teacher_list: [],
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

  cancelTeacherFromOrg:function(e){
    var that = this;
    var teacher = e.currentTarget.dataset.teacher;
    console.log('cancel teacher ' + teacher.username + ' from org ' + this.data.organization.id);

    if(this.data.org.managerId == wx.getStorageSync(user.TeacherID))
    {
      wx.showModal({
        title: '提示',
        content: '确定解除该教师？',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: config.PytheRestfulServerURL + '/teacher/orgDelete',
              data: {
                orgId: that.data.organization.id,
                teacherId: teacher.userid,
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
                that.onShow();
              }
            })
          } 
        }
      });
    }
    else
    {
      wx.showModal({
        title: '提示',
        content: '确定退出该机构？',
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: config.PytheRestfulServerURL + '/teacher/orgDelete',
              data: {
                orgId: that.data.organization.id,
                teacherId: teacher.userid,
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
                that.onShow();
              }
            })
          } 
        }
      });
    }
   
  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})