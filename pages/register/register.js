var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

Page({
  data:{
    grades: [
      {
        gradeId: 161,
        name: '六年级',
      }, 
      {
        gradeId: 231,
        name: '初三', 
      },
      {
        gradeId: 331,
        name: '高三',
      },
      
      
    ],
    grade_index:0,

    subjects: [
      {
        subjectId: 161,
        name: '物理',
      }, 
      {
        subjectId: 231,
        name: '化学', 
      },
      {
        subjectId: 331,
        name: '计算机',
      },
      
      
    ],
    subject_index:0,

    hide_subject_selection:true,
    hide_grade_selection:false,
    selectStudent:true,
    selectTeacher:false,

    registerParams: {
      status: null,
      gradeId: null,
      subjectId: null,
    },
   
  },
  
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    });
    this.data.registerParams.status = 0;
  },

  selectStudent:function(e){
    console.log("学生");
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    })

    this.data.registerParams.status = 0;
  },
  selectTeacher:function(e){
    console.log("老师");
    this.setData({
      hide_subject_selection:false,
      hide_grade_selection:true,
      select_student:false,
      select_teacher:true
    })

    this.data.registerParams.status = 1;
    this.data.registerParams.gradeId = 332;
  },

  gradeChange: function(e) {
    console.log('年级', this.data.grades[e.detail.value])
    this.setData({
      grade_index: e.detail.value
    })

    this.data.registerParams.gradeId = this.data.grades[e.detail.value].gradeId;
  },
  subjectChange: function(e) {
    console.log('科目', this.data.subjects[e.detail.value])
    this.setData({
      subject_index: e.detail.value
    })

    this.data.registerParams.subjectId = this.data.subjects[e.detail.value].subjectId;
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

    //注册
    wx.request({
      url: config.PytheRestfulServerURL + '/user/register/',
      data: {
        status:this.data.registerParams.status,
        userName: wx.getStorageSync('userName'),
        phoneNum: wx.getStorageSync('registerPhoneNum'),
        verificationCode: wx.getStorageSync('verificationCode'),
        gradeId: this.data.registerParams.gradeId,
        subjecId: this.data.registerParams.subjectId,
        openId: wx.getStorageSync(user.OpenID),
        userImg: wx.getStorageSync('userAvatarUrl'),
      },
      method: 'POST',
      success: function(res){
        // success
        console.log(res);
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })

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

