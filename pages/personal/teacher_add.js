// pages/personal/teacher_add.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    joinOrganizationId:-1,
    joinTeacherId:-1,
    joinTeacherPhone:12345678910,
    add_teacher_page:true,
  },
  onLoad:function(parameters){
    console.log(parameters);
    this.setData({
      joinOrganizationId:parameters.organizationId,
      joinTeacherPhone:parameters.teacherPhone,
    });

    searchTeacherByPhone(this);
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },

  inputTeacherPhone:function(e){
    console.log(e.detail.value);
    this.setData({
      joinTeacherPhone:e.detail.value,
    });
  },

  searchTeacherByPhone:function(e){
    var teachers = [];
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/orgQuery',
      data: {
        orgId:this.data.joinOrganizationId,
        teacherPhone:this.data.joinTeacherPhone,
      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res);
        teachers[0] = (res.data.data);
        that.setData({
          search_teacher_list:teachers,
          add_teacher_page:that.data.add_teacher_page,
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  cleanSearchTeacherPhone:function(e){
    this.setData({
      joinTeacherPhone:'',
    });
  },

  organizationAddTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    console.log(teacher);

    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/orgAdd',
      data: {
        orgId:this.data.joinOrganizationId,
        teacherId:teacher.userid,
      },
      method: 'GET',
      success: function(res){
        // success
        if(res.data.msg=='OK')
        {
          wx.showToast({
            title: '添加老师成功',
            icon: 'success',
            duration: 1000
          });
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
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

function searchTeacherByPhone(that){
  var teachers = [];
  wx.request({
    url: config.PytheRestfulServerURL + '/teacher/orgQuery',
    data: {
      orgId:that.data.joinOrganizationId,
      teacherPhone:that.data.joinTeacherPhone,
    },
    method: 'GET', 
    success: function(res){
      // success
      console.log(res);
      teachers[0] = (res.data.data);
      that.setData({
        search_teacher_list:teachers,
        add_teacher_page:that.data.add_teacher_page,
      });
    },
    fail: function(res) {
      // fail
    },
    complete: function(res) {
      // complete
    }
  });
}