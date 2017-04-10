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
        gradeId: null,
        grade: '请选择',
      }, 
      
      
    ],
    grade_index:0,

    subjects: [
      {
        subjectId: null,
        subject: '请选择',
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

    countdownText : '发送验证码',
    second: 10,
  },
  
  onLoad:function(options){

    this.data.registerParams.gradeId = null;
    this.data.registerParams.subjectId = null;


    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      hide_subject_selection:true,
      hide_grade_selection:false,
      select_student:true,
      select_teacher:false
    });
    this.data.registerParams.status = 0;

    var that = this;

    var subjectRange = ['请选择'];
    //加载动态课程列表,年级列表
    wx.request({
      url: config.PytheRestfulServerURL + '/user/register/subject',
      data: {

      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data.data);
        
        for(var count = 0; count < res.data.data.data.length; count++)
        {
          
          subjectRange[count+1] = res.data.data.data[count].subject;
          that.data.subjects[count+1] = res.data.data.data[count];
          console.log(subjectRange);
        }
        
        that.setData({
          subjectRange: subjectRange,
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    var gradeRange = ['请选择'];
    //加载动态课程列表,年级列表
    wx.request({
      url: config.PytheRestfulServerURL + '/user/register/grade',
      data: {

      },
      method: 'GET', 
      success: function(res){
        // success
        console.log(res.data.data);
        
        for(var count = 0; count < res.data.data.data.length; count++)
        {
          
          gradeRange[count+1] = res.data.data.data[count].gradename;
          that.data.grades[count+1] = res.data.data.data[count];
          console.log(gradeRange);
        }
        
        that.setData({
          gradeRange: gradeRange,
        });
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    
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

    this.data.registerParams.gradeId = this.data.grades[e.detail.value].gradeid;
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

    //重发倒数
    var that = this;
    
    that.setData({  
      second: 10,  
      
      }); 
    countdown(that);
    if (second < 0) {  
      that.setData({  
        countdownText: "重发验证码"  
      });  
    }
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
        userName: wx.getStorageSync('userNickName'),
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
        if(res.data.data.userid != null)
        {
          wx.setStorageSync(user.UserID, res.data.data.userid);
          wx.setStorageSync(user.StudentID, res.data.data.studentid);
          wx.setStorageSync(user.TeacherID, res.data.data.teacherid);
          wx.setStorageSync(user.GradeID, res.data.data.gradeid);

          //判断注册是否成功，成功则返回index页面
          wx.setStorageSync('alreadyRegister', 'yes');
          wx.setStorageSync('fromRegister', 'yes');
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
        }
      },
      fail: function() {
        // fail
        wx.showModal({
            title: '提示',
            content: '登录失败，请重试',
            success: function(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              }
            }
          });
      },
      complete: function() {
        // complete
      }
    })

    
  },

  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    

    if(wx.getStorageSync(user.UserID)=='userID')
    {
      wx.setStorageSync('alreadyRegister', 'yes');
      wx.setStorageSync('fromRegister', 'yes');
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

    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },


  


})

function countdown(that) {
  var second = that.data.second ;
    if (second < 0) {  
      that.setData({  
        countdownText: "重发验证码" ,
        lock_countdown: false,
      });  
      return ;  
  } 

  var time = setTimeout(function(){  
    that.setData({  
      
      countdownText: second + '秒后可重发',
      second: second - 1  ,
      lock_countdown: true,
    });  
    countdown(that);  
    }  
    ,1000)  
}

