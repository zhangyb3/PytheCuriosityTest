

Page({
  data:{
    second: 60,

  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    countdown(this);
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})

function countdown(that) {
  var second = that.data.second ;
    if (second == 0) {  
      that.setData({  
      second: "60秒倒计时结束"  
      });  
      return ;  
  } 

  var time = setTimeout(function(){  
    that.setData({  
      second: second - 1  
    });  
    countdown(that);  
    }  
    ,1000)  
}

var config = require('../../utils/config')

const CHECK_REGISTER_URL = `${config.PytheRestfulServerURL}/user/register/is`;//校验是否注册

/**
 * 检查是否已注册
 */
var checkRegister = (success,fail) => {
    wx.request({
      url: CHECK_REGISTER_URL,
      data: {
        SessionID: wx.getStorageSync(user.SessionID),
        openid : wx.getStorageSync(user.OpenID),
        phoneNum : '12345',
      },
      method: 'GET', 
      success: function(res){
        typeof success == "function" && success(res)
      },
      fail: function() {
        typeof success == "function" && fail(res)
      },
      
    })
}

/**
 * 发送验证码
 */
var sendVerificationCode = (success,fail) => {
    
}

module.exports = {
    checkRegister : checkRegister,
    sendVerificationCode : sendVerificationCode,
}