//app.js

import utils from '/utils/base';
import pay from '/utils/pay';
import register from '/utils/register';
import login from '/utils/login';
import fileSys from '/utils/file';

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

    
    // utils.getUserAllData((userData) => {
    //   console.log(userData);
      
    // });
    
    
    //登录
    utils.login(
      () => {
        utils.getUserInfo(
          (userInfo) => {
            console.log("已获取数据", userInfo);
            app.data.userInfo = userInfo;
          }, 
          () => {
            console.log("用户拒绝提供信息");
          }
        );
        
      }
    );
  
    wx.setStorageSync('alreadyRegister', 'no');
    //检查是否有注册过
    // register.checkRegister(
    //   (userRegisterResult) => {
    //     console.log(userRegisterResult);
    //     if(!userRegisterResult.data.data)
    //     {
    //       wx.setStorageSync('alreadyRegister', 'no');
    //       console.log("register : " + wx.getStorageSync('alreadyRegister'));
    //     }
    //   },
    //   (userRegisterResult) => {
    //     console.log(userRegisterResult);
    //   },
    // );

    // pay.orderPay();
    // pay.enchashment();

    
    
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
    userInfo:null,
    loginCode: null,
    encryptedData: null,
    iv: null,
    PYTHE_BASIC_URL:"https://www.pythe.com",
    
    PYTHE_TEST_TEMP_URL:"http://192.168.1.11:8080/mst/1",

    defaultPageSize:10,
  }
})