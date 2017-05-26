// pages/personal/personal_edit.js

var netUtil=require("../../utils/netUtil.js");
var listViewUtil=require("../../utils/listViewUtil.js");
var utils=require("../../utils/util.js");
var user = require("../../utils/user.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");

Page({
  data:{
    user:{
      username:'',
      description:'',
    },
  },
  onLoad:function(options){
    
    this.data.user.username = wx.getStorageSync('userNickName');

    
  },

  getNicknameText:function(e){
    
    this.data.user.username = e.detail.value;
    console.log(this.data.user.username);
  },

  getDescriptionText:function(e){
    console.log(e.detail.value);
    this.data.user.description = e.detail.value;
    
  },

  commitPersonalEdit:function(e){
    var that = this;

    if(that.data.user.username == '' || that.data.user.description == '')
    {
      wx.showModal({
        title: '提示',
        content: '个人信息不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            return
          }
        }
      });
    }
    else
    {
       wx.request({
        url: config.PytheRestfulServerURL + '/me/imformation',
        data: {
          userId: wx.getStorageSync(user.UserID),
          username: that.data.user.username,
          description: that.data.user.description,
        },
        method: 'GET', 
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      });

      wx.setStorageSync('fixPersonalInfo', 'yes');
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
      });
    }
   
    
  },



  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})