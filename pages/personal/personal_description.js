// pages/personal/personal_description.js

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

    preview_img_url: config.PytheFileServerURL ,

  },
  onLoad:function(parameters){
    console.log(parameters);

    this.data.personalInfo = JSON.parse(decodeURIComponent(parameters.personalInfo)); 
    this.setData({
      personalInfo: this.data.personalInfo,
    });

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.data.personalInfo.name = wx.getStorageSync(user.UserNickName);
    this.data.personalInfo.description = wx.getStorageSync(user.UserDescription);

  },

  changeAvatar:function(e){
    console.log('change avatar');

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
              url: config.PytheRestfulServerURL + '/user/updateAvatar',
              data: {
                userId: wx.getStorageSync(user.UserID),
                avatar: that.data.preview_img_url + parameters.path,
              },
              method: 'GET', 
              success: function(res){
                // success
                wx.setStorageSync('userAvatarUrl', that.data.preview_img_url + parameters.path);
                
                that.data.personalInfo.avatar = that.data.preview_img_url + parameters.path;
                that.setData({
                  personalInfo: that.data.personalInfo,
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

  personalEditPage:function(e){
    wx.navigateTo({
      url: 'personal_edit',
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