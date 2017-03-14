
var config = require('./config')
var user = require('./user')
var app = getApp();

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
function sendVerificationCode(registerPhonenumber) 
{
    console.log("send verification code");
}

module.exports = {
    checkRegister : checkRegister,
    sendVerificationCode : sendVerificationCode,
}