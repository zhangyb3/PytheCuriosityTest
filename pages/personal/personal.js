// pages/personal/personal.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

var sleep = 30;
var interval = null;

Page({
  data:{
    second : 10,
    user:{
      id: null,
    },
    countdownText : '发',

    userAvatarUrl:'../../images/image_1@2x.png',
    userNickName:'9527',
  },
  onLoad:function(options){
    
    if(wx.getStorageSync('alreadyRegister')=='no')
    {
      // this.setData({hide_register_page:false});
      // this.setData({hide_index_page:true});
      wx.navigateTo({
        url: '../register/register',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
    }

  },

  
  

  selectPersonalAsk:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_ask' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectPersonalAnswer:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_answer' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectPersonalLike:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_like' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  personEditOperationPage:function(e){
    console.log('person Edit');
    wx.navigateTo({
      url: 'personal_edit',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },


  onReady:function(){
    
  },
  onShow:function(){
    // 页面显示

    register.checkRegister(
      (userRegisterResult) => {
        console.log('check register : ' + JSON.stringify(userRegisterResult));
        //如果没注册过，则注册
        var registerInfo = userRegisterResult.data.data;
        
        if(registerInfo == null)
        {
          wx.setStorageSync('alreadyRegister', 'no');
          console.log("register : " + wx.getStorageSync('alreadyRegister'));
          //注册
          
        }
        else
        {
          wx.setStorageSync('alreadyRegister', 'yes');
          wx.setStorageSync(user.UserID, registerInfo.userid);
          wx.setStorageSync(user.StudentID, registerInfo.studentid);
          wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
          wx.setStorageSync(user.GradeID, registerInfo.gradeid);
          wx.setStorageSync(user.UserDescription, registerInfo.description);
        }
      },
      (userRegisterResult) => {
        console.log(userRegisterResult);
      },
    );

    this.data.userAvatarUrl = wx.getStorageSync('userAvatarUrl');
    this.data.userNickName = wx.getStorageSync('userNickName');
    this.data.userDescription = wx.getStorageSync('UserDescription');
    this.setData({
      userAvatarUrl: this.data.userAvatarUrl,
      userNickName: this.data.userNickName,
      userDescription: this.data.userDescription,
    });
    var that = this;
    //查看赚了多少钱
    wx.request({
      url: config.PytheRestfulServerURL + '/me/earn',
      data: {
        teacherId: wx.getStorageSync(user.TeacherID),
        
      },
      method: 'GET', 
      success: function(res){
        // success
        if(res.data.data != null)
        {
          that.setData({
            teacherEarn: res.data.data,
          });
        }
        else{
          that.setData({
            teacherEarn: 0.00,
          });
        }
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    if(wx.getStorageSync('fixPersonalInfo')=='yes')
    {
      var that = this;
      register.checkRegister(
          (userRegisterResult) => {
            console.log('check register : ' + JSON.stringify(userRegisterResult));
            //如果没注册过，则注册
            var registerInfo = userRegisterResult.data.data;
            if(registerInfo == null)
            {
              wx.setStorageSync('alreadyRegister', 'no');
              console.log("register : " + wx.getStorageSync('alreadyRegister'));
              //注册
              
            }
            else
            {
              wx.setStorageSync('alreadyRegister', 'yes');
              wx.setStorageSync(user.UserID, registerInfo.userid);
              wx.setStorageSync(user.StudentID, registerInfo.studentid);
              wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
              wx.setStorageSync(user.GradeID, registerInfo.gradeid);
              wx.setStorageSync(user.UserDescription, registerInfo.description);
              wx.setStorageSync('userNickName', registerInfo.username);
              wx.setStorageSync('userAvatarUrl', registerInfo.userimg);

              wx.setStorageSync('fixPersonalInfo', 'no');

              that.data.userAvatarUrl = wx.getStorageSync('userAvatarUrl');
              that.data.userNickName = wx.getStorageSync('userNickName');
              that.data.userDescription = wx.getStorageSync('UserDescription');
              that.setData({
                userAvatarUrl: that.data.userAvatarUrl,
                userNickName: that.data.userNickName,
                userDescription: that.data.userDescription,
              });
            }
          },
          (userRegisterResult) => {
            console.log(userRegisterResult);
          },
        );
        
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  


})

