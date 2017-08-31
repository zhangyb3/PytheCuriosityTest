//app.js

import base from '/utils/base';
import pay from '/utils/pay';
import register from '/utils/register';
import login from '/utils/login';
import fileSys from '/utils/file';
import user from '/utils/user';
import config from '/utils/config';

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
    try {
        wx.clearStorageSync()
    } catch(e) {
      // Do something when catch error
    }

    wx.setStorageSync('alreadyRegister', 'no');

    

  
    


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