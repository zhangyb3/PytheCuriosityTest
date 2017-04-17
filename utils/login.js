var config = require('./config')
var user = require('./user')
var register = require('./register')
var app = getApp();

const LOGIN_URL = `${config.PytheRestfulServerURL}/user/login/request`;//登录服务
const FULL_USER_INFO_URL = `${config.PytheRestfulServerURL}/userInfo`;//获取unionid并保存在服务端
const CHECK_LOGIN_URL = `${config.PytheRestfulServerURL}/user/login/session`;//校验是否登录
const CHECK_REGISTER_URL = `${config.PytheRestfulServerURL}/user/register/is`;//校验是否注册
const DECODE_USER_DATA = `${config.PytheRestfulServerURL}/user/decode`;//解密用户信息


/**
 * 登录
 */
var login = (success, fail) => {
    checkLogin(() => {
        //DO NOTHING
        // 检查是否有注册过
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
              wx.setStorageSync(user.UserNickName, registerInfo.username);
            }
          },
          (userRegisterResult) => {
            console.log(userRegisterResult);
          },
        );
        console.log("已登录");
    }, () => {
        remoteLogin(success, fail)
    });
}

/**
 * 校验登录
 */
var checkLogin = (success, fail) => {
    var sessionID = wx.getStorageSync(user.SessionID);
    if (!sessionID) {
        typeof fail == "function" && fail();
    } else {console.log(sessionID);
        wx.checkSession({
            success: function () {
                wx.request({
                    url: CHECK_LOGIN_URL,
                    data: {
                        sessionId: sessionID
                    },
                    complete: function (res) {
                        if (res.statusCode != 200) {//失败
                            typeof fail == "function" && fail();
                        } else {//成功
                            if(res.data){
                                typeof success == "function" && success();
                            }
                            
                        }
                    }
                })
            },
            fail: function () {
                typeof fail == "function" && fail();
            }
        })
    }
}



/**
 * 服务端请求登录
 */
var remoteLogin = (success, fail) => {
    //调用登录接口
    wx.login({
        success: function (loginRes) {
            console.log("登录获取code", loginRes);
            wx.setStorage({
                key: user.js_code,
                data: loginRes.code,
            });

            //SID,TID临时测试数据
            wx.setStorageSync(user.StudentID, 'studentID');
            wx.setStorageSync(user.TeacherID, 'teacherID');
            wx.setStorageSync(user.UserID, 'userID');

            wx.request({
                url: LOGIN_URL,
                data: {
                    code: loginRes.code
                    // AppID: config.AppID,
                    // AppSecret: config.AppSecret,
                },
                complete: function (res) {
                    if (res.statusCode != 200) {//失败
                        console.error("登录失败", res);
                        var data = res.data || { msg: '无法请求服务器' };
                        if (typeof fail == "function") {
                            fail();
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: data.msg,
                                showCancel: false
                            });
                        }
                    } else {//成功
                        console.log("登录成功", res);
                        wx.setStorage({
                            key: user.SessionID,
                            data: res.data.data.session_id,
                        });
                        wx.setStorage({
                            key: user.OpenID,
                            data: res.data.data.openid,
                        });
                        wx.setStorage({
                            key: user.StudentID,
                            data: 'studentID',
                        });
                        wx.setStorage({
                            key: user.TeacherID,
                            data: 'teacherID',
                        });
                        wx.setStorageSync('SessionID', res.data.data.session_id);
                        wx.setStorageSync('OpenID', res.data.data.openid);
                        wx.setStorageSync('StudentID', 'StudentID');
                        wx.setStorageSync('TeacherID', 'TeacherID');
                        console.log('openid : ' + wx.getStorageSync('OpenID'));
                        typeof success == "function" && success(res.data.data);
                    }
                }
            })
        }
    })
}

var getUserInfo = (success, fail) => {
    wx.getUserInfo({
        success: function (res) {
            console.log("获取用户信息", res);
            var userInfo = res.userInfo
            if (config.fullLogin) {//需要处理unionID
                wx.request({
                    url: FULL_USER_INFO_URL,
                    data: {
                        SessionID: wx.getStorageSync(user.SessionID),
                        encryptedData: res.encryptedData,
                        iv: res.iv
                    }, 
                    success: function (requestRes) {
                        typeof success == "function" && success(userInfo);
                    }
                });
            } else {
                typeof success == "function" && success(userInfo);
            }
        }, fail: function () {
            typeof fail == "function" && fail();
        }
    })
}




/**
 * 获取用户所有信息
 */
var getUserAllData = (success, fail) => {
    wx.login({
      success: function(res){
        // console.log(res.code);
        var login_code = res.code;
        wx.getUserInfo({
          success: function (res) {
           
            var userData = {
              loginCode : login_code,
              userInfo : res.userInfo,
              encryptedData : res.encryptedData,
              iv : res.iv,
            };
            typeof success == "function" && success(userData);
            }
        })
      },
      fail: function() {
        typeof fail == "function" && fail();
      }
    })
}

/**
 * 解密用户信息
 */
var decodeUserData = (success,fail) => {
    wx.request({
      url: DECODE_USER_DATA,
      data: {
          SessionID: wx.getStorageSync(user.SessionID),
          encryptedData: wx.getStorageSync(user.encryptedData),
          iv: wx.getStorageSync(user.iv),
      },
      method: 'POST', 
      success: function(res){
        typeof success == "function" && success(res);
      },
      fail: function() {
        typeof fail == "function" && fail();
      },
      
    })
}

module.exports = {
    login: login,
    checkLogin: checkLogin,
    getUserInfo: getUserInfo,
    
    getUserAllData : getUserAllData,
    decodeUserData : decodeUserData,
    alreadyRegister : 'no',
}