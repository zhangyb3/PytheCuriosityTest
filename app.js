//app.js

import utils from '/utils/base';
import pay from '/utils/pay';
import register from '/utils/register';
import login from '/utils/login';
import fileSys from '/utils/file';
import user from '/utils/user';

var app = getApp();

App({
  data:{
    userInfo : null,
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.setStorageSync('alreadyRegister', 'no');
    // utils.getUserAllData((userData) => {
    //   console.log(userData);
      
    // });
    
    wx.login({
      success: function(res){
        // success
        wx.getUserInfo({
          success: function(res){
            // success
            console.log(res.rawData);
            var rawData = JSON.parse(res.rawData);
            wx.setStorageSync('userAvatarUrl', rawData.avatarUrl);
            // wx.setStorageSync('userNickName', rawData.nickName);
          },
          fail: function() {
            // fail
          },
          complete: function() {
            // complete
          }
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    
    //登录
    utils.login(
      () => {

        utils.getUserInfo(
          (userInfo) => {
            console.log("已获取数据", userInfo);
            // app.data.userInfo = userInfo;

          }, 
          () => {
            console.log("用户拒绝提供信息");
          }
        );

        // 检查是否有注册过
        register.checkRegister(
          (userRegisterResult) => {
            console.log('check register : ' + JSON.stringify(userRegisterResult));
            //如果没注册过，则注册
            var registerInfo = userRegisterResult.data.data;
            
            if(registerInf == null)
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
      
      }
    );


  
    // wx.setStorageSync('alreadyRegister', 'yes');
    // wx.setStorageSync('alreadyRegister', 'no');


    // 检查是否有注册过
    // register.checkRegister(
    //   (userRegisterResult) => {
    //     console.log(userRegisterResult);
    //     //如果没注册过，则注册
    //     var alreadyRegister = userRegisterResult.data.data;
    //     if(!alreadyRegister)
    //     {
    //       wx.setStorageSync('alreadyRegister', 'no');
    //       console.log("register : " + wx.getStorageSync('alreadyRegister'));
    //       //注册
          
    //     }
    //     else
    //     {
    //       wx.setStorageSync('alreadyRegister', 'yes');
    //     }
    //   },
    //   (userRegisterResult) => {
    //     console.log(userRegisterResult);
    //   },
    // );


  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              that.globalData.iv=res.iv
              that.globalData.encryptedData=res.encryptedData
              console.log(res.userInfo);
              console.log(res.encryptedData);
              console.log(res.iv);
              typeof cb == "function" && cb(that.globalData.userInfo)
              
            }
          })
        }
      })
    }
  },
  getUserAllData:function(callback){
    var that = this;
    
    //调用登录接口
    wx.login({
      success: function (res) {
        console.log(res.code);
        var login_code = res.code;
        wx.getUserInfo({
          success: function (res) {
           
            var userData = {
              loginCode : login_code,
              userInfo : res.userInfo,
              encryptedData : res.encryptedData,
              iv : res.iv,
            };
            typeof callback == "function" && callback(userData)
            
          }
        })
      }
    })
    
  },
  globalData:{

    userInfo: null,
    loginCode: null,
    encryptedData: null,
    iv: null,
    PYTHE_BASIC_URL:"https://www.pythe.com",
    
    PYTHE_TEST_TEMP_URL:"http://192.168.1.11:8080/mst/1",

    defaultPageSize:10,
  }
})