
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
    // editType: {},
    // orgName: {},
    // orgDescription: {},
  },
  onLoad:function(parameters){
    console.log(parameters);

    this.data.editType = parameters.editType;
    this.data.orgName = parameters.orgName,
    this.data.orgDescription = parameters.orgDescription;

  },
  onReady:function(){
    // 页面渲染完成
    

  },
  onShow:function(){

    console.log(JSON.stringify(this.data));
    var editType = this.data.editType;
    switch (editType) {
      case 'editOrgName':
        {
          var leftLength = 10 - this.data.orgName.length;
          this.setData({
            original: this.data.orgName,
            wordsCountdown: leftLength,
          });
          break;
        }
      case 'editOrgDescription':
        {
          var leftLength = 100 - this.data.orgDescription.length;
          this.setData({
            original: this.data.orgDescription,
            wordsCountdown: leftLength,
          });
          break;
        }
    }

  },

  getTextInput:function(e){
    var that = this;
    console.log(e.detail.value);
    that.data.inputContent = e.detail.value;

    var editType = that.data.editType;
    switch (editType)
    {
      case 'editOrgName':
      {
        var leftLength = 10 - e.detail.value.length;
        that.setData({
          
          wordsCountdown : leftLength,
        });
        break;
      }
      case 'editOrgDescription':
      {
        var leftLength = 100 - e.detail.value.length;
        that.setData({
          
          wordsCountdown : leftLength,
        });
        break;
      }
    }
  },

  commitContent:function(e){
    var editType = this.data.editType;
    switch (editType)
    {
      case 'editOrgName':
      {
        wx.request({
          url: config.PytheRestfulServerURL + '/teacher/editOrg',
          data: {
            managerId: wx.getStorageSync(user.TeacherID),
            orgName: this.data.inputContent,

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
        break;
      }
      case 'editOrgDescription':
      {
        wx.request({
          url: config.PytheRestfulServerURL + '/teacher/editOrg',
          data: {
            managerId: wx.getStorageSync(user.TeacherID),
            
            description: this.data.inputContent,
            
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
        break;
      }
    }
  },

  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})