

Page({
  data:{
    grades: ['六年级', '初三', '高三'],
    grade_index:0,
    subjects: ['物理', '化学', '计算机'],
    subject_index:0,
    hide_subject_selection:false,
    hide_grade_selection:false,
    selectStudent:false,
    selectTeacher:false,

  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
  },

  selectStudent:function(e){
    console.log("学生");
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    })
  },
  selectTeacher:function(e){
    console.log("老师");
    this.setData({
      hide_subject_selection:false,
      hide_grade_selection:true,
      select_student:false,
      select_teacher:true
    })
  },

  gradeChange: function(e) {
    console.log('年级', this.data.grades[e.detail.value])
    this.setData({
      grade_index: e.detail.value
    })
  },
  subjectChange: function(e) {
    console.log('科目', this.data.subjects[e.detail.value])
    this.setData({
      subject_index: e.detail.value
    })
  },

  //注册
  phoneNumberInput: function(e) {
    var registerPhoneNum = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('registerPhoneNum', registerPhoneNum);
  },
  sendVerificationCode:function(res) {
    console.log(wx.getStorageSync('registerPhoneNum'));
    register.sendVerificationCode(wx.getStorageSync('registerPhoneNum'));
  },
  verificationCodeInput: function(e) {
    var verificationCode = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('verificationCode', verificationCode);
  },

  registerToMainPage:function(e){
    //判断注册是否成功，成功则返回index页面
    wx.setStorageSync('alreadyRegister', 'yes');
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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