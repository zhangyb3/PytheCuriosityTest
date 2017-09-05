// pages/personal/organization_management.js
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
    
    alreadySetupOrg: false,
    preview_img_url: config.PytheFileServerURL ,
    organization: {},
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
        if(res.data.status == 200)
        {
          that.data.alreadySetupOrg = true;
          that.setData({
            alreadySetupOrg: that.data.alreadySetupOrg,
          });
        }

        that.data.organization = res.data.data;
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

  changeOrgAvatar:function(e){
    console.log('change organization avatar');
    var org = e.currentTarget.dataset.org;
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res){
        // success
        console.log(res);

        var upload_avatar_local_path = res.tempFilePaths[0];
        wx.request({
          url: config.PytheRestfulServerURL + '/file/uploadFilePrepare',
          data: {
            userFilePath: upload_avatar_local_path,
            fileType: 'image',
          },
          method: 'POST', 
          success: function(res){
            // success
            console.log(res.data.data)
            var result = JSON.parse(res.data.data);
            that.data.upload_avatar_path = result.path;

           
            var parameters = {
              path : that.data.upload_avatar_path,
              fileType : 'image',
            };
            fileSys.uploadFile(upload_avatar_local_path,parameters);
            
            wx.request({
              url: config.PytheRestfulServerURL + '/org/updateAvatar',
              data: {
                orgId: org.id,
                avatar: that.data.preview_img_url + parameters.path,
              },
              method: 'GET', 
              success: function(res){
                // success
                that.data.organization.avatar = that.data.preview_img_url + parameters.path;
                that.setData({
                  organization: that.data.organization,
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
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
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