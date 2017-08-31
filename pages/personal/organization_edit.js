// pages/personal/organization_edit.js
var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");
var editOrg;
var setupOrg;

Page({
  data:{

    teacherPhone:13828494261,
    organizationName:'辅导班',
    organizationDescription:'渣和无用改革',
    organizationAddress:'',
    organizationId:123,
    organization:{},

  },
  onLoad:function(parameters){
    editOrg = parameters.editOrganization;
    setupOrg = parameters.setupOrganization;
    this.data.organizationId = parameters.orgId;
    console.log(parameters);

    

    var that = this;
    if(setupOrg)
    {
      wx.request({
        url: config.PytheRestfulServerURL + '/teacher/setupOrg',
        data: {
          teacherId:wx.getStorageSync(user.TeacherID),
          // teacherId:2,
        },
        method: 'GET', 
        success: function(res){
          // success
          console.log(res);
          if(res.data.msg=='OK')
          {
            that.setData({
              organizationId: res.data.data.id,
            });
          }
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      });
    }
    if(editOrg)
    {

    }

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        that.setData({
          scrollHeight: res.windowHeight -300,
        });
      }
    });

    
    if(editOrg)
    {
      wx.request({
        url: config.PytheRestfulServerURL + '/org/query',
        data: {
          orgId:this.data.organizationId,
        },
        method: 'GET',
        success: function(res){
          // success
          console.log(res.data.data);
          var members = res.data.data.members;
          var organization = res.data.data.organization;
          that.data.organization = organization;
          that.data.organizationName = organization.name;
          that.data.organizationDescription = organization.description;
          that.data.organizationAddress = organization.address;
          that.setData({
            member_display_list:members,
            orgInfo:organization,
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
    

  },

  inputOrganizationName:function(e){
    console.log(e.detail.value);
    this.data.organizationName=e.detail.value;
    this.data.organization.name = e.detail.value;
  },

  inputOrganizationDescription:function(e){
    console.log(e.detail.value);
    this.data.organizationDescription=e.detail.value;
    this.data.organization.description=e.detail.value;
  },

  inputTeacherPhone:function(e){
    console.log(e.detail.value);
    this.data.teacherPhone=e.detail.value;
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

  orgDeleteTeacher:function(e){
    var teacher = e.currentTarget.dataset.teacher;
    var organization = this.data.organization;
    console.log(organization.name + ' delete teacher ' + teacher.username);
    var that = this;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/orgDelete',
      data: {
        teacherId: teacher.userid,
        orgId: organization.id,
      },
      method: 'GET', 
      success: function(res){
        // success
        if(res.data.msg=='OK')
        {
          wx.showToast({
            title: '删除老师成功',
            icon: 'success',
            duration: 1000
          });
          that.onShow();
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

  updateOrganization:function(e){
    console.log('edit org');

    var organization = this.data.organization;
    wx.request({
      url: config.PytheRestfulServerURL + '/teacher/editOrg',
      data: {
        managerId: wx.getStorageSync(user.TeacherID),
        orgName: organization.name,
        description: organization.description,
        address: organization.address,
        latitude: organization.latitude,
        longitude: organization.longitude,
      },
      method: 'POST', 
      success: function(res){
        // success
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
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    });

  },

  chooseOrgLocation:function(e){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        // success
        console.log(res);
        that.data.organization.address = res.address;
        that.data.organization.latitude = res.latitude;
        that.data.organization.longitude = res.longitude;

        var organization = that.data.organization;
        wx.request({
          url: config.PytheRestfulServerURL + '/teacher/editOrg',
          data: {
            managerId: wx.getStorageSync(user.TeacherID),
            orgName: organization.name,
            description: organization.description,
            address: organization.address,
            latitude: organization.latitude,
            longitude: organization.longitude,
          },
          method: 'POST', 
          success: function(res){
            
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
            console.log(res);
          }
        });

        that.setData({
          orgInfo: that.data.organization,
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

  checkOrgLocation:function(e){
    
    console.log("go to " + e.currentTarget.dataset.address);
    var org = e.currentTarget.dataset.org;
    console.log(org.latitude + ' , ' + org.longitude);

    wx.openLocation({
      latitude: org.latitude, // 纬度，范围为-90~90，负数表示南纬
      longitude: org.longitude, // 经度，范围为-180~180，负数表示西经
      scale: 28, // 缩放比例
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