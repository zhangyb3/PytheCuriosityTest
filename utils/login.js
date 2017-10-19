var config = require('./config')
var user = require('./user')
var register = require('./register')
var util = require("./util");
var WXBizDataCrypt = require('./decode.js');
var app = getApp();

const LOGIN_URL = `${config.PytheRestfulServerURL}/user/login/request`;//登录服务
const FULL_USER_INFO_URL = `${config.PytheRestfulServerURL}/user/userInfo`;//获取unionid并保存在服务端
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
            
            if(registerInfo.userid == null)
            {
              wx.setStorageSync('alreadyRegister', 'no');
              console.log("register : " + wx.getStorageSync('alreadyRegister'));
              //注册
              
            }
            else
            {
              wx.setStorageSync('alreadyRegister', 'yes');
              wx.setStorageSync(user.UserID, registerInfo.userid);
            //   wx.setStorageSync(user.StudentID, registerInfo.studentid);
            //   wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
              wx.setStorageSync(user.GradeID, registerInfo.gradeid);
              wx.setStorageSync(user.UserDescription, registerInfo.description);
              wx.setStorageSync(user.UserNickName, registerInfo.username);
              wx.setStorageSync('userAvatarUrl', registerInfo.userimg);
              wx.setStorageSync(user.Status, registerInfo.status);
              wx.setStorageSync(user.StudentID, registerInfo.userid);
              wx.setStorageSync(user.TeacherID, registerInfo.userid);

                if(wx.getStorageSync(user.UserID)!='userID')
                {
                    
                    wx.setStorageSync('alreadyRegister', 'yes');
                    wx.setStorageSync('fromRegister', 'no');
                   

                }
                if(wx.getStorageSync(user.Status) == 1)
                {
                    wx.setStorageSync(user.OrganizationID, registerInfo.organizationid);
                }

            }
          },
          (userRegisterResult) => {
            console.log(userRegisterResult);
          },
        );
        console.log("已登录");
    }, () => {
        remoteLogin(success, fail)
    })
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
            // wx.setStorageSync(user.StudentID, 'studentID');
            // wx.setStorageSync(user.TeacherID, 'teacherID');
            // wx.setStorageSync(user.UserID, 'userID');

            
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
                    
                        var login_result = res.data.data;
                        
                        console.log("登录成功", res);
                        
                        wx.setStorageSync('SessionID', res.data.data.session_id);
                        wx.setStorageSync('OpenID', res.data.data.openid);
                        wx.setStorageSync('SessionKey', res.data.data.session_key);

                        console.log('openid : ' + wx.getStorageSync('OpenID'));
                        wx.getUserInfo({
                          withCredentials: true,
                          success: function(res) {},
                          fail: function(res) {},
                          complete: function(res) {

                            var session_key = wx.getStorageSync("SessionKey");
                            var encryptedData = res.encryptedData;
                            var iv = res.iv;

                            var pc = new WXBizDataCrypt(config.AppID,session_key)
                            var result = pc.decryptData(encryptedData,iv);
                            console.log(result);
                            wx.setStorageSync(user.UnionID, result.unionId);
                            
                            typeof success == "function" && success();
                          },
                        })
                                       
                          
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
        }, fail: function (res) {
            typeof fail == "function" && fail(res);
        }
    });
    

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