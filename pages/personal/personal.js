// pages/personal/personal.js

var listViewUtil=require("../../utils/listViewUtil.js");
var netUtil=require("../../utils/netUtil.js");
var utils=require("../../utils/util.js");
var register = require("../../utils/register.js");
var config = require("../../utils/config.js");
var base = require("../../utils/base.js");
var user = require("../../utils/user.js");

var sleep = 30;
var interval = null;

Page({
  data:{
    second : 10,
    user:{
      id: null,
    },
    countdownText : '发',

    userAvatarUrl:'',
    userNickName:'',
    userStatus: 0,

    hide_register_lock_cover: false,

    hide_login:true,
    select_student:true,
    select_teacher:false,

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

    organization: {},

    countdownText : '发送验证码',
    second: 60,
  },
  onLoad:function(options){

    //先判断是否已注册
    // if(wx.getStorageSync('alreadyRegister') == 'no')
    // {
    //   this.setData({
    //     hide_login: false,
    //   });
    //   loadingSelections.call(this);
    // }
    

      this.setData({
        hide_register_lock_cover: false,
      });
    
    
    
      this.setData({
        hide_register_lock_cover: true,
      });
    

  },

  
  

  selectPersonalAsk:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_ask' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectPersonalAnswer:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_answer' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectPersonalLike:function(result){
    var parametersJSON = this.data.user;
    var parametersString = netUtil.json2Form(parametersJSON);
    wx.navigateTo({
      url: 'personal_like' + '?' + parametersString,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectOrganizationManagement:function(e){
    console.log('personal organization management');
    wx.navigateTo({
      url: 'organization_manage' ,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  selectBalanceRules:function(e){
    console.log('person Balance rules');
    wx.navigateTo({
      url: 'personal_balance_rules',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

    selectAboutUs:function(e){
    console.log('person aboutUS');
    wx.navigateTo({
      url: 'personal_about_us',
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  },

  personalDescriptionPage:function(e){
    console.log('person description');

    var personalInfo = {
      id: wx.getStorageSync(user.UserID),
      name: wx.getStorageSync(user.UserNickName),
      description: wx.getStorageSync(user.UserDescription),
      avatar: wx.getStorageSync('userAvatarUrl'),
      orgId: wx.getStorageSync(user.OrganizationID),
      orgName: this.data.organization.name,
    };

    wx.navigateTo({
      url: 'personal_description?personalInfo='+JSON.stringify(personalInfo),
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
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

    this.data.registerParams.subjectId = this.data.subjects[e.detail.value].subjectid;
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
      second: 60,  
      lock_countdown: true,
      }); 
    countdown(that);
    if (second < 0) {  
      that.setData({  
        countdownText: "重发验证码"  ,
        lock_countdown: false,
      });  
    }
  },

  verificationCodeInput: function(e) {
    var verificationCode = e.detail.value;
    console.log(e.detail.value);
    wx.setStorageSync('verificationCode', verificationCode);
  },

  registerToMainPage:function(e){
    var that = this;
    if(that.data.registerParams.status == 0 && that.data.registerParams.gradeId == null)
    {
      wx.showModal({
        title: '提示',
        content: '年级必填',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if( that.data.registerParams.status == 1 && that.data.registerParams.subjectId == null)
    {
      wx.showModal({
        title: '提示',
        content: '科目必填',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }
    else if((that.data.registerParams.status == 1 && that.data.registerParams.subjectId != null) || (that.data.registerParams.status == 0 && that.data.registerParams.gradeId != null))
    {
      //注册
      that.setData({  
        lock_register: true,
      });

      wx.request({
        url: config.PytheRestfulServerURL + '/user/register/',
        data: {
          status:this.data.registerParams.status,
          userName: wx.getStorageSync('wxNickName'),
          phoneNum: wx.getStorageSync('registerPhoneNum'),
          verificationCode: wx.getStorageSync('verificationCode'),
          gradeId: this.data.registerParams.gradeId,
          subjectId: this.data.registerParams.subjectId,
          openId: wx.getStorageSync(user.OpenID),
          userImg: wx.getStorageSync('userAvatarUrl'),
        },
        method: 'POST',
        success: function(res){
          // success
          console.log(res);
          if(res.data.data==null)
          {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
            
            that.setData({  
              lock_register: false,
            });
          }
          else if(res.data.data.userid != null)
          {
            wx.setStorageSync(user.UserID, res.data.data.userid);
            wx.setStorageSync(user.StudentID, res.data.data.studentid);
            wx.setStorageSync(user.TeacherID, res.data.data.teacherid);
            wx.setStorageSync(user.GradeID, res.data.data.gradeid);
            wx.setStorageSync(user.UserNickName, res.data.data.username);
            wx.setStorageSync(user.UserDescription, res.data.data.description);

            //判断注册是否成功，成功则返回index页面
            wx.setStorageSync('alreadyRegister', 'yes');
            that.setData({
              hide_login:true,
            });
            that.setData({
              userAvatarUrl: wx.getStorageSync('userAvatarUrl'),
              userNickName: wx.getStorageSync(user.UserNickName),
              userDescription: wx.getStorageSync(user.UserDescription),
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

          that.setData({  
            lock_register: false,
          });
        },
        
      });
    }
  },

  checkPersonalBill:function(e){

    if(wx.getStorageSync(user.Status) == 1)
    {
      wx.navigateTo({
        url: 'teacher_bill',
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    }
    if(wx.getStorageSync(user.Status) == 0)
    {
      wx.navigateTo({
        url: 'student_bill',
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
    }

  },



  onReady:function(){
    
  },
  onShow:function(){
    // 页面显示
    
    register.checkRegister(
      (userRegisterResult) => {
        console.log('check register : ' + JSON.stringify(userRegisterResult));
        //如果没注册过，则注册
        var registerInfo = userRegisterResult.data.data;
        console.log(registerInfo);
        if( wx.getStorageSync('alreadyRegister') == 'no' || registerInfo.userid == null )
        {
          wx.setStorageSync('alreadyRegister', 'no');
          console.log("register : " + wx.getStorageSync('alreadyRegister'));
          //注册
          this.setData({
            hide_login: false,
          });
          loadingSelections(this);
        }
        else
        {
          wx.setStorageSync('alreadyRegister', 'yes');
          wx.setStorageSync(user.UserID, registerInfo.userid);
          // wx.setStorageSync(user.StudentID, registerInfo.studentid);
          // wx.setStorageSync(user.TeacherID, registerInfo.teacherid);
          wx.setStorageSync(user.GradeID, registerInfo.gradeid);
          wx.setStorageSync(user.UserDescription, registerInfo.description);
          wx.setStorageSync('userAvatarUrl', registerInfo.userimg);

          wx.setStorageSync(user.StudentID, registerInfo.userid);
          wx.setStorageSync(user.TeacherID, registerInfo.userid);

          //自动更新头像
          // if(wx.getStorageSync('avatarUrl') != wx.getStorageSync('userAvatarUrl'))
          // {
          //   var that = this;
          //   wx.request({
          //     url: config.PytheRestfulServerURL + '/user/updateAvatar',
          //     data: {
          //       userId: wx.getStorageSync(user.UserID),
          //       avatar: wx.getStorageSync('avatarUrl'),
          //     },
          //     method: 'GET', 
          //     success: function(res){
          //       // success
          //       wx.setStorageSync('userAvatarUrl', wx.getStorageSync('avatarUrl'));
          //     },
          //     fail: function(res) {
          //       // fail
          //     },
          //     complete: function(res) {
          //       // complete
          //       that.onShow();
          //     }
          //   })
          // }

        }
      },
      (userRegisterResult) => {
        console.log(userRegisterResult);
      },
    );

    this.data.userAvatarUrl = wx.getStorageSync('userAvatarUrl');
    this.data.userNickName = wx.getStorageSync('UserNickName');
    this.data.userDescription = wx.getStorageSync('UserDescription');
    this.data.userStatus = wx.getStorageSync('Status');
    this.setData({
      userAvatarUrl: this.data.userAvatarUrl,
      userNickName: this.data.userNickName,
      userDescription: this.data.userDescription,
      userStatus: this.data.userStatus,
    });
    var that = this;
    //查看赚了多少钱
    wx.request({
      url: config.PytheRestfulServerURL + '/me/earn',
      data: {
        teacherId: wx.getStorageSync(user.TeacherID),
        
      },
      method: 'GET', 
      success: function(res){
        // success
        if(res.data.data != null)
        {
          that.setData({
            teacherEarn: res.data.data,
          });
        }
        else{
          that.setData({
            teacherEarn: 0.00,
          });
        }
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    wx.request({
      url: config.PytheRestfulServerURL + '/org/query',
      data: {
        orgId: wx.getStorageSync(user.OrganizationID),
        
      },
      method: 'GET', 
      success: function(res){
        // success
        if(res.data.status == 200)
        {
          that.data.organization.name = res.data.data.organization.name;
          that.setData({
            orgName: res.data.data.organization.name,
          });
        }
        
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    });

    

    this.setData({
      hide_register_lock_cover: true,
    });
  },


  //退出登录
  exitSystem:function(e){
    console.log('退出登录');

    wx.setStorageSync('exitSystem', 'yes');
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })

  },


  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  


})

//注册准备
function loadingSelections() {
  console.log('load picker dataset');

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
}

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

